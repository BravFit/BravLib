---
sidebar: auto
---
# FAQ

## APP logic design related
### Do you need to bind or pair the device？
A concept needs to be clarified here. The binding or pairing mentioned in the question refers to adding a paired Bluetooth device in Android/iOS. Usually some standard equipment will be required, such as Bluetooth headset, stylus, bracelet. These will need to be set in the Bluetooth settings of the mobile phone system. But our scales are not used, we will explain the details in the next question

Bluetooth 4.0, also known as BLE, can be used directly without binding a Bluetooth device. The proprietary protocol used by our scale cannot be used directly through the Bluetooth of the mobile phone system, which is the case with almost all body fat scales on the market. The added device in our APP (BravFit) only allows the APP to remember the user's scale, not the Bluetooth pairing of the mobile phone system. The process of adding the device also guides the user on how to use the body fat scale. Our applet is made in a simple and rude way. After opening it directly without adding a scale, connect it to the scale for measurement.

The customer can decide whether to add this logic or not. It is suggested that if it is made into a small functional module of the APP, it can be directly made into a small program similar to ours, directly on the scale to measure and display the data.

### How to make the APP respond immediately after the user steps on the scale
Our own APP (BravFit), in normal use, allows users to open the APP, step on the scale, and measure immediately, which can reduce the user's operation steps. In fact, to put it bluntly, after opening the APP, the APP automatically calls a whole set of logic of the SDK, without the need for the user to click to select a device or the like. The specific implementation steps are as follows:
1. After entering the measurement interface, check the Bluetooth status
2. Bluetooth is turned on, start scanning
3. Scan to the body fat scale, and judge whether it is an added device or connect directly without judgment (this varies depending on the logic of the APP)
4. The connection is successful and the measurement animation is displayed
5. The measurement is completed and the measurement results are displayed

### After the measurement is completed, do you need to disconnect the Bluetooth connection immediately?
Usually there is no need to actively disconnect from the scale unless the user exits the measurement interface.

If the measurement needs to be disconnected immediately, it is best to delay the disconnection for 2s.

### How to analyze data

You can refer to the report section in the demo
## SDK function related

### The connection to the device has been unsuccessful or disconnected soon after success
- Check if the device is connected by someone else
- Check whether the currently connected device has been paired in the system Bluetooth. If it has been paired, you need to cancel the pairing
- Some mobile phones need to be scanned first to connect successfully, first scan the device and then connect

### After the scan is called successfully and the scale is stepped on, no device returns
- Check if it is correct **ACCESS_COARSE_LOCATION** and **ACCESS_FINE_LOCATION** Both applications have been applied, and both permissions have been verified in the SDK.
- Whether to compile version 26 and above, if so, both permissions need to be applied separately (new features in 8.0)

> For Android 6.0 and above, Google classifies Bluetooth as part of the positioning function. When using Bluetooth scanning, the user needs to authorize the positioning permission. Otherwise, when calling scan, the system will prompt that the positioning permission is required.
> When the location service switch is not turned on, it is also possible that the device cannot be scanned. Most of them are native.

### There is no data such as body fat percentage after the measurement is completed

1. Take off your shoes to measure. When wearing shoes, bio-impedance cannot be measured, so indicators such as body fat rate cannot be calculated

### Unable to scan the device, what to do
1. Check if Bluetooth is turned on、Is there a step on the light scale, and whether the mobile phone is too far away from the scale (more than 10 meters)
1. Check whether the scanned device has been connected by others
2. If it is Android, you can check whether you have positioning permission, and whether you have turned on the positioning service switch
3. Try to restart Bluetooth, if it doesn't work, try restarting Bluetooth.

## other problems

### Can you give the calculation method of body fat rate and other indicators？

temporarily unavailable


### What is offline data

When the ordinary bluetooth scale is not connected to the mobile phone during weighing, the scale will store the data in the scale, and the data will be transmitted to the APP when the bluetooth is connected next time.

Since the SDK cannot identify who the user is, it will assign this data to the APP, and the assigned user can hand it over to the SDK to calculate the complete data.

### Can provide Bluetooth protocol

In principle, we will not provide Bluetooth protocol, if you really need, you can communicate with our business/sales

### Why the BravFit data will be different when we use the SDK to measure the data

Compare whether all attributes in [BravScaleUser](api.md#bravscaleuser) are completely consistent, if they are completely consistent, you can consult the developer
### How to troubleshoot when the Bluetooth connection is abnormal in the online version
First find out the user's mobile phone model, if possible, try to use the same model as the customer to test.

Register the log output interface [QNLogListener](api/QNLogListener.md), record relevant logs (log files can be saved), and send them to our developers for analysis.
