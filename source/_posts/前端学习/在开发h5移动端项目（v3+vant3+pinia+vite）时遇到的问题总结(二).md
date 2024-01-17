---
title: 在开发h5移动端项目（v3+vant3+pinia+vite）时遇到的问题总结(二)
date: 2023-3-01 18:12
tags: [H5项目,随笔]
categories: 前端随笔
---

<!-- <meta name="referrer" content="no-referrer" /> -->

## 一、h5页面嵌套在小程序中时，系统设置了深色模式，会出现背景色冲突、深色文字显示异常，深色图标显示异常等一些显示上的问题。
因为我司的项目，当时立项时并没有考虑适配深色模式，所以导致了这种情况
解决方式：
> 在相应的受深色模式影响的页面最外层div加上css  background设置为白色（因为我司项目，背景基本是白色所以这样改能行，但应该是不是通用的），当时是快上线了，发现这个问题，急着上就没去整适配，只能用这种办法。

具体的适配可以看看：
[h5适配深色模式 - 搜索 - 掘金 (juejin.cn)](https://juejin.cn/search?query=h5%E9%80%82%E9%85%8D%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F&type=0)
## 二、前端文本复制功能的实现
安装 `vue-clipboard3`

```js
$ npm install --save vue-clipboard3
```
使用 `vue-clipboard3`

```js
<button @click="copy(复制的内容)">复制的内容</button>


// 导入插件
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard() 
const copy = async (msg) => { 
    try { 
    // 复制 await toClipboard(msg) 
    // 复制成功 
    } 
    catch (e) {
    // 复制失败 
    } 
}   
```
## 三、v3+vant3的图片上传

```js
   <van-uploader
          :after-read="afterRead"
          :before-read="beforeRead"
          :before-delete="beforeDelete"
          v-model="cardForm.imgList"
          :max-count="3"
          preview-size="2.4rem"
          upload-text="最多3张"
        >
            <template #preview-delete>
                <img :src="getAssetsFile('iconDelete.png')" 
                :style="{ width: $px2rem('18px'), height: $px2rem('18px')}">
            </template>
        </van-uploader> 
```
js部分
```js
//图片上传前做判校验
  const beforeRead = (file: any) => {
    const type = ['image/jpeg' ,'image/png','image/jpg']
    const isImage = type.includes(file.type)
    const isLt5M = file.size / 1024 /1024 < 5
    if(!isImage) {
      Toast('请上传 jpg,png,jpeg 格式图片!');
    } 
    if(!isLt5M) {
      Toast('图片大小不能超过 5MB!');
    }
    return isImage&&isLt5M
  };
  //图片删除前
  const beforeDelete = (file:any,i:any) => {
    PicListParams.value.splice(i.index,1)
    return true;
  };
  //图片上传服务器
  const afterRead = async(file: any) => {
    console.log(file);
    file.status = 'uploading';
    file.message = '上传中...';
    const formData = new FormData();
    formData.append('file', file.file);
    //调用图片上传的接口
    //成功 file.status = 'none';并把返回的图片push
    //失败 file.status = 'fail'
  };
```


## 四、vant3表单使用textarea+autosize完成表单高度的自适应时，出现滚动条
解决方式：给vant3的表单的van-field__control加上 overflow-y: hidden
        
```js
      ::v-deep(.van-field__control) {
        overflow-y: hidden;
      }
```
## 五、localstorage只能存字符串，存对象时需要转化成json格式，用时记得转化回来
> 这个其实自己一直知道这个知识点，平时也嘎嘎在用，但是开发着开发着突然不知怎么脑袋抽筋了，忘转化了，导致localstorage.getItem获取的值一直没取到，第一时间还没考虑到是localstorage的原因，浪费了一些时间找问题所在，本来不想把这个当笔记记录的，但是为了让自己涨涨记性还是记下来。


```js
const object = reactive({
    name:'涨涨',
    age:18,
})
//用localstorage存值时
locastorage.setItem('object', JSON.stringify(object))

////用localstorage取值时
const JosnObject1 = locastorage.getItem('object')
const Object1 = Json.parse(JosnObject1)
```
## 六、小程序返回使用H5页面返回,放弃小程序自带返回按钮
最开始准备在小程序上使用自定义导航栏，但是自定义导航栏并不生效，取官网才发现：

![企业微信截图_16762707878468.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10323754a9114124b25c6d7cc84749e2~tplv-k3u1fbpfcp-watermark.image?)
> 既然设置不了自定义导航栏，而webview组件又自带导航，我又要放弃小程序自带返回按钮，于是另辟蹊径，webview组件自带导航栏背景颜色是白色，那我把返回按钮和文字都设置为白色，这样就看不到了，用户要点应该也不会取点一个看不到的返回按钮
> 
在小程序的page.json，对应的weiview的页面设置：
```js
  {
          "path": "webview/index",
          "style": {
            "navigationBarTextStyle": "white"
          }
        }
```
## 七、小程序嵌套h5项目时（使用的webview），从h5返回解决方式
>  最开始把这个逻辑分析下，不就是h5跳小程序吗？调接口跳转就行了，但去官网看了看因为使用的webview嵌套在小程序中，返回小程序提供了专门的API，调接口跳小程序真的是脱裤子放屁，多此一举（手动狗头）

解决方式：
在项目的index.html中引入微信官方提供的js-jdk，，就可以在页面中使用和 **微信相关的 API**

```js
 <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
```
使用：

```js
  wx.miniProgram.navigateBack() 
```

## 八、在微信小程序中使用webview嵌套h5，跳转三方后，从三方返回到自己的h5页面时原本存在locastorage和sessionstorage里的数据全没了
原因分析：
### 微信小程序中的 WebView

小程序的主要开发语言是 **`JavaScript`** ，其中 **逻辑层** 和 **渲染层** 是分开的，分别运行在不同的线程中，而其中的渲染层就是运行在 **`WebView`** 上：

| 运行环境     | 逻辑层            | 渲染层            |
| -------- | -------------- | -------------- |
| iOS      | JavaScriptCore | WKWebView      |
| 安卓       | V8             | chromium 定制内核  |
| 小程序开发者工具 | NWJS           | Chrome WebView

-   在真机中，需要实现同一域名下不同子路径的应用实现数据交互（纯前端操作，不涉及接口），由于同域名且是基于同一个页面进行跳转的（当然只是看起来是），而且这个数据是 **临时数据**，因此觉得使用 **`sessionStorage`** 实现数据交互是很合适的
-   实际上从 **A 应用** 跳转到 **B 应用** 中却无法获取对应的数据，而这是因为 **sessionStorage** 是基于当前窗口的会话级的数据存储，**移动端浏览器** 或 **微信内置浏览器** 中在跳转新页面时，可能打开的是一个新的 **WebView**，这就相当于我们在浏览器中的一个新窗口中进行存储，因此是没办法读取在之前的窗口中存储的数据

解决方式：
存了的东西没了，就想办法从三方回来时再存一遍呗。
## 九、vite获取环境变量遇到的坑
> 在根目录下的.env.prod文件中定义了需要的各种变量，其中定义了NODE_ENV和VITE_APP_ENV用来获取环境变量,发现import.meta.env.NODE_ENV为undefined，于是去官网看了看，只有VITE_前缀的变量才获取的到

```ts
NODE_ENV = 'production'
VITE_APP_ENV= 'production'
```

```js
conlose.log('import.meta.env.VITE_APP_ENV',import.meta.env.VITE_APP_ENV)  // 'production'
conlose.log('import.meta.env.NODE_ENV ',import.meta.env.NODE_ENV ) //undefined
```

![d2a09598800238e6e9cbedfe0e79596.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6257bd202c914c5198711539059f064a~tplv-k3u1fbpfcp-watermark.image?)