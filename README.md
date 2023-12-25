![onedoc - 壹道文库](static/images/logo.png)

# ONEDOC - 壹道文库

ONEDOC - 壹道文库，基于`uni-app`开发的魔豆文库配套小程序和APP(适配中)，可搜索、收藏、购买和下载文档，以及购买VIP会员等功能。

> 原`moredoc-app`更名为`onedoc`，以作为一款正式的产品进行维护和迭代，后续将会有更多的功能和优化。社区版魔豆文库的小程序也在适配中。

**当前版本需要魔豆文库专业版v2.2或以上版本**


魔豆文库程序下载：[https://gitee.com/mnt-ltd/moredoc/releases](https://gitee.com/mnt-ltd/moredoc/releases)


## 二次开发

1. 下载最新的hbuilderx
2. 将 `config.example.js` 重命名为 `config.js`，并修改 `addr` 配置项。
    - **如暂时没有魔豆文库专业版的后端服务，可以配置魔豆文库演示站点地址，如：`https://moredoc.mnt.ltd`**
    - 登录账号可以用管理员账号登录
        - 账号： admin
        - 密码： mnt.ltd
3. 执行 `npm install`，安装相关依赖
4. 修改`manifest.json`的微信小程序appid为您的微信小程序appid
5. 使用`hbuilderx`开发

### 程序发布

在 `HBuilderX` 中编译发布，发布后的文件在 `unpackage` 目录下，将 `unpackage` 目录下的打包上传到微信小程序后台即可。

### 后端配置

- 小程序首页轮播图：管理后台 -> 横幅管理 -> 新增，选择类型为`小程序横幅`，并填写相关信息

- 小程序配置：管理后台 -> 系统配置 -> 小程序配置

## 功能

- 文档筛选检索
- 微信支付
- 文档下载
- 文档搜索
- 文档阅读
- 文档评论
- 个人中心
    - 订单管理
    - VIP会员
    - 我的收藏
    - 资料、密码修改
- 用户登录注册
- 手机号码登录注册
- 观看视频激励广告，获得积分和免费下载文档



## 页面预览

### 首页

<img src="unpackage/images/index.jpg" width="480px"/> &nbsp;&nbsp;
<img src="unpackage/images/index2.jpg" width="480px"/>

### 资料库

<img src="unpackage/images/source.jpg" width="480px"/> &nbsp;&nbsp;

### 个人中心

<img src="unpackage/images/me.jpg" width="480px"/> &nbsp;&nbsp;

### 搜索

<img src="unpackage/images/search.jpg" width="480px"/> &nbsp;&nbsp;
<img src="unpackage/images/result.jpg" width="480px"/>

### 文档阅读

<img src="unpackage/images/document.jpg" width="480px"/>

### 订单支付

<img src="unpackage/images/order.jpg" width="480px"/>

## 开源协议

- Apache 2.0

> 无需征询商用授权，可免费使用，如果能声明使用的是`ONEDOC`，则是对我们莫大的支持。

## Author

- 企业：深圳市摩枫网络科技有限公司 
- Enterprise：Morefun Network Technology Co., Ltd 
- 官网：[https://mnt.ltd](https://mnt.ltd)

