---
title: WEB前端基础知识梳理(四)
date: 2025-08-15 19:53
tags: [随笔,面试]
categories: 前端随笔
---


### 手写简单的节流和防抖

```js
// 节流 n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
function throttle(fn,delay=1000) {
    let timer = null
    return function() {
        const args = arguments
        const contentText = this
        if(!timer) {
            setTimeout(()=>{
                fn.apply(contentText,args)
                timer = null
            },delay)
        }
    }
}
//防抖 n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时
function debounce(fn,delay=1000) {
    let timeout;
     return function() {
        const args = arguments
        const contentText = this
        clearTimeout(timeout)
        timeout=setTimeout(()=>{
                fn.apply(contentText,args)
            },delay)
    }
}
```
### 手写一个数据扁平化

```js
function flattenArray(arr) {
let result= []
    arr.forEach(item =>{
        if(Array.isArray(item)) {
            result= result.concat(flattenArray(item))
        } else {
            result.push(item)
        }
    })
    return reslut
}
```

### 手写一个简单的发布-订阅者的模式

```js
// 创建一个简单的发布-订阅类
class EventEmitter {
  constructor() {
    // 使用对象来存储所有的事件和对应的订阅者
    this.events = {};
  }

  // 订阅方法
  on(eventName, callback) {
    // 如果这个事件还没有被订阅过，就创建一个数组
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    // 将回调函数添加到对应事件的数组中
    this.events[eventName].push(callback);
  }

  // 发布方法
  emit(eventName, ...args) {
    // 如果这个事件有订阅者
    if (this.events[eventName]) {
      // 遍历并执行所有订阅者的回调函数
      this.events[eventName].forEach(callback => {
        callback(...args);
      });
    }
  }

  // 取消订阅方法
  off(eventName, callback) {
    // 如果这个事件存在
    if (this.events[eventName]) {
      // 过滤掉要取消的回调函数
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }

  // 只订阅一次的方法
  once(eventName, callback) {
    // 包装回调函数，执行后自动取消订阅
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// 使用示例
// 1. 创建发布者实例
const emitter = new EventEmitter();

// 2. 定义订阅者（回调函数）
const handleNews = (news) => {
  console.log('收到新闻：', news);
};

const handleWeather = (weather) => {
  console.log('收到天气：', weather);
};

// 3. 订阅事件
emitter.on('news', handleNews);
emitter.on('weather', handleWeather);

// 4. 发布事件
emitter.emit('news', '今天是晴天'); // 输出：收到新闻：今天是晴天
emitter.emit('weather', '温度25度'); // 输出：收到天气：温度25度

// 5. 使用once订阅
emitter.once('special', (data) => {
  console.log('只执行一次：', data);
});

emitter.emit('special', '特殊消息'); // 输出：只执行一次：特殊消息
emitter.emit('special', '这条不会输出'); // 不会执行

// 6. 取消订阅
emitter.off('news', handleNews);
emitter.emit('news', '这条不会输出'); // 不会执行，因为已经取消订阅

```
### 手写深拷贝 （原对象：obj）
```js
//通过json序列化 （函数、undefined、Symbol 深拷贝不了）
const copyObj = JSON.parse(JSON.stringify(obj))
```

```js
// 通过递归
function deepClone(obj) {
  // 处理基本类型和null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // 处理普通对象
  const result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }

  return result;
}

// 测试用例
// 1. 基本类型
console.log(deepClone(123));        // 123
console.log(deepClone('hello'));    // 'hello'
console.log(deepClone(true));       // true
console.log(deepClone(null));       // null
console.log(deepClone(undefined));  // undefined

// 2. 对象
const obj = {
  a: 1,
  b: 'string',
  c: true,
  d: null,
  e: undefined,
  f: {
    g: 2
  },
  h: [1, 2, 3]
};
const clonedObj = deepClone(obj);
console.log(clonedObj);

// 3. 验证是深拷贝
clonedObj.f.g = 3;
console.log(obj.f.g);      // 2 (原对象未改变)
console.log(clonedObj.f.g); // 3 (克隆对象已改变)

// 4. 日期和正则
const dateObj = {
  date: new Date(),
  reg: /test/g
};
const clonedDateObj = deepClone(dateObj);
console.log(clonedDateObj.date instanceof Date); // true
console.log(clonedDateObj.reg instanceof RegExp); // true

// 5. 嵌套数组
const nestedArray = [1, [2, [3]]];
const clonedArray = deepClone(nestedArray);
clonedArray[1][1][0] = 4;
console.log(nestedArray[1][1][0]); // 3 (原数组未改变)
console.log(clonedArray[1][1][0]); // 4 (克隆数组已改变)

```
### 手写一个AJAX请求示例

