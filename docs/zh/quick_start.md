# 快速上手

介绍如何使用我们的 SDK

## 初始化

获取我们的 [BravBleApi](./api.md#bravbleapi)，并设置事件回调对象。

入口是： [BravApiProvider](./api.md#bravapiprovider)

最好可以设置下日志监听器，把 SDK 的日志记录下，用以后续排查问题

> 文档不提供 `Java` , `Objective-C`和 `JavaScript` 代码示例，请自行根据 `Kotlin` , `Swift` 和 `TypeScript` 转化

### 安卓

需要先调用 [BravApiProvider.initSharedBleApi(Context)](api.md#initsharedbleapi)

之后可以使用 [BravApiProvider.sharedBleApi()](api.md#sharedbleapi)来获取蓝牙 API 对象

```kotlin
//这一段是设置日志，可以根据自身请决定是否设置
BravLogger.loggerLevel = BravLogger.LOG_LEVEL_ALL
BravLogger.setLoggerListener(object :BravLoggerListener{
    override fun onLog(tag: String?, text: String?) {
        //do save log
    }

    override fun onError(error: String?, text: String?) {
        //do save log
    }

})
//可以放到Application的onCreate方法，只要调用一次即可
BravApiProvider.initSharedBleApi(context)

val bleApi = BravApiProvider.sharedBleApi()



```

### iOS

```swift
import BravLib

BravLogger.loggerLevel = BravLogger.LOG_LEVEL_ALL
BravLogger.loggerDelegate = loggerDelegate

BravApiProvider.initSharedBleApi()

let bleApi = BravApiProvider.sharedBleApi


```

### 小程序

通常会在`app.js`或`app.ts`进行初始化。

这里在`app.json`配置的插件名称为：`brav-lib`

```typescript
// app.ts
const BravPlugin = requirePlugin('brav-lib');
const { BravApiProvider } = BravPlugin;

App<IAppOption>({
  globalData: {},
  onLaunch() {
    BravApiProvider.initSharedBleApi({ mode: 'miniprogram', mpwx: wx });
  },
});
```
> 这里把小程序的 wx 传入了插件中，这是因为插件的wx对象在蓝牙api方面有局限性（无法发射广播），所以需要传入小程序的wx对象，不过在插件中，用且仅用到蓝牙相关API

```typescript
// page/index/index.ts
import BravLibType from '../../lib/bravlib/types/typings';
const BravPlugin = requirePlugin('brav-lib');
const { BravApiProvider, BravScaleDataImpl } = BravPlugin;

this.bleApi = BravApiProvider.sharedBleApi;

});

```

## 前期工作

### 安卓

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

3. 检查蓝牙是否开启，这个 SDK 中有提供 API，[BravBleApi.bleEnableState](./api.md#getbleenablestate)

```kotlin
if(this.bleApi.bleEnableState != BravBleEnableState.Enable){
  //这里做蓝牙未打开的提示
}
```

### iOS

初始化 API 后，需要等到 [BravBleEventDelegate.onBleEnableStateChange] 中回调 `state == BravBleEnableState.Enable` 才能进行蓝牙扫描。

iOS 的机制在初始化后，一般会延迟 100-500ms 回调，如果想初始化后马上使用的话，可以做个延时处理。

### 小程序

在小程序中，需要额外判断是否已获取微信的蓝牙权限。具体可以参考如下代码（demo中有演示）：

```typescript
//检查各个权限是否正常
  async checkPermission() {
    const systemInfo = await wx.getSystemInfo();
    const appAuthorizeSetting = wx.getAppAuthorizeSetting();
    if (systemInfo.platform === 'ios') {
      if (appAuthorizeSetting.bluetoothAuthorized === 'denied') {
        //微信获得系统的蓝牙授权
        this.updateState('IOS未获得系统蓝牙权限');
        return false;
      }
    } else if (systemInfo.platform === 'android') {
      if (appAuthorizeSetting.locationAuthorized === 'denied') {
        this.updateState('Android未获得系统定位权限，无法使用蓝牙');
        return false;
      } else if (appAuthorizeSetting.locationAuthorized === 'authorized') {
        const systemSetting = wx.getSystemSetting();
        if (!systemSetting.locationEnabled) {
          //系统定位服务未启动，
          this.updateState('安卓未打开定位开关，无法使用');
          return false;
        }
      }
    } else {
      this.updateState('暂不支持该系统');
      return false;
    }

    const authSetting = (await wx.getSetting({})).authSetting;
    console.log('获取到的权限为：', appAuthorizeSetting, authSetting);
    if (!authSetting['scope.bluetooth']) {
      //没有蓝牙权限，则向用户申请
      try {
        await wx.authorize({ scope: 'scope.bluetooth' });
        console.log('授权成功');
      } catch (e) {
        //授权失败
        this.updateState('微信蓝牙权限授权失败');
        return false;
      }
    }
    return true;
  },
```

## 扫描设备

使用[BravBleApi.startScan](api.md#startscan)进行蓝牙扫描

### 安卓

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

### iOS

```swift
class BleModel: ObservableObject, BravBleEventDelegate{
    let tag = "BleModel"


    func onBleEnableStateChange(state: BleEnableState) {
        BravLogger.log(tag,"onBleEnableStateChange: ",state.rawValue)
        self.bleEnableState = state
    }

    func onBravDeviceFound(device: BravDevice) {
        BravLogger.log(tag,"device found \(device.mac)")
    }

    func onConnectionChange(deviceId: String, state: BravDeviceConnectionState) {
       BravLogger.log(tag,"connection state change：\(deviceId) \(state)")
    }

}

self.bleApi.setBleEventListener(BleModel())

self.bleApi.startScan(BravScanOptions())

self.bleApi.stopScan()


```

扫描到设备后，可以展示处理，让用户选择处理方式，也可以直接调用连接设备

另外，扫描到的设备可以根据 `device.category` 来判断设备类型，然后转换为对应的子设备类型

> 目前 SDK 仅支持体脂秤，所以 device.category 都为 [BravDeviceCategory](api.md#bravdevicecategory) 设备对象都是 [BravScaleDevice](./api.md#bravscaledevice)

### 小程序

```typescript
//在 onload 中
this.bleApi.bleEventDelegate = this.bleEventListener();

//定义蓝牙事件监听器
bleEventListener() {
    const onBravDeviceFound = (device: BravLibType.BravDevice) => {
      // console.log('发现设备：', device);
      this.handlerConnect(device);
    };
    /**
     * 监听蓝牙状态发生变化回调，连接成功或断开连接都会出触发
     */
    const onBleEnableStateChange = (state: BravLibType.BravBleEnableState) => {
      if (state === 'Enable') {
        this.updateState('蓝牙可用，空闲');
        this.doStartScan();
      } else {
        this.updateState('蓝牙不可用');
      }
      this.setData({
        available: state === 'Enable',
        state: 'paused',
      });
    };

    /**
     * 	监听设备连接成功回调
     */
    const onConnectionChange = (
      deviceId: string,
      state: BravLibType.BravDeviceConnectionState
    ) => {
      console.log('设备连接状态变化', deviceId, state);
      // this.connecting = false;
      const connected = state === 'Connected';
      this.updateState(connected ? '已连接' : '未连接');
      this.setData({
        connected,
        state: connected ? 'running' : 'paused',
      });
    };
    return {
      onBravDeviceFound,
      onBleEnableStateChange,
      onConnectionChange,
    };
  },

```

## 连接设备

需要根据不同的设备类型使用不同的事件监听接口以及可选项。

**连接体脂秤**


使用 [BravBleApi.connectDevice](api.md#connectdevice) 方法

- options [BravScaleDataOptions](./api.md#bravscaledataoptions)，它需要传入 [user:BravUser](api.md#bravscaleuser) 对象和 [unit:BravScaleUnit](api.md#bravscaleunit)
- scaleEventLister 是 [BravScaleEventListener](./api.md#bravscaleeventlistener) 对象，用来接收体脂秤数据回调

  > 其中 `user` 用来传入体脂秤用户信息，这里会用来计算身体数据，`unit`，用来设置体脂秤的称重单位

- connectionChangeListener 是 [BravBleConnectionChangeListener](./api.md#bravbleconnectionchangelistener) 对象，用来接收设备连接状态的变化，为方便处理测量界面逻辑增加的冗余接口，可以传 null
- 返回值： [BroadcastScaleHandler](./api.md#broadcastscalehandler) 暂时无用

测量结束后，APP 会在 BravScaleEventListener 的 onMeasureComplete 方法收到完整的测量数据 [BravScaleData](./api.md#bravscaledata) ，收到后，表示用户已经测量完成。

如果用户离开测量界面或者想要结束测量，则可以调用 [BravBleApi.disconnectDevice](api.md#disconnectdevice) 来断开和设备的连接。

### 安卓

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
  val result = this.bleApi.connectDevice(
      this.deviceId,
      BravScaleDataOptions(
          BravScaleUser(
              BravGender.Male,
              170,
              30
          ), BravScaleUnit.kg
      ),
      scaleEventLister,
      connectionChangeListener
  )
  if(result.isSuccess){
      scaleHandler = result.data as BroadcastScaleHandler

  }else{
      scaleHandler= null;
      Log.e(tag, "connect fail")
  }
}
```

### iOS

```swift
class MeasureModel:BravScaleEventDelegate,BravBleConnectionChangeDelegate{

  let tag = "MeasureModel"
  func onGetUnsteadyWeight(_ deviceId: String, _ weight: Double) {
        BravLogger.log(tag,"onGetUnsteadyWeight：\(weight) %")
    }

    func onMeasureComplete(_ deviceId: String, _ scaleData: BravScaleData) {

        BravLogger.log(tag,"Measure compliete bodyfat percentage：\(scaleData.bodyfatRate) %")
    }

    func onGetOfflineData(_ deviceId: String, _ scaleDataList: [BravOriginData]) {
        BravLogger.log(tag, "Received： \(scaleDataList.count)")
    }

    func onConnectionChange(deviceId: String, state: BravDeviceConnectionState) {
        BravLogger.log(tag,"connection state change：\(deviceId) \(state)")
    }
}

 func doConnect(){
    let user = BravScaleUser(gender:.Female,height:180,age:30)
    let options = BravScaleDataOptions(user:user ,unit: .kg)

    let _ = self.bleApi.connectDevice(deviceId: self.device.deviceId, options:options , listener: self.measureModel, connectionChangeListener: self.measureModel)
}
```
### 小程序

```typescript
 async handlerConnect(device: BravLibType.BravDevice) {
    const { height, gender, age, connected } = this.data;
    if (this.connecting || connected) {
      console.log('当前正在连接，不再处理');
      return;
    }
    this.connecting = true;
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - age);
    const user = {
      height,
      gender,
      age: 30,
    } as BravLibType.BravScaleUser;

    /**
     * 调用连接成功后，会返回本次连接的设备访问对象，可以对设备进行一些蓝牙数据通讯
     * 每次连接返回的都不一样，连接成功后，该对象开始可以操作，连接失败或断开后，该对象会失效
     */
    console.log('要连接的对象', device.deviceId);
    let ret = await this.bleApi.connectDevice(
      device.deviceId,
      { user, unit: 'kg' },
      this.deviceEventListener()
    );
    if (ret.isSuccess) {
      this.deviceHandler = ret.data as BravLibType.BravDeviceHandler;
    }

  },
```


## 测量界面逻辑处理

可以像 demo 或是我们的 APP(BravFit)那样，展示秤上面的实时重量

最好可以展示一些测量动画，提醒用户 APP 还在跟秤进行连接中。

测量结束后，建议立即展示测量报告，让用户可以对刚才的测量数据进行查看。

安卓和iOS的 Demo中，扫描到设备会展示一个列表，点击才会进行连接。

小程序的 Demo中，扫描到设备会立即进行连接。具体以何种方式，可以结合自身业务需求来

## 展示测量报告

各 demo 中，有展示如何显示测量报告的方法，参考 demo，然后设计一套漂亮的 UI 就可以展示报告了。
