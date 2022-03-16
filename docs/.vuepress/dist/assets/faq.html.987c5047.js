import{r as i,o as s,c as h,a as t,b as a,w as n,F as r,d,e}from"./app.9c809a05.js";import{_ as c}from"./plugin-vue_export-helper.21dcd24c.js";const l={},u=d('<h1 id="common-problem" tabindex="-1"><a class="header-anchor" href="#common-problem" aria-hidden="true">#</a> common problem</h1><h2 id="app-logic-design-related" tabindex="-1"><a class="header-anchor" href="#app-logic-design-related" aria-hidden="true">#</a> APP logic design related</h2><h3 id="do-you-need-to-bind-or-pair-the-device" tabindex="-1"><a class="header-anchor" href="#do-you-need-to-bind-or-pair-the-device" aria-hidden="true">#</a> Do you need to bind or pair the device\uFF1F</h3><p>A concept needs to be clarified here. The binding or pairing mentioned in the question refers to adding a paired Bluetooth device in Android/iOS. Usually some standard equipment will be required, such as Bluetooth headset, stylus, bracelet. These will need to be set in the Bluetooth settings of the mobile phone system. But our scales are not used, we will explain the details in the next question</p><p>Bluetooth 4.0, also known as BLE, can be used directly without binding a Bluetooth device. The proprietary protocol used by our scale cannot be used directly through the Bluetooth of the mobile phone system, which is the case with almost all body fat scales on the market. The added device in our APP (BravFit) only allows the APP to remember the user&#39;s scale, not the Bluetooth pairing of the mobile phone system. The process of adding the device also guides the user on how to use the body fat scale. Our applet is made in a simple and rude way. After opening it directly without adding a scale, connect it to the scale for measurement.</p><p>The customer can decide whether to add this logic or not. It is suggested that if it is made into a small functional module of the APP, it can be directly made into a small program similar to ours, directly on the scale to measure and display the data.</p><h3 id="how-to-make-the-app-respond-immediately-after-the-user-steps-on-the-scale" tabindex="-1"><a class="header-anchor" href="#how-to-make-the-app-respond-immediately-after-the-user-steps-on-the-scale" aria-hidden="true">#</a> How to make the APP respond immediately after the user steps on the scale</h3><p>Our own APP (BravFit), in normal use, allows users to open the APP, step on the scale, and measure immediately, which can reduce the user&#39;s operation steps. In fact, to put it bluntly, after opening the APP, the APP automatically calls a whole set of logic of the SDK, without the need for the user to click to select a device or the like. The specific implementation steps are as follows:</p><ol><li>After entering the measurement interface, check the Bluetooth status</li><li>Bluetooth is turned on, start scanning</li><li>Scan to the body fat scale, and judge whether it is an added device or connect directly without judgment (this varies depending on the logic of the APP)</li><li>The connection is successful and the measurement animation is displayed</li><li>The measurement is completed and the measurement results are displayed</li></ol><h3 id="after-the-measurement-is-completed-do-you-need-to-disconnect-the-bluetooth-connection-immediately" tabindex="-1"><a class="header-anchor" href="#after-the-measurement-is-completed-do-you-need-to-disconnect-the-bluetooth-connection-immediately" aria-hidden="true">#</a> After the measurement is completed, do you need to disconnect the Bluetooth connection immediately?</h3><p>Usually there is no need to actively disconnect from the scale unless the user exits the measurement interface.</p><p>If the measurement needs to be disconnected immediately, it is best to delay the disconnection for 2s.</p><h3 id="how-to-analyze-data" tabindex="-1"><a class="header-anchor" href="#how-to-analyze-data" aria-hidden="true">#</a> How to analyze data</h3><p>You can refer to the report section in the demo</p><h2 id="sdk-function-related" tabindex="-1"><a class="header-anchor" href="#sdk-function-related" aria-hidden="true">#</a> SDK function related</h2><h3 id="the-connection-to-the-device-has-been-unsuccessful-or-disconnected-soon-after-success" tabindex="-1"><a class="header-anchor" href="#the-connection-to-the-device-has-been-unsuccessful-or-disconnected-soon-after-success" aria-hidden="true">#</a> The connection to the device has been unsuccessful or disconnected soon after success</h3><ul><li>Check if the device is connected by someone else</li><li>Check whether the currently connected device has been paired in the system Bluetooth. If it has been paired, you need to cancel the pairing</li><li>Some mobile phones need to be scanned first to connect successfully, first scan the device and then connect</li></ul><h3 id="after-the-scan-is-called-successfully-and-the-scale-is-stepped-on-no-device-returns" tabindex="-1"><a class="header-anchor" href="#after-the-scan-is-called-successfully-and-the-scale-is-stepped-on-no-device-returns" aria-hidden="true">#</a> After the scan is called successfully and the scale is stepped on, no device returns</h3><ul><li>Check if it is correct <strong>ACCESS_COARSE_LOCATION</strong> and <strong>ACCESS_FINE_LOCATION</strong> Both applications have been applied, and both permissions have been verified in the SDK.</li><li>Whether to compile version 26 and above, if so, both permissions need to be applied separately (new features in 8.0)</li></ul><blockquote><p>For Android 6.0 and above, Google classifies Bluetooth as part of the positioning function. When using Bluetooth scanning, the user needs to authorize the positioning permission. Otherwise, when calling scan, the system will prompt that the positioning permission is required. When the location service switch is not turned on, it is also possible that the device cannot be scanned. Most of them are native.</p></blockquote><h3 id="there-is-no-data-such-as-body-fat-percentage-after-the-measurement-is-completed" tabindex="-1"><a class="header-anchor" href="#there-is-no-data-such-as-body-fat-percentage-after-the-measurement-is-completed" aria-hidden="true">#</a> There is no data such as body fat percentage after the measurement is completed</h3><ol><li>Take off your shoes to measure. When wearing shoes, bio-impedance cannot be measured, so indicators such as body fat rate cannot be calculated</li></ol><h3 id="unable-to-scan-the-device-what-to-do" tabindex="-1"><a class="header-anchor" href="#unable-to-scan-the-device-what-to-do" aria-hidden="true">#</a> Unable to scan the device, what to do</h3><ol><li>Check if Bluetooth is turned on\u3001Is there a step on the light scale, and whether the mobile phone is too far away from the scale (more than 10 meters)</li><li>Check whether the scanned device has been connected by others</li><li>If it is Android, you can check whether you have positioning permission, and whether you have turned on the positioning service switch</li><li>Try to restart Bluetooth, if it doesn&#39;t work, try restarting Bluetooth.</li></ol><h2 id="other-problems" tabindex="-1"><a class="header-anchor" href="#other-problems" aria-hidden="true">#</a> other problems</h2><h3 id="can-you-give-the-calculation-method-of-body-fat-rate-and-other-indicators" tabindex="-1"><a class="header-anchor" href="#can-you-give-the-calculation-method-of-body-fat-rate-and-other-indicators" aria-hidden="true">#</a> Can you give the calculation method of body fat rate and other indicators\uFF1F</h3><p>temporarily unavailable</p><h3 id="what-is-offline-data" tabindex="-1"><a class="header-anchor" href="#what-is-offline-data" aria-hidden="true">#</a> What is offline data</h3><p>When the ordinary bluetooth scale is not connected to the mobile phone during weighing, the scale will store the data in the scale, and the data will be transmitted to the APP when the bluetooth is connected next time.</p><p>Since the SDK cannot identify who the user is, it will assign this data to the APP, and the assigned user can hand it over to the SDK to calculate the complete data.</p><h3 id="can-provide-bluetooth-protocol" tabindex="-1"><a class="header-anchor" href="#can-provide-bluetooth-protocol" aria-hidden="true">#</a> Can provide Bluetooth protocol</h3><p>In principle, we will not provide Bluetooth protocol, if you really need, you can communicate with our business/sales</p><h3 id="why-the-bravfit-data-will-be-different-when-we-use-the-sdk-to-measure-the-data" tabindex="-1"><a class="header-anchor" href="#why-the-bravfit-data-will-be-different-when-we-use-the-sdk-to-measure-the-data" aria-hidden="true">#</a> Why the BravFit data will be different when we use the SDK to measure the data</h3>',33),p=e("Compare whether all attributes in "),m=e("BravScaleUser"),f=e(" are completely consistent, if they are completely consistent, you can consult the developer"),b=t("h3",{id:"how-to-troubleshoot-when-the-bluetooth-connection-is-abnormal-in-the-online-version",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#how-to-troubleshoot-when-the-bluetooth-connection-is-abnormal-in-the-online-version","aria-hidden":"true"},"#"),e(" How to troubleshoot when the Bluetooth connection is abnormal in the online version")],-1),y=t("p",null,"First find out the user's mobile phone model, if possible, try to use the same model as the customer to test.",-1),w=e("Register the log output interface "),g=e("QNLogListener"),v=e(", record relevant logs (log files can be saved), and send them to our developers for analysis.");function _(B,k){const o=i("RouterLink");return s(),h(r,null,[u,t("p",null,[p,a(o,{to:"/api.html#bravscaleuser"},{default:n(()=>[m]),_:1}),f]),b,y,t("p",null,[w,a(o,{to:"/api/QNLogListener.html"},{default:n(()=>[g]),_:1}),v])],64)}var P=c(l,[["render",_]]);export{P as default};
