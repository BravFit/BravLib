# Quick start

Explain how to use our SDK

## Initialize

Get our [BravBleApi](./api.md#bravbleapi) and set the event callback object.

The entry is: [BravApiProvider](./api.md#bravapiprovider)

It is best to set up a log listener to record the SDK logs for subsequent troubleshooting.

**android**

Need to call [BravApiProvider.initSharedbleApi(Context)](api.md#initsharedbleapi) first

Then you can use [BravApiProvider.sharedBleApi()](api.md#sharedbleapi) to get the Bluetooth API object

```kotlin
BravLogger.loggerLevel = BravLogger.LOG_LEVEL_ALL
BravLogger.setLoggerListener(object :BravLoggerListener{
    override fun onLog(tag: String?, text: String?) {
        //do save log
    }

    override fun onError(error: String?, text: String?) {
        //do save log
    }

})
//Can be placed in the onCreate method of Application, just call it once
BravApiProvider.initSharedBleApi(context)

val bleApi = BravApiProvider.sharedBleApi()



```

**iOS**

```swift
import BravLib

BravLogger.loggerLevel = BravLogger.LOG_LEVEL_ALL
BravLogger.loggerDelegate = loggerDelegate

BravApiProvider.initSharedBleApi()
        
let bleApi = BravApiProvider.sharedBleApi


```

> The document does not provide Java and Objective-C code examples, please convert according to kotlin and swift
## preliminary work

**android**

1. Check whether the APP has obtained the positioning permission, if not, you need to apply for the permission.

For mobile phones with Android 6.0 and above, Bluetooth scanning has been classified as part of the positioning service. If you use Bluetooth to scan the device, the APP must obtain the positioning permission.

```kotlin
//Check and apply for permission
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

//Other detailed codes can be searched online by yourself
```

2. Check whether the location service is enabled
   > It has been tested and verified that most of the current Android phones need to turn on the location service to scan the surrounding devices using Bluetooth.

It is recommended to check whether the location service is turned on before scanning. If it is not turned on, the user will be prompted to turn it on.

```kotlin
private fun checkGPSIsOpen(): Boolean {
    val locationManager = this.getSystemService(LOCATION_SERVICE) as LocationManager
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
}
```

3. Check whether Bluetooth is enabled, this SDK provides API, [BravBleApi.bleEnableState](./api.md#getbleenablestate)

```kotlin
if(this.bleApi.bleEnableState != BravBleEnableState.Enable){
//Here is the prompt that bluetooth is not turned on
}
```

**iOS**

After initializing the API, you need to wait until the callback `state == BravBleEnableState.Enable` in [BravBleEventDelegate.onBleEnableStateChange]to perform Bluetooth scanning.

After the iOS mechanism is initialized, the callback will generally be delayed for 100-500ms. If you want to use it immediately after initialization, you can do a delay processing.


## scan device

Bluetooth scan using [BravBleApi.startScan](api.md#startscan)

**android**
```kotlin

private val bleEventListener = object : BravBleEventListener {
    override fun onBleEnableStateChange(state: BravBleEnableState) {
        Log.d("ble", "onBleEnableStateChange" + state)
    }

//Process the scanned device here
    override fun onBravDeviceFound(device: BravDevice) {


    }

    override fun onConnectionChange(deviceId: String, state: BravDeviceConnectionState) {
        Log.d("ble", "onConnectionChange " + state)
    }

}

//where this.bleEventListener is the object of BravBleEventListener. Note here that if it is not used, it needs to be set to null to avoid memory leaks
this.bleApi.setBleEventListener(this.bleEventListener)


//start scanning
this.bleApi.startScan(BravScanOptions())


//Stop scanning, usually when exiting the device interface
this.bleApi.stopScan();

```
**iOS**
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

After scanning to the device, you can display the processing, let the user choose the processing method, or directly call the connected device

In addition, the scanned device can judge the device type according to `device.category`, and then convert it to the corresponding sub-device type

> Currently SDK only supports body fat scale, so device.category is [BravDeviceCategory](api.md#bravdevicecategory)-and-device-object-is-[bravscaledevice](./api.md#bravscaledevice)

## connect device

You need to use different event monitoring interfaces and options according to different device types.

**Connecting the Body Fat Scale**


**android**
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
Log.d(tag, "End of measurement: " + scaleData.bodyfatRate)

        turnToReport(scaleData)

    }

    override fun onGetOfflineData(deviceId: String, scaleDataList: Array<BravScaleOriginData>) {
Log.d(tag, "Received offline data" + scaleDataList.toString())
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

**iOS**

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


Use the [BravBleApi.connectDevice](api.md#connectdevice) method

- options [BravScaleDataOptions](./api.md#bravscaledataoptions),-which-needs-to-be-passed-in-[user:bravuser](api.md#bravscaleuser)-object-and-[unit:bravscaleunit](api.md#bravscaleunit)
- scaleEventLister is [BravScaleEventListener](./api.md#bravscaleeventlistener) object, used to receive body fat scale data callback

  > Among them, `user` is used to pass in the user information of the body fat scale, which will be used to calculate the body data, and `unit` is used to set the weighing unit of the body fat scale.

- connectionChangeListener is the [BravBleConnectionChangeListener](./api.md#bravbleconnectionchangelistener) object, which is used to receive changes in the connection state of the device. To facilitate the processing of redundant interfaces added by the measurement interface logic, you can pass null
- Return value: [BroadcastScaleHandler](./api.md#broadcastscalehandler) temporarily useless

After the measurement is over, the APP will receive the complete measurement data [BravScaleData](./api.md#bravscaledata) in the onMeasureComplete method of BravScaleEventListener. After receiving, it means that the user has completed the measurement.

If the user leaves the measurement interface or wants to end the measurement, he can call [BravBleApi.disconnectDevice](api.md#disconnectdevice) to disconnect from the device.

## Measurement interface logic processing

You can display the real-time weight on the scale like a demo or our APP (BravFit)

It is best to show some measurement animations to remind the user that the APP is still connecting with the scale.

After the measurement, it is recommended to display the measurement report immediately so that the user can view the measurement data just now.

## show measurement report

In the Android and iOS demos, there is a method to show how to display the measurement report. Refer to the demo, and then design a beautiful UI to display the report.