```js
// 创建一个新的XMLHttpRequest对象
var xhr = new XMLHttpRequest对象()
//配置请求方法和地址
xhr.open('GET','请求地址',true)
//设置请求头
xhr.setRequestHeader('Content-type','application/json')
xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
        if(xhr.status == 200) {
            var resposeData = JSON.parse(xhr.responseText)
        } else {
            console.error('请求失败')
        }
    }
}
// 发送请求
xhr.send()
```
### axios和fetch
**axios**是一个基于XMLHttpResquest进行二次封装的http客户端，提供了更多高级功能，如自动解析 JSON 数
据、请求/响应拦截器等。

**fetch API** 是现代浏览器内置的标准 API，用于发起 HTTP 请求。它基于 Promise，语法简洁，但需要手动解析响应数据，例如  *.json()*  方法。

对比：
-   **错误处理** Fetch 仅在网络错误时会触发 *catch*，即使返回 404 或 500 状态码，仍需手动检查 *response.ok*。 Axios 会自动在非 2xx 状态码时触发 *catch*，并提供详细的错误信息。

-   **响应数据解析** Fetch 需要手动调用  *.json()*  方法解析响应数据。 Axios 自动解析响应为 JSON 格式，简化了操作。

-   **请求拦截与响应拦截** Fetch 不支持内置拦截器，需要手动实现。 Axios 提供内置的请求和响应拦截器，便于添加请求头或处理错误。
-   **浏览器兼容性** Fetch 在旧版浏览器（如 IE）中不支持，需要使用 polyfill。 Axios 支持所有主流浏览器，包括旧版浏览器。

-   **取消请求** Fetch 使用 *AbortController* 实现取消请求。 Axios 提供 *CancelToken*，实现更简洁的请求取消功能。

### 首页白屏优化
- 1.三方库，需要的组件 按需加载
- 2.第三方库使用CDN引入
- 3.vue-router路由懒加载
- 4.静态资源压缩，代码压缩，图片压缩
- 5.不要滥用三方库
- 6.去掉编译中的map文件
- 7.代码层面优化(1.项目组件化，去掉冗余的代码 2.正式环境去掉console.log 3.index.html页面中将`js`文件放到页面最底部，`css`文件放在`<header>`中使用link引入)
### 对称加解密和非对称加解密
对称加密和非对称加密是两种主要的加密技术，它们在密钥管理和使用场景上有显著的区别。

#### 对称加密

对称加密使用相同的密钥进行加密和解密。这种加密方法的优点是加密和解密速度快，适合大量数据的加密。然而，它也存在一些挑战，主要是密钥的分发和管理。

**优点**：
- 加密和解密速度快。
- 适合大量数据的加密。

**缺点**：
- 密钥分发困难：如何安全地将密钥发送给接收方是一个挑战。
- 密钥管理复杂：如果密钥被泄露，整个系统将变得不安全。

**常见算法**：
- AES（高级加密标准）
- DES（数据加密标准）
- 3DES（三重数据加密标准）
- RC4

**非对称加密**

非对称加密使用一对密钥：公钥和私钥。公钥用于加密数据，而私钥用于解密数据。这种加密方法的优点是密钥分发更容易，因为公钥可以公开分享，而私钥保持私密。

**优点**：
- 密钥分发容易：公钥可以公开分享，私钥保持私密。
- 数字签名：非对称加密可以用于数字签名，确保数据的完整性和真实性。

**缺点**：
- 加密和解密速度较慢，不适合大量数据的加密。
- 计算复杂度高。

**常见算法**：
- RSA
- ECC（椭圆曲线加密）
- ElGamal
- Diffie-Hellman

**使用场景**

- **对称加密**：通常用于需要大量数据加密的场景，如文件加密、数据库加密等。在实际应用中，对称加密通常与非对称加密结合使用，即使用非对称加密交换对称密钥，然后使用对称密钥加密数据。
- **非对称加密**：通常用于密钥交换、数字签名和身份验证等场景。例如，HTTPS协议使用非对称加密交换对称密钥，然后使用对称加密传输数据。

**结合使用**

在实际应用中，对称加密和非对称加密通常会结合使用。例如，在HTTPS协议中，客户端首先使用服务器的公钥加密对称密钥，然后服务器使用私钥解密对称密钥。之后，客户端和服务器使用对称密钥加密和解密数据。

