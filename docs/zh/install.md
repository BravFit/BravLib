# 安装方式

## 安卓

**方式一**，使用jar包和本地库
1. 下载我们的jar包和jnilibs，[下载链接](https://github.com/BravFit/BravLib/releases)

把jar包放入 `app/libs`目录，本地so库放入 `app/jniLis`目录

2. 修改`app/build.gradle`
```groovy
android{
  //其他设置
  sourceSets {
        main {
            jniLibs.srcDirs = ['jniLibs']
        }
    }
}

dependencies {
  implementation fileTree(dir: 'libs', include: ['*.jar'])
  //下面是其他依赖库
}

```

3. 在 `AndroidManifest.xml` 中添加必要的权限
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
```

**方式二**，使用 aar包

1. 下载我们的aar包，[下载链接](https://github.com/BravFit/BravLib/releases)

把aar包放入module的`app/libs`目录

2. 修改`app/build.gradle`

```groovy
repositories {
    flatDir{dirs 'libs'}
}

dependencies {
    implementation (name: 'bravlib-x.x.x', ext: 'aar')

    //下面是其他依赖库
}

```

aar包内部的`AndroidManifest.xml`已经把必要的权限声明加上了，APP的`AndroidManifest.xml`可以没必要重复添加


**方式三** 使用在线依赖包

该方式暂不支持，后续将会提供

## iOS

由于库使用swift5编写，为了避免OC引入时，包的体积过于庞大，所以提供两个framework的包，一个是静态库，一个动态库。两个库都包含了i386,x86_64,armv7,arm64的架构，可以支持真机和模拟器。

另外framework已经支持 `bitcode`，可以放心使用。

**方式一**，使用静态库

>该方式仅支持 Swift

1. 下载我们的静态framework，[下载地址](https://github.com/BravFit/BravLib/releases)

2. 添加到工程目录中，并添加到对应target。

3. 在 Builder Setting 中，添加framework中的头文件目录

```
Header search paths = $(PROJECT_DIR)/BravLibDemoIOS/libs/BravLib.framework/Headers
```

![Embed](@img/img_ios_config_headers.png)

**方式二**，使用动态库

1. 下载我们的动态framework，[下载地址](https://github.com/BravFit/BravLib/releases)

2. 添加到工程目录中，并设置为 **Embed**

![Embed](@img/img_ios_config_dynamic_embed.png)

> `Embed & Sign` 或 `Embed without signing` 都可以

如果遇到如下错误：

> Building for iOS, but the linked and embedded framework 'BravLib.framework' was built for iOS + iOS Simulator. 

可以修改在对应target的`Build Settings`中的 `Validate Workspace`，将其改为 `Yes`，然后重新运行，此时该错误就会变成警告，然后运行正常。

![Validate Workspace](@img/img_ios_config_dynamic_validate_workspace.png)

>此时再把其改为`No`也会正常运行

OC项目在添加时，建议使用动态链接库，以减小ipa包的体积，如果遇到如下错误：

![Error without swift](@img/img_ios_oc_error.png)

这是因为OC环境没有swift的运行时导致的。建议在OC项目下创建一个 `swift` 文件，然后xcode会自动生成 `桥接头文件`，然后 `clean` 项目，再重新运行即可。

刚创建的swift文件可以删除，`桥接头文件`也可以没有内容。


**请注意**
无论使用何种方式，都需要在 `info.plist` 中添加对使用蓝牙的申明
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>For connect smart device</string>
```
![Bluetooth](@img/img_ios_config_bluetooth_permission.png)


## 微信小程序

微信小程序需要使用插件来接入，我们有专门提供插件，该插件不用申请，可直接使用。

插件的appid为：`wx283194ba123397e5`

集成方式请参考微信官方文档 [使用插件](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

Demo 中有提供typescript的类型文件（.d.ts），为 `TypeScript` 类型的小程序提供类型辅助。具体目录是Demo项目中的 `miniprogram/lib/bravlib/types`