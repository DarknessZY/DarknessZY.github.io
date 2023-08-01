---
title: 在开发h5移动端项目（v3+vant3+pinia+vite）时遇到的问题总结
date: 2022-12-30 14:23
tags: [H5项目，随笔]
categories: 前端随笔
---
<!-- <meta name="referrer" content="no-referrer" /> -->

# 一.移动端适配和适配后内联样式没有生效
## 移动端适配
> 既然是整移动端项目，那么移动端适配是必须要整了，目前开发的这个项目就是使用的是`rem方案`，`rem方案`的话比较常用的插件就是postcss-pxtorem+lib-flexible，至于为什么没用`vw方案`, vw 方案 还是有缺点的。如 `vw 方案`**不适合大屏**，因为 vw 是一个比例单位，随着屏幕尺寸变大，使用vw单位的元素、字体也越来越大。但我们肯定是希望在大屏上展示更多的内容，而不是更大的文字、图标。现在用大屏的用户也是挺多的，我自己感觉还是`rem方案`好一点点（手动狗头）


```js
yarn add amfe-flexible
yarn add -D postcss-pxtorem
```
根目录下postcss.config.cjs
```js
module.exports = {
    plugins: {
      'postcss-pxtorem': {
        //如果你蓝湖上的UI图尺寸为375px，这里rootValue设置为37.5
        //如果你蓝湖上的UI图尺寸为750px，这里rootValue设置为75
        //蓝湖上的UI图的尺寸可以调节的，移动端一般用的37.5
        rootValue: 37.5,
        propList: ['*'],
      },
    },
};
```
main.ts中
```js
import 'amfe-flexible';
```
## 内联样式没有生效
> ***整完这些后，开发着开发着，用vant样式没事，自己写的样式也嘎嘎生效，突然有个dom元素需要加个动态样式，或者图片需要设置宽高，这就需要使用到内联样式，然后就发现了设置的内联样式不生效，弔！***

解决方法也挺简单，就是在main.ts中定义一个全局方法，用来把px转化成rem：                            
main.ts中加上
```js
const px2rem = (px:any) => {
    if(/%/ig.test(px)){ // 有百分号%，特殊处理，表述pc是一个有百分号的数，比如：90%
      return px
    }else{
      return (parseFloat(px) / 37.5) + 'rem'
    }
  }
app.config.globalProperties.$px2rem = px2rem // 放到全局
```
使用：