这种结合使用的方式充分利用了两种加密方法的优点，既保证了数据传输的安全性，又提高了数据传输的效率。
### 微信小程序的生命周期、vue的生命周期
微信小程序的生命周期：

小程序的应用生命周期：onLaunch、onShow、onHide、onError、onPageNotFound

小程序页面的生命周期（常用的）：onLoad、onShow、onReady、onUnload

vue实例的生命周期：beforeCreate、Created、beforeMount、mounted、beforeUpdate、updated、beforeDestory、destroyed
### hash路由 和 history路由
在单页面应用（SPA）中，路由是用来控制页面导航和组件展示的机制。`Hash` 路由和 `History` 路由是两种常见的路由模式，它们决定了 URL 的表现形式和页面导航的方式。

**Hash 路由**

`Hash` 路由，有时也称为哈希路由，使用 URL 中的哈希部分（即 `#` 符号后面的字符串）来模拟一个完整的 URL 路径。例如，`http://example.com/#/about`。在这种模式下，当用户点击应用内的链接或浏览器的前进/后退按钮时，URL 中的哈希部分会改变，但浏览器不会向服务器发送新的请求。

哈希路由的主要优点是兼容性好，因为哈希变化不会触发浏览器重新加载页面，也不需要服务器端进行特殊配置。缺点是 URL 中包含 `#` 符号，可能看起来不够美观，并且对搜索引擎优化（SEO）不太友好。

**History 路由**

`History` 路由利用了 HTML5 History API 中的 `pushState` 和 `replaceState` 方法来管理浏览器历史记录。在这种模式下，URL 看起来像正常的路径，例如 `http://example.com/about`，没有 `#` 符号。

使用 `History` 路由时，当用户导航到新页面，URL 会改变，但浏览器不会重新加载页面。这需要服务器端配置支持，因为对于任何不存在的页面路径，服务器都应该返回应用的入口文件（通常是 `index.html`），这样 Vue Router 才能正确地解析路由并渲染对应的组件。

`History` 路由的优点是 URL 表现形式更美观，更接近传统的网址结构，对 SEO 更友好。缺点是需要nginx配置，并且可能存在兼容性问题，特别是在旧版浏览器中。

在 Vue.js 应用中，你可以通过 Vue Router 的 `mode` 选项来选择使用 `hash` 模式还是 `history` 模式：

```javascript
const router = new VueRouter({
  mode: 'history', // 'hash' 或 'history'
  routes: [...]
});
```

默认情况下，Vue Router 使用 `hash` 模式。如果你选择 `history` 模式，请确保服务器已经正确配置，以便所有路由都能正确地返回应用的入口文件。

### vue项目目录结构、小程序目录结构
vue项目目录:
核心目录和文件

- **node_modules/** : 存放项目依赖的node模块。
- **public/** : 公共资源目录，通常包含*favicon.ico*和*index.html*等。
- **src/** : 源代码目录，是开发的核心所在。它包括： assets/: 静态资源，如图片、字体等。 
    - **components/**: Vue组件目录。
    - **router/**: 路由配置目录。 
    - **store/**: Vuex状态管理目录。 
    - **views/**: 视图组件目录。
- **App.vue**: Vue根组件，整个应用的入口。 
- **main.js**: Vue实例化入口文件，整个应用的核心。

配置文件和说明文档

- **.gitignore**: Git版本控制忽略配置。
- **package.json**: 项目配置文件，定义了项目的依赖和脚本。
- **README.md**: 项目的说明文档，通常用于描述项目信息。
- **webpack.config.js/vite.config.js**: Webpack/vite的配置文件

小程序目录:
核心目录和文件
- **app.js**：小程序的逻辑代码，可以用来注册小程序、处理全局事件等
- **app.json**：小程序的公共配置文件，包括页面路径、窗口样式、网络超时时间等
- **app.wxss**：小程序的公共样式表，可以定义全局样式
- **pages/**：存放小程序页面的文件夹。每个页面由4个文件组成：.js、.wxss、.json、.wxml
    - **images/** : 存放小程序使用的图片资源。
    - **components/** : 存放小程序的组件文件夹，组件也可以由四个文件组成，但它们是独立的小模块，可以被多个页面使用。
    - **utils/** : 存放工具脚本，如请求封装、格式化函数等。
    - **static/** : 存放静态资源，如字体文件、配置文件等。

