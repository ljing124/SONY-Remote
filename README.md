# SONY_Remote
一个基于HTML+JS的使用SONY微单™数码相机官方遥控API的演示项目  
  
a simple demo to use Sony_CameraRemoteAPI
## 背景 BACKGROUND
本项目基于SONY官方提供的SDK开发：https://developer.sony.com/develop/cameras/  
该API使用HTML+JSON方式控制相机参数以及传输图像，使用webgl进行预览画面的实时处理
SONY官方的手机控制APP仅提供基本的拍摄控制和照片浏览功能，本项目针对更多的画面辅助监看功能进行了简单的实现  
在大部分SONY微单和RX设备上支持曝光模式调整、参数调整、遥控拍摄、画面预览，在部分较旧的相机型号上支持点击对焦  
该SKD目前已停止后续更新，但大部分设备(包括较新的ILCE-7RM3和RX100Ⅶ)仍能够正常使用这些API  
  
you can find the SDK of Remote API at ： https://developer.sony.com/develop/cameras/  
supported features: mode switch，parameter adjustment，touch AF，remote shoot，liveview  
Notice: the Camera Remote API has been archived in 2016 but most of it can still work on new model camera  
## 演示 DISPLAY
### 主界面 MAIN INTERFACE
![主界面](https://github.com/ljing124/SONY-Remote/blob/master/img/MAIN.png "主界面")
### 功能展示 FEATURES
![功能展示](https://github.com/ljing124/SONY-Remote/blob/master/img/FEATURES.png "伪色彩、触控对焦、直方图与波形图、光圈调整")
## 使用 HOW TO USE
你可以直接下载本demo并运行于本地浏览器中，在相机中启用智能遥控应用(旧型号)或选择使用手机控制(新型号)，将设备连接到相机的WIFI，然后刷新页面  
也可以将demo封装到IOS或安卓应用当中，这是更为推荐的做法  
注意：当使用浏览器以本地文件访问时，需要允许JS跨域访问，否则可能无法接收到相机的回传数据
  
1.connect your device to camera’s WIFI
2.run this demo
you can directly use this demo on most browser or in node.js environment  
but package it into APP using webview is more recommended  
when used on browser you may need to allow CORS request  
for example in chrome you need to run with --args --disable-web-security
## 注意 NOTICE
根据SDK中的说明，应当首先通过发送SSDP握手包来发现相机设备以及获取相机的控制URI，但因为项目使用HTML无法实现设备发现功能，因此直接将固定型号相机的URI写入到了源代码中，可以根据需要在modulechange()函数中添加和修改，目前已测试通过的相机有：  
ILCE-7RM3  ILCE-7M3  
RX100-Ⅳ RX100-Ⅴ
  
辅助监看功能（包括伪色彩、波形图、LUT等）需要webgl支持，对于不支持webgl的浏览器或设备会启用CANVAS替代，将导致实时预览性能的严重下降或进程假死，因此在Android 4.2以下设备或浏览器内核版本较低的嵌入式设备使用是不建议的    
拍摄控制功能需要fetch API支持，以用于跨域请求以及预览画面的回传  
