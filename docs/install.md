# installation method

## Android

**method one**, using jar packages and native libraries
1. Download our jar package and jnilibs, [download link](https://www.baidu.com)

Put the jar package into the `app/libs` directory, and the local so library into the `app/jniLis` directory

2. Modify `app/build.gradle`
```groovy
android{
//other settings
  sourceSets {
        main {
            jniLibs.srcDirs = ['jniLibs']
        }
    }
}

dependencies {
  implementation fileTree(dir: 'libs', include: ['*.jar'])
//The following are other dependent libraries
}

```

3. Add the necessary permissions in `AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
```

**Method 2**, using the aar package

1. Download our aar package, [download link](https://www.baidu.com)

Put the aar package into the `app/libs` directory of the module

2. Modify `app/build.gradle`

```groovy
repositories {
    flatDir{dirs 'libs'}
}

dependencies {
    implementation (name: 'bravlib-x.x.x', ext: 'aar')

//The following are other dependent libraries
}

```

The `AndroidManifest.xml` inside the aar package has added the necessary permission declarations, and the `AndroidManifest.xml` of the APP does not need to be added repeatedly


**way three** Use online dependencies

This method is not currently supported, and will be provided in the future

## iOS

Since the library is written in swift5, in order to avoid the large size of the package when OC is introduced, two framework packages are provided, one is a static library and the other is a dynamic library. Both libraries contain i386, x86_64, armv7, arm64 architectures and can support real machines and simulators.

In addition, the framework already supports `bitcode`, so you can use it with confidence.

**method one**, using a static library

> This method only supports Swift

1. Download our static framework, [download address](https://www.baidu.com)

2. Add it to the project directory and add it to the corresponding target.

3. In Builder Setting, add the header file directory in the framework

```
Header search paths = $(PROJECT_DIR)/BravLibDemoIOS/libs/BravLib.framework/Headers
```

![Embed](@img/img_ios_config_headers.png)

**Method 2**, using the dynamic library

1. Download our dynamic framework, [download address](https://www.baidu.com)

2. Add to the project directory and set to **Embed**

![Embed](@img/img_ios_config_dynamic_embed.png)

> `Embed &Either Sign or Embed without signing will work

If you encounter the following error:

> Building for iOS, but the linked and embedded framework 'BravLib.framework' was built for iOS + iOS Simulator. 

You can modify the `Validate Workspace` in the `Build Settings` of the corresponding target, change it to `Yes`, and then re-run, the error will become a warning, and then run normally.

![Validate Workspace](@img/img_ios_config_dynamic_validate_workspace.png)

> At this point, changing it to `No` will work normally

When adding an OC project, it is recommended to use a dynamic link library to reduce the size of the ipa package. If you encounter the following errors:

![Error without swift](@img/img_ios_oc_error.png)

This is because the OC environment does not have a swift runtime. It is recommended to create a `swift` file under the OC project, then xcode will automatically generate a `bridging header file`, then `clean` the project, and then re-run it.

The swift file just created can be deleted, or the `bridging header` file can have no content.


**caution**
No matter which method is used, you need to add a declaration of using bluetooth in `info.plist`
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>For connect smart device</string>
```
![Bluetooth](@img/img_ios_config_bluetooth_permission.png)