```js
 <div :style="{marginBottom:(ismarginBottom? $px2rem('42px'):$px2rem('16px'))}">
 </div>
```
# 二.H5 IOS input 聚焦时，页面整个被推上去了，键盘收起页面未下移 BUG
## 遇见的场景
[vue](https://so.csdn.net/so/search?q=vue&spm=1001.2101.3001.7020)基于vant3框架开发移动端项目时，出现了这样一个问题：`在手机上点击页面输入框时唤起手机自带键盘，结果顶部固定的导航栏也被顶起，导致遮挡住页面部分内容`

## 解决方式
给相应的输入框一个聚焦的事件:

```js
  <van-field
     v-model="cardForm.topUpamount"
     label="￥"
     :rules="rulesFrom.amount"
     placeholder=""
     :clearable="true"
     type="number"
     @focus="changefocus"
  >
```
这个可以放在utils的index.ts下，导出这个方法，在需要的页面使用

如果这个输入框不是在vant组件的弹窗：
```js
 // ios键盘唤起，键盘收起以后页面不归位bug解决
 const changefocus = () => {
    const u = navigator.userAgent
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isIOS){
        setTimeout(() => {
          window.scrollTo(0, 0)
          }, 200)
      }
  }
```
如果这个输入框是在vant组件的弹窗，例如动作面板弹窗：
```js
  // ios键盘唤起，键盘收起以后页面不归位bug解决
  const changefocus = () => {
    const u = navigator.userAgent;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) {
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight;
      }, 200);
    }
  };
  const changeblur = () => {
    const u = navigator.userAgent;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) {
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  };
```
# 三.状态调接口轮询
> 如充值，提现这种场景时，三方那边返回的结果可能需要比较久，这个时候就需要轮询着去结果，根据轮询的结果展示不同的需要展示的页面，如充值中，充值成功，失败等


```js
const timer: any = ref(null);
  const Result = async (No:any) => {
    try {
      const res: any = await getResult({No: tNo })
      // 0 处理中 1 成功 2失败
      if ([0].includes(res.data.State)) {
        timer.value = setTimeout(() => {
          Result(No);
        }, 2 * 1000);
      } else if (res.data.State === 1 || res.data.State === 2) {
        clearTimeout(timer.value);
      }
      State.value = res.data.State
      //该赋值的赋值
      //......
    } catch (error) {
      clearTimeout(timer.value);
    }
  };
```
离开页面时，一定要清除定时，避免一直调用接口
```js
  onBeforeUnmount(() => {
    clearTimeout(timer.value);
  })
```
# 四.第一次进入页面有在app.vue的onmouted里写了获取token方法调接口，页面刷新后token没了
> 使用pinia+数据持久化,存放token 或者直接把接口获取到的存在localstorage

# 五.app端嵌套h5页面时，返回APP端时，不能使用router.go（-1），需要使用app端提供的关闭的桥的方法
isIos.js

```js
export const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
```
bridge.js
```js
import {isIos } from './isIos'
 
const setupWebViewJavascriptBridge = (callback) => {
    if (isIos) {
        if (window.WebViewJavascriptBridge) return callback(window.WebViewJavascriptBridge)
        if (window.WVJBCallbacks) return window.WVJBCallbacks.push(callback)
        window.WVJBCallbacks = [callback]
        var WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(() => { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
}

export const appBridge = (apiName, payload, cb) => {
    if (isIos) {
        setupWebViewJavascriptBridge((bridge) => bridge.callHandler(apiName, payload, cb))
    } else {
        let res = null
        if (window.jsHZG[apiName]) {
            if (JSON.stringify(payload) !== '{}' && payload) {
                if (typeof payload === 'object') {
                    res = window.jsHZG[apiName](JSON.stringify(payload))
                } else {
                    res = window.jsHZG[apiName](payload)
                }
            } else {
                res = window.jsHZG[apiName]()
            }
            if (cb) cb(res)
        }
    }
}

export const registerhandler = (name, callback) => {
    if (isIos) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(name, callback)
        })
    } else {
        window[name] = data => callback(data)
    }
}

```
webView.js
```js
import { appBridge } from './bridge'
// 打开新web-view 
export const newPage = (isFull, path, query) => {
    return appBridge('openNewPage', { url: isFull ? path: `${window.location.origin}${path}`  })
}

// 关闭当前web-view
export const closePage = () => {
    return appBridge('closePage')
}

//跳转小程序

export const openXCX = () => {
    return appBridge('payStagesOrder')
}

// 获取原生导航条的高度

export const getStatusBarHeight = () => {
    return appBridge('getStatusBarHeight')
}

```
使用：

```js
import { closePage} from '@/utils/webView'
//在需要的地方
closePage()
```
# 六. 项目打包发布后，前端静态图片在测试环境无法显示的问题
首先我们去vite官网看看关于静态资源文件的处理：

![企业微信截图_16720467796522.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eb5a3fa20b64c268656fffd4b2c2d72~tplv-k3u1fbpfcp-watermark.image?)
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ff1b2e4db47412e968f36bc9f43680d~tplv-k3u1fbpfcp-watermark.image?)
**这里我们先假设：**  
静态文件目录：`src/assets/images/`  
我们的目标静态文件在 `src/assets/images/home/home_icon.png`

```js
<img src="src/assets/images/home/home_icon.png" />
```
那么这么写就会出现问题，在本地环境时你能够显示出图片，但打包发布到测试环境问题就出来了，图片没显示出来。
第一张图片标红的位置打包后是： `/assets/images/home/home_icon.（hash的值）.png` 

综上所得：如果资源文件在assets文件夹打包后会把图片名加上 hash值，但是直接通过 :src="imgSrc"方式引入并不会在打包的时候解析，导致开发环境可以正常引入，打包后却不能显示的问题                               
所以：`<img src="src/assets/images/home/home_icon.png" />` 是肯定找不到的。                                                                      

## 1.第一种方式解决方式（适用于处理单个链接的资源文件 普通推荐！！！！）

```js
import homeIcon from '@/assets/images/home/home_icon.png'
<img :src="homeIcon" />
```
## 2.第二种解决方式：new URL() + import.meta.url（适用于处理多个链接的资源文件 极力推荐！！！！）

![企业微信截图_16720474775759.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7b4011fe7b843c5b77fab9fbf678343~tplv-k3u1fbpfcp-watermark.image?)
这也是vite官方文档说明的方式，new URL() + import.meta.url                                          
工具文件目录： `src/util/img-use.ts`  
img-use.ts:

