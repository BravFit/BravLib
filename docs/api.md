---
sidebar: auto
---
# API

**API entry**
## BravApiProvider

The provider of the Bluetooth API, through which the singleton object of the Bluetooth API can be obtained

**method**

### initSharedBleApi 
- type (context:Context)->void
> This parameter is only required for Android

To initialize the API, it needs to be initialized at least once.

### sharedBleApi
- Types of ()-> [BravBleApi](#bravbleapi)

Get the singleton object of BleApi.


## BravLogger

The log tool used by the SDK, you can set the log level and set the log listener

**constant**

- public static final int LOG_LEVEL_NONE = 0;
- public static final int LOG_LEVEL_ERROR = 1;
- public static final int LOG_LEVEL_ALL = 2;

Used to indicate the level of the log, where `LOG_LEVEL_NONE` means do not print any log in the console, `LOG_LEVEL_ERROR` means print error log, `LOG_LEVEL_ALL` means print all logs

### loggerLevel
- class level variable of type Int
Log level, readable and writable. After setting, you can impress the logs printed by the SDK in the console
> Please use the above 3 constants to set

### setLoggerListener 
- type (loggerListener:[BravLoggerListener](#bravloggerlistener))
> Android only available

Set up a log listener, which will call back the log to loggerListener

### loggerDelegate
- Type [BravLoggerDelegate](#bravloggerdelegate)
> Only available on iOS

Set up a log listener, which will call back the log to loggerDelegate


## BravLoggerListener
Log listener, same as BravLoggerDelegate

## BravLoggerDelegate

log listener

### onLog
- Type (tag:String, text:String)->void

Callback normal debug log

### onError

- Type (tag:String, text:String)->void

Callback error log information

## BravBleApi

- method

### getBleEnableState

- Types of ()-> [BravBleEnableState](#bravbleenablestate)

Returns the status of bluetooth

### setBleEventListener
- type (listener:[BravBleEventListener](#bravbleeventlistener))->void
> Android only

Set up a Bluetooth event callback listener

### bleEventDelegate
- Type [BravBleEventDelegate](#bravbleeventdelegate)
> iOS only

Set up a Bluetooth event callback listener

### close

- Types of ()->void

stop work and free resources

If the device is currently connected, it will be disconnected.

If it is currently scanning, it will stop scanning


### startScan

- Type (options: [BravScanOptions](#bravscanoptions))->-[bravresult>](#bravresult)

Start bluetooth scan and return whether the operation is successful

### stopScan

- Types of ()->void

stop scanning

### connectDevice

Connect the device and return whether the operation was successful.

- type (device:[BravDevice](#bravdevice),
  options:Any, 
  deviceEventListener:BravDeviceEventListener,
  connectionChangeListener:[BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate) )->BravResult

Parameter Description:

- device is the device object that needs to be connected. For convenience, the SDK also overloads a connection method, just pass in deviceId.
- options configuration item, please use [BravScaleDataOptions](#bravscaledataoptions) to connect body fat scale
- deviceEventListener device event listener, please use [BravScaleEventListener/BravScaleEventDelegate](#bravscaleeventdelegate) to connect to the body fat scale
- connectionChangeListener is used to monitor the change of the connection state of the device. It is a convenient API that can pass null/nil

Successful connection or disconnection will be called back in [BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate)

### disconnectDevice

disconnect device

- Type (deviceId:String) ->void

Disconnected device, the disconnection will be called back in [BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate)
## BravBleEventListener
Same as `BravBleEventDelegate`

## BravBleEventDelegate
- method
### onBleEnableStateChange
- type (state:[BravBleEnableState](#bravbleenablestate))->void

Callback for changes in bluetooth status

### onBravDeviceFound
- type (device:[BravDevice](#bravdevice))-void

Callback for available devices scanned

## BravBleConnectionEventListener

同 BravBleConnectionEventDelegate

## BravBleConnectionEventDelegate

- method
### onConnectionChange
- Type (deviceId:String,state:[BravDeviceConnectionState](#bravdeviceconnectionstate))

Call back the state change of the bluetooth connection

## BravScaleEventListener 

同 BravScaleEventDelegate

## BravScaleEventDelegate

Body fat scale event callback object

### onGetUnsteadyWeight
- Type (deviceId:String, weight:Double)->void

Get the callback of the unstable weight of the scale, and the APP can display the interface synchronously to obtain a better measurement experience

### onMeasureComplete

- Type (deviceId:String,scaleData:[BravScaleData](#bravscaledata))->void

After the measurement is completed, the complete measurement data will be recalled

### onGetOfflineData

- Type (deviceId:String, scaleData: [BravOriginScale](#bravscaleorigindata)\[\])->void

After receiving offline data, [BravOriginScale](#bravscaleorigindata)-can-be-combined-with-[bravscaleuser](#bravscaleuser)-to-generate-a-complete-[bravscaledata](#bravscaledata)

> The offline data is that the user did not connect to the APP when he used the scale for measurement. At this time, the scale will cache the data and upload it back when the user connects to the APP next time.


**Model related**


## BravDevice

### deviceId

- type String

Device id, this is the unique identifier of the device obtained from the mobile phone, which is represented as mac address on Android and udid on iOS

### mac
- type String

The mac address of the device, unique for each device, the format is `00:11:22:33:44:55`

can be used to differentiate devices

### transferType

- Type [BravBleTransferType](#bravbletransfertype)

Data transmission type, currently only Broadcast (using Bluetooth broadcast to transmit data)

## category

- Type [BravDeviceCategory](#bravdevicecategory)

Equipment type, used to distinguish body fat scales、Blood pressure monitor or other equipment, currently only supports body fat scale (Scale)

### modelId

- type String

Model ID, used to uniquely distinguish a model, the format is: `0001` Different types of equipment, the model ID is numbered separately

### rssi

- type Int

Signal strength, indicating the strength of the Bluetooth signal, is an integer less than 0 and greater than -127, the smaller the value, the smaller the signal

## BravScanOptions

### mac
- Type: String

mac address, if the value is not empty, the SDK will only return the device with the specified mac address

### minRssi

- Types of: Int

Minimum signal threshold, if value<0, the SDK only returns devices whose signal value is greater than this value.


**Body Fat Scale Related Model**
## BravScaleUser

Body fat scale user, the object used to transmit to the body fat scale and the final measurement result
### gender
- Type [BravGender](#bravgender)

gender

### height

- type Int

Height, cm. If APP is the unit of other values, please convert it to cm and then pass it in

Valid values are: 40~240

### age

- type Int

Valid values are: 3~80

### athleteType

- type Int

Athlete physique type, 0 is no, 1 is yes. If a person has a large amount of exercise, it is recommended to use this value as 1, and the calculated body fat rate is more accurate

### scaleAlgorithmMethod

- type [BravScaleAlgorithmMethod](#bravscalealgorithmmethod)

Body fat scale algorithm type, currently only supports `common` and `asia`

## BravScaleDevice

Body fat scale device object, it inherits from [BravDevice](#bravdevice)

### weight
- type Double

Indicates the weight value on the body fat scale at that time, the unit is kg, if the body fat scale has been connected, this property is always 0

### isScreenOn
- type Boolean

Indicates whether the screen of the body fat scale is on, `false` is not bright, `true` is bright

### isConnected 

- type Boolean

Indicates whether the body fat scale has been connected, `false` is not connected, `true` is connected

## BravScaleDataOptions

Configuration items required to connect the body fat scale

### user

- type [BravScaleUser](#bravscaleuser)

User information required to connect to the body fat scale.


### unit

- Type [BravScaleUnit](#bravscaleunit)

The unit of the body fat scale that needs to be set. Each time the body fat scale is connected, the unit of the body fat scale will be set.

## BravScaleOriginData

Raw data on the scale

### weight
- type Double

weight information

### impedance

- type Int

bioimpedance

### mac

- type String

The mac address of the scale

### time

- type Date

Indicates the measurement time of this piece of data. If it is real-time measurement, it will return the current time. Accurate to s(seconds)

## BravScaleData

Body fat scale measurement data, it represents the complete measurement data

### user

- type [BravScaleUser](#bravscaleuser)

Indicates the user information corresponding to this piece of data

### originData

- type [BravScaleOriginData](#bravscaleorigindata)

Indicates the original data of the scale corresponding to this piece of data

### weight
- type Double

weight
### bmi
- type Double

BMI
### bodyfatRate
- type Double

body fat percentage
### bodyfatMass
- type Double

fat mass
### subfatRate
- type Double

subcutaneous fat
### visfat
- type Double

Visceral fat
### waterRate
- type Double

body water rate
### waterMass
- type Double

body water
### bmr
- type Double

Basal metabolic rate
### skeletalMuscleRate
- type Int

Skeletal muscle rate
### skeletalMuscleMass
- type Double

skeletal muscle mass
### muscleMass
- type Double

muscle mass
### muscleRate
- type Double

Muscle rate
### lbm
- type Double

lean body mass
### bone
- type Double

bone mass
### proteinRate
- type Double

protein rate
### proteinMass
- type Double

protein amount
### score
- type Double

Fraction
### bodyAge
- type Int

body age


**type constant**

## BravBleEnableState

enumeration object

Bluetooth enabled

### Unknown

Unknown, the SDK is initialized and will be in this state

### Enable

available

### Disable

unavailable

### Unauthorized
> iOS only

Unauthorized, if it is not in status, it means that in the settings, the user has not authorized the APP Bluetooth permission


## BravBleTransferType

enumeration object

data communication

### BleConnection 

Connect communication using Bluetooth connection

### Broadcast

Data communication using bluetooth broadcast

## BravDeviceCategory

enumeration object

device object

### Scale

Body fat scale, currently only supports body fat scale

## BravDeviceConnectionState
enumeration object

Bluetooth connection status

### Disconnected

not connected

### Connecting

Connecting state
> This state does not appear for devices with BravBleTransferType of broadcast

### Connected

Connected state, the device in this state can perform data communication

### Disconnecting

disconnecting
> This state does not appear for devices with BravBleTransferType of broadcast


## BravGender
gender

### Male

male

### Female

woman

**body fat scale**
## BravScaleUnit

body fat scale unit

It should be noted here that no matter what the unit of the body fat scale is, all `weight` in this document is in kg.
### kg
kilogram

### lb

lb

### st

Stone

### jin
Jin, a special unit for China

## BravScaleAlgorithmMethod
Types of Body Fat Scale Algorithms
### common
Common algorithm type, using users in Europe and the United States

### asia

Asia-Pacific

## BravErrorCode

error code

### Success
Successful operation

### DeviceNotFound

The device was not found

### BluetoothDisabled

Bluetooth is not turned on, need to turn on bluetooth

### BluetoothUnauthorized
> Only iOS, Android permissions need to determine the positioning permissions by themselves

Bluetooth not authorized

### BluetoothNotInit

Bluetooth is not initialized, meaning [BravApiProvider.initSharedApi](#initsharedbleapi) is not called

## BravResult

The operation result, some API calls, will return the object, indicating whether the operation is successful or not

### isSuccess

Type Boolean

`true` for successful operation, `false` for operation failure

### code

类型 [BravErrorCode](#braverrorcode)

Error code, if not `Success`, it indicates the type of error that occurred

### data

type generic

Represents different types according to different operations

**tool method**

## BravUtils

### toPrecision
- Type: (value:Double , scale:Int)->Double
Accurate `value` to `scale` decimal places

### kg2jin
- type (value:Double)->Double

unit conversion method
### jin2kg
- type (value:Double)->Double

unit conversion method
### kg2lb
- type (value:Double)->Double

unit conversion method
### lb2kg
- type (value:Double)->Double

unit conversion method
### jin2lb
- type (value:Double)->Double

unit conversion method
### lb2jin
- type (value:Double)->Double

unit conversion method
