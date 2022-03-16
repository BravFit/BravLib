---
sidebar: auto
---
# API

**api入口**
## BravApiProvider

蓝牙API的提供者，通过它可以获取蓝牙API的单例对象

**方法**

### initSharedBleApi 
- 类型 (context:Context)->void
>该参数仅安卓需要

初始化API，需要至少初始化一次。

### sharedBleApi
- 类型 ()-> [BravBleApi](#bravbleapi)

获取 BleApi 的单例对象。


## BravLogger

SDK用的日志工具，可以设置日志级别和设置日志监听器

**常量**

- public static final int LOG_LEVEL_NONE = 0;
- public static final int LOG_LEVEL_ERROR = 1;
- public static final int LOG_LEVEL_ALL = 2;

用来表示日志的级别，其中 `LOG_LEVEL_NONE` 表示在控制台不打印任何日志， `LOG_LEVEL_ERROR` 表示指打印错误日志， `LOG_LEVEL_ALL`表示打印所有日志

### loggerLevel
- 类型 Int  class级别变量
日志级别，可读可写。设置后可以印象SDK在控制台打印的日志
> 请使用上述3个常量来设置

### setLoggerListener 
- 类型 (loggerListener:[BravLoggerListener](#bravloggerlistener))
> 仅安卓可用

设置日志监听器，会把日志回调给 loggerListener

### loggerDelegate
- 类型 [BravLoggerDelegate](#bravloggerdelegate)
> 仅iOS可用

设置日志监听器，会把日志回调给 loggerDelegate


## BravLoggerListener
日志监听器，同 BravLoggerDelegate

## BravLoggerDelegate

日志监听器

### onLog
- 类型 (tag:String, text:String)->void

回调普通调试日志

### onError

- 类型 (tag:String, text:String)->void

回调错误日志信息

## BravBleApi

- 方法

### getBleEnableState

- 类型 ()-> [BravBleEnableState](#bravbleenablestate)

返回蓝牙的状态

### setBleEventListener
- 类型 (listener:[BravBleEventListener](#bravbleeventlistener))->void
> 仅安卓

设置蓝牙事件回调监听器

### bleEventDelegate
- 类型 [BravBleEventDelegate](#bravbleeventdelegate)
> 仅iOS

设置蓝牙事件回调监听器

### close

- 类型 ()->void

停止工作并释放资源

如果当前已经连接了设备，就会断开连接。

如果当前正在扫描，则会停止扫描


### startScan

- 类型 (options: [BravScanOptions](#bravscanoptions))-> [BravResult>](#bravresult)

启动蓝牙扫描，返回是否操作成功

### stopScan

- 类型 ()->void

停止扫描

### connectDevice

连接设备，并返回是否操作成功。

- 类型 (device:[BravDevice](#bravdevice),
  options:Any, 
  deviceEventListener:BravDeviceEventListener,
  connectionChangeListener:[BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate) )->BravResult

参数说明：

 - device 需要连接的设备对象，为了方便，SDK还重载了一个连接方法，只要传入 deviceId 即可。
 - options 配置项，请使用 [BravScaleDataOptions](#bravscaledataoptions) 来连接体脂秤
 - deviceEventListener 设备事件监听器，请使用 [BravScaleEventListener/BravScaleEventDelegate](#bravscaleeventdelegate)，来连接体脂秤
 - connectionChangeListener 用来监听设备连接状态的变化，是一个便捷API，可以传null/nil

 连接成功或断开连接会在[BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate)回调

### disconnectDevice

 断开连接设备

- 类型 (deviceId:String) ->void

断开连接的设备，断开连接会在[BravBleConnectionEventListener/BravBleConnectionEventDelegate](#bravbleconnectioneventdelegate)回调
## BravBleEventListener
同 `BravBleEventDelegate`

## BravBleEventDelegate
- 方法
### onBleEnableStateChange
- 类型 (state:[BravBleEnableState](#bravbleenablestate))->void

回调蓝牙状态的变化

### onBravDeviceFound
- 类型 (device:[BravDevice](#bravdevice))-void

回调扫描到的可用设备

## BravBleConnectionEventListener

同 BravBleConnectionEventDelegate

## BravBleConnectionEventDelegate

- 方法
### onConnectionChange
- 类型 (deviceId:String,state:[BravDeviceConnectionState](#bravdeviceconnectionstate))

回调蓝牙连接的状态变化

## BravScaleEventListener 

同 BravScaleEventDelegate

## BravScaleEventDelegate

体脂秤事件回调对象

### onGetUnsteadyWeight
- 类型 (deviceId:String, weight:Double)->void

获取到秤端不稳定重量的回调，APP可以同步显示界面，获得较好测量体验

### onMeasureComplete

- 类型 (deviceId:String,scaleData:[BravScaleData](#bravscaledata))->void

测量完成，回调完整的测量数据

### onGetOfflineData

- 类型 (deviceId:String, scaleData: [BravOriginScale](#bravscaleorigindata)\[\])->void

收到离线数据，[BravOriginScale](#bravscaleorigindata) 可结合 [BravScaleUser](#bravscaleuser)来生成完整的[BravScaleData](#bravscaledata)

>离线数据是，用户之前上秤测量时未连接APP，此时秤会缓存数据，并在下次连接APP回传上来。


**Model相关**


## BravDevice

### deviceId

- 类型 String

设备id，这个是手机上获取到设备的唯一标识，在安卓上表现为mac地址，在iOS上表现为udid

### mac
- 类型 String

设备的mac地址，每个设备唯一，格式如 `00:11:22:33:44:55`

可以用它来区别设备

### transferType

- 类型 [BravBleTransferType](#bravbletransfertype)

数据传输类型，目前仅 Broadcast (使用蓝牙广播传输数据)

## category

- 类型 [BravDeviceCategory](#bravdevicecategory)

设备类型，用来区分是体脂秤、血压计或者其他设备，目前仅支持体脂秤(Scale)

### modelId

- 类型 String

型号ID，用来唯一区别一款型号，格式如：`0001` 不同类别的设备，型号ID是分开编号的

### rssi

- 类型 Int

信号强度，表示蓝牙信号的强度，是一个小于0大于-127的整数，数值越小，信号越小

## BravScanOptions

### mac
- 类型：String

mac地址，如果值不为空，则SDK仅返回指定mac地址的设备

### minRssi

- 类型: Int

最小信号阈值，如果值<0，则SDK仅返回信号值大于该数值的设备。


**体脂秤相关 Model**
## BravScaleUser

体脂秤用户，用来传输给体脂秤，并最终测量结果的对象
### gender
- 类型 [BravGender](#bravgender)

性别

### height

- 类型 Int

身高，cm。如果APP是其他数值的单位，请转换为cm后再传入

有效值为：40~240

### age

- 类型 Int

有效值为：3~80

### athleteType

- 类型 Int

运动员体质类型，0为否，1为是。如果一个人运动量较大，建议使用该值为1传入，计算的体脂率较为准确

### scaleAlgorithmMethod

- 类型 [BravScaleAlgorithmMethod](#bravscalealgorithmmethod)

体脂秤算法类型，目前仅支持 `common` 和 `asia`

## BravScaleDevice

体脂秤设备对象，它继承自[BravDevice](#bravdevice)

### weight
- 类型 Double

表示当时体脂秤上的重量数值，单位是 kg，如果体脂秤已经连接，则该属性一直为0

### isScreenOn
- 类型 Boolean

表示体脂秤的屏幕是否亮了， `false` 为不亮， `true` 为亮

### isConnected 

- 类型 Boolean

表示体脂秤是否已经被连接， `false` 为未连接， `true` 为已连接

## BravScaleDataOptions

连接体脂秤需要的配置项

### user

- 类型 [BravScaleUser](#bravscaleuser)

连接体脂秤需要的用户信息。


### unit

- 类型 [BravScaleUnit](#bravscaleunit)

需要设置的体脂秤单位，每次连接体脂秤都会设置体脂秤的单位。

## BravScaleOriginData

秤端的原始数据

### weight
- 类型 Double

体重信息

### impedance

- 类型 Int

生物阻抗

### mac

- 类型 String

秤端的mac地址

### time

- 类型 Date

表示该条数据的测量时间，如果是实时测量，则会返回当前时间。精确到 s(秒)

## BravScaleData

体脂秤测量数据，它表示完整的测量数据

### user

- 类型 [BravScaleUser](#bravscaleuser)

表示该条数据对应的用户信息

### originData

- 类型 [BravScaleOriginData](#bravscaleorigindata)

表示该条数据对应的秤端原始数据

### weight
- 类型 Double

体重
### bmi
- 类型 Double

BMI
### bodyfatRate
- 类型 Double

体脂率
### bodyfatMass
- 类型 Double

脂肪量
### subfatRate
- 类型 Double

皮下脂肪
### visfat
- 类型 Double

内脏脂肪
### waterRate
- 类型 Double

体水分率
### waterMass
- 类型 Double

体水分量
### bmr
- 类型 Double

基础代谢率
### skeletalMuscleRate
- 类型 Int

骨骼肌率
### skeletalMuscleMass
- 类型 Double

骨骼肌量
### muscleMass
- 类型 Double

肌肉量
### muscleRate
- 类型 Double

肌肉率
### lbm
- 类型 Double

去脂体重
### bone
- 类型 Double

骨量
### proteinRate
- 类型 Double

蛋白质率
### proteinMass
- 类型 Double

蛋白质量
### score
- 类型 Double

分数
### bodyAge
- 类型 Int

体年龄


**类型常量**

## BravBleEnableState

枚举对象

蓝牙使能情况

### Unknown

未知，SDK为初始化，会为该状态

### Enable

可用

### Disable

不可用

### Unauthorized
>仅iOS

未授权，如果未状态，说明在设置中，用户未授权APP蓝牙权限


## BravBleTransferType

枚举对象

数据通讯方式

### BleConnection 

使用蓝牙连接进行连接通讯

### Broadcast

使用蓝牙广播的方式进行数据通讯

## BravDeviceCategory

枚举对象

设备对象

### Scale

体脂秤，目前仅支持体脂秤

## BravDeviceConnectionState
枚举对象

蓝牙连接状态

### Disconnected

未连接状态

### Connecting

正在连接的状态
>对于BravBleTransferType为broadcast的设备，不会出现该状态

### Connected

已连接状态，处于该状态下的设备，可以进行数据通讯

### Disconnecting

正在断开连接
>对于BravBleTransferType为broadcast的设备，不会出现该状态


## BravGender
性别

### Male

男性

### Female

女性

**体脂秤相关**
## BravScaleUnit

体脂秤的单位

这里要注意，不论体脂秤的单位什么，该文档中所有的 `weight` 都是以kg为单位
### kg
千克

### lb

磅

### st

英石

### jin
斤，中国专用单位

## BravScaleAlgorithmMethod
体脂秤算法类型
### common
普通算法类型，使用欧美地区用户

### asia

亚太地区

## BravErrorCode

错误码

### Success
操作成功

### DeviceNotFound

未发现该设备

### BluetoothDisabled

蓝牙未开启，需要开启蓝牙

### BluetoothUnauthorized
>仅iOS，安卓的权限需要自行判断定位权限

蓝牙未授权

### BluetoothNotInit

蓝牙未初始化，意味着未调用[BravApiProvider.initSharedApi](#initsharedbleapi)

## BravResult

操作结果，部分API的调用，会返回该对象，表示是否操作成功

### isSuccess

类型 Boolean

`true` 为操作成功， `false` 为操作失败

### code

类型 [BravErrorCode](#braverrorcode)

错误码，如果不为 `Success`，则表示出现的错误类型

### data

类型 泛型

根据不同的操作表示不同的类型

**工具方法**

## BravUtils

### toPrecision
- 类型：(value:Double , scale:Int)->Double
将 `value` 精确到 `scale` 个小数位

### kg2jin
- 类型 (value:Double)->Double

单位转换方法
### jin2kg
- 类型 (value:Double)->Double

单位转换方法
### kg2lb
- 类型 (value:Double)->Double

单位转换方法
### lb2kg
- 类型 (value:Double)->Double

单位转换方法
### jin2lb
- 类型 (value:Double)->Double

单位转换方法
### lb2jin
- 类型 (value:Double)->Double

单位转换方法