```js
// 获取assets静态资源
export const getAssetsFile = (url: string) => {
   return new URL(`../assets/images/${url}`, import.meta.url).href
}
```
使用:
```js
import getAssetsFile from '@/util/img-use'
//setup语法糖写法,没用语法糖的记得return出去
```
```js
//如果是直接建在assets/images下，写图标名就行了
<img :src="getAssetsFile('home_icon.png')" />
//可以在../assets/images建目录如home文件夹，那么就是
<img :src="getAssetsFile('/home/home_icon.png')" />
```
> 另外：如果是背景图片引入的方式（一定要使用相对路径）

```js
.imgBg {
  background-image: url('../../assets/images/WDNMD.jpg');
}
```
## 3.第三种解决方式import.meta.glob`或`import.meta.globEager（适用于处理多个链接的资源文件 不怎么推荐！！！！）
**这种方式引入的文件必须指定到具体文件夹路径，传入的变量中只能为文件名，不能包含文件路径**

使用vite的`import.meta.glob`或`import.meta.globEager`，两者的区别是前者懒加载资源，后者直接引入。
那我为什么说不怎么推荐了，如果你使用的是最新版本的vite，就会出现

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b00c91d209c4435385ba8193c6f85089~tplv-k3u1fbpfcp-watermark.image?)
可以看出`import.meta.globEager`已被弃用，只能用`import.meta.glob`了，并且你只能传图片名，不能传路径。
> const modules = import.meta.glob('./menus/**/*.ts', { eager: true,import:'default' })  
> 以“default”这个选项作为默认的导出内容，从而避免对象为'unknow'时获取default的报错

工具文件目录： `src/util/img-use.ts`  
img-use.ts:

```js
// 获取assets静态资源
export const getAssetsHomeFile = (url: string) => {
    const path = `../assets/images/home/${url}`;
    const modules = import.meta.globEager("../assets/images/home/*");
    //const modules = import.meta.globEager("../assets/images/home/*", { eager: true,import:'default' });
    return modules[path].default;
}

```
使用:
```js
import useImg from '@/util/img-use'
```
```js
//写图标名就行了，不能带路径,并且你只能传图片名，不能传路径。
<img :src="useImg('home_icon.png')" />
```
# 七.h5移动端，安卓看着没问题，ios的手机文字嘎嘎换行 
> （*原因*：给对应的dom元素设置了宽度，导致了换行，移动端布局时非必要不要设置宽度）

# 八.vant3 Dialog组件title没显示，我的是小米11的，ios或安卓的其他手机都显示了
> 目前没找到原因，见鬼了，就我的手机 Dialog组件title没显示。

```js
//手机号弹窗提示
  const dialogShow = () => {
    Dialog.alert({
      confirmButtonText: '我知道了',
      title: '你瞅啥', //这个没显示，离谱
      confirmButtonColor: '#FE7E41',
      message: '瞅你乍地！！',
    }).then(() => {});
  };
```
# 九.小程序嵌套web-view H5页时，出现双导航的情况
> 在app.json中，小程序navBarTitle不设置，并且h5项目的mian.ts调用接口，获取这个是从哪来到或嵌套该h5页，把来源存放在全局中，用来判断是否隐藏left-arrow 返回箭头

获取：
```js
//调接口获取来源.............. 得到sourcePage
     
app.config.globalProperties.$sourcePage = sourcePage // 放到全局
```
使用：

```js
  <van-nav-bar
    title="我的"
    :left-arrow="$sourcePage != '来源的值'"
    :border="false"
    style="width: 10rem"
    :placeholder="true"
    :fixed="true"
    @click-left="onClickLeft"
  />
```
这样就不是双导航了

# 十.app端嵌套web-view H5页时，出现双导航的情况
> 让app端把原生的导航给隐藏了，使用h5的导航
# 十一.h5 title为空时，安卓手机导航栏会默认展示h5域名。
> 解决方案：通过document.title改变h5 title
# 十二.安卓端布局正常，两div上下有间距，ios没间距
> ios自己写的样式不是vant组件的（vant组件自己做了适配）文字需要高度和行高，没高度就挤在一起了

总结一手：vant组件使用样式穿透时，就不要给宽度，高度行高了，vant组件组件整好适配了，自己写的样式特别时文字需要给高度和行高，按蓝湖上来就行了
# 十三.微信小程序配置业务域名，调用web-view组件打开需要嵌套的h5页面

应为有其他的微信 去到微信公众平台，开发管理下的开发设置的下配置义务域名
![1672708788778.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e26722f3dda64e84b36a36ef5f54ef7c~tplv-k3u1fbpfcp-watermark.image?)

下载的校验文件，放在public下，并且不要重命名，是什么名字就是什么，不然检测不到