# 快速上手

介绍如何使用我们的 SDK

## 初始化

获取我们的 [BravBleApi](./api.md#bravbleapi)，并设置事件回调对象。

入口是： [BravApiProvider](./api.md#bravapiprovider)

**安卓**

需要先调用 `BravApiProvider.initSharedBleApi(Context)`，该方法也会返回 `BravApiProvider`,另外还提供一个无需传入 Context 对象也能获取的方法:`BravApiProvider.getSharedBleApi()`

```kotlin

//可以放到Application的onCreate方法，只要调用一次即可
BravApiProvider.initSharedBleApi(this)

val bleApi = BravApiProvider.getSharedBleApi()

```

> 文档不提供 Java 代码示例，Java 的调用方式跟 kotlin 并无差别，请自行转换

## 前期工作

**安卓**

1. 检查 APP 是否已经获得到了定位权限，如果没有权限，则需要进行权限的申请。

安卓 6.0 及以上的手机，已经把蓝牙扫描归为定位服务的一部分，如果使用蓝牙扫描设备，则 APP 必须要获得定位权限。

```kotlin
//检查并申请权限
private fun checkPermissions() {
    val permissions = arrayOf(Manifest.permission.ACCESS_FINE_LOCATION)
    val permissionDeniedList: MutableList<String> = ArrayList()
    for (permission in permissions) {
        val permissionCheck = ContextCompat.checkSelfPermission(this, permission)
        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
            onPermissionGranted(permission)
        } else {
            permissionDeniedList.add(permission)
        }
    }
    if (!permissionDeniedList.isEmpty()) {
        val deniedPermissions = permissionDeniedList.toTypedArray()
        ActivityCompat.requestPermissions(
            this,
            deniedPermissions,
            REQUEST_CODE_PERMISSION_LOCATION
        )
    }
}

//其他详细代码可以自行在网上搜索
```

2. 检查定位服务是否开启
   > 经测试验证，目前绝大部分的安卓手机，都是需要打开定位服务才能使用蓝牙扫描到周围设备。

建议扫描前，检查定位服务是否打开，如果未打开，则提示用户打开

```kotlin
private fun checkGPSIsOpen(): Boolean {
    val locationManager = this.getSystemService(LOCATION_SERVICE) as LocationManager
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
}
```

3. 检查蓝牙是否开启，这个 SDK 中有提供 API，[BravBleApi.bleEnableState](./api.md)

```kotlin
if(this.bleApi.bleEnableState != BravBleEnableState.Enable){
  //这里做蓝牙未打开的提示
}
```

## 扫描设备

```kotlin

private val bleEventListener = object : BravBleEventListener {
    override fun onBleEnableStateChange(state: BravBleEnableState) {
        Log.d("ble", "onBleEnableStateChange" + state)
    }

    //这里处理扫描到的设备
    override fun onBravDeviceFound(device: BravDevice) {


    }

    override fun onConnectionChange(deviceId: String, state: BravDeviceConnectionState) {
        Log.d("ble", "onConnectionChange " + state)
    }

}

//其中this.bleEventListener是 BravBleEventListener 的对象，这里注意如果无需使用时，需要置为null，免得内存泄露
this.bleApi.setBleEventListener(this.bleEventListener)


//开始扫描
this.bleApi.startScan(BravScanOptions())


//停止扫描，一般是在退出设备界面时处理
this.bleApi.stopScan();

```

扫描到设备后，可以展示处理，让用户选择处理方式，也可以直接调用连接设备

另外，扫描到的设备可以根据 `device.category` 来判断设备类型，然后转换为对应的子设备类型

> 目前 SDK 仅支持体脂秤，所以 device.category 都为 BravDeviceCategory 设备对象都是 BravScaleDevice

## 连接设备

需要根据不同的设备类型使用不同的事件监听接口以及可选项。

**连接体脂秤**

```kotlin

private val connectionChangeListener =
        BravBleConnectionChangeListener { deviceId, state ->
            Log.d(tag, "BravBleConnectionChangeListener " + state)

        }

private val scaleEventLister = object : BravScaleEventListener {
    override fun onGetUnsteadyWeight(deviceId: String, weight: Double) {
        if (!isAdded) {
            return
        }
        binding.weightTv.text = String.format("%02f kg", weight)
    }

    override fun onMeasureComplete(deviceId: String, scaleData: BravScaleData) {
        Log.d(tag, "测量结束: " + scaleData.bodyfatRate)

        turnToReport(scaleData)

    }

    override fun onGetOfflineData(deviceId: String, scaleDataList: Array<BravScaleOriginData>) {
        Log.d(tag, "收到离线数据 " + scaleDataList.toString())
    }
}

fun doConnect(){
  val scaleHandler = this.bleApi.connectDevice(
      this.deviceId,
      BravScaleDataOptions(BravUser(BravGender.Male, 170, 30), BravScaleUnit.kg),
      scaleEventLister,
      connectionChangeListener
  ) as BroadcastScaleHandler
  if (scaleHandler == null) {
      Log.e(tag, "connect fail")
  }
}
```

使用 [BravBleApi.connectDevice]() 方法
- options [BravScaleDataOptions](./api.md#bravscaledataoptions)，它需要传入 [user:BravUser]() 对象和 [unit:BravScaleUnit]
- scaleEventLister 是 [BravScaleEventListener](./api.md/bravscaleeventlistener) 对象，用来接收体脂秤数据回调
>其中 `user` 用来传入体脂秤用户信息，这里会用来计算身体数据，`unit`，用来设置体脂秤的称重单位

- connectionChangeListener  是 [BravBleConnectionChangeListener](./api.md#bravbleconnectionchangelistener) 对象，用来接收设备连接状态的变化，为方便处理测量界面逻辑增加的冗余接口，可以传null
- 返回值： [BroadcastScaleHandler](./api.md#broadcastscalehandler) 暂时无用

测量结束后，APP会在  BravScaleEventListener 的 onMeasureComplete 方法收到完整的测量数据 [BravScaleData](./api.md#bravscaledata) ，收到后，表示用户已经测量完成。

如果用户离开测量界面或者想要结束测量，则可以调用 [BravBleApi.disconnectDevice] 来断开和设备的连接。


## 测量界面逻辑处理

可以像demo或是我们的APP(BravFit)那样，展示秤上面的实时重量

最好可以展示一些测量动画，提醒用户APP还在跟秤进行连接中。

测量结束后，建议立即展示测量报告，让用户可以对刚才的测量数据进行查看。

## 展示测量报告

安卓demo，有展示如何显示测量报告的方法

