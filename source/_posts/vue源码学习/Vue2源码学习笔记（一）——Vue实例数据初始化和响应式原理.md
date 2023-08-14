---
title: Vue2源码学习笔记（一）——Vue实例数据初始化和响应式原理
date: 2023-08-10 17:52
categories: vue2源码学习
tag: [vue] 
---
# 前言
> 这段时间我司需求没那么急了，开始闲下来了。之前也一直想学习Vue2源码，打开vue2源码后，摸不着头脑，不知从何开始看起。后面看到鲨鱼大佬文章，便开始跟着敲跟着学习，同时感谢这些大佬手写源码，并对其一步步的分析。总的来说跟着敲完这些代码，获益匪浅。
## 1.Vue实例数据初始化

 **Vue 其实就是一个构造函数，通过initMixin把_init方法挂载在Vue原型上，供Vue实例调用。**
```js
// index.js
const { initMixin } = require('./init')

//这是一个Vue构造函数的定义。当创建一个新的Vue实例时，会调用构造函数，并将传入的options作为参数传递给_init方法
function Vue(options) {
    // 初始化传进来的options配置
    this._init(options)
}

// 配置Vue构造函数的_init方法

// Vue构造函数添加实例初始化
initMixin(Vue)
// 实例一个Vue对象
let vue = new Vue({
    props: {},
    data() {
        return {
            a: 1,
            b: [1],
            c: { d: 1 }
        }
    },
    watch: {},
    render: () => {}
})
```
其中
在Vue中，`initMixin`函数是一个用于混入初始化逻辑的函数。它主要的作用是给Vue构造函数添加实例初始化的方法，以便在创建Vue实例时执行一些初始化操作。

具体来说，`initMixin`函数会向Vue构造函数的原型对象上混入一个名为`_init`的方法。这个`_init`方法是Vue实例初始化的入口，它会在创建Vue实例时被调用。

`_init`方法的主要职责是：

1.  合并配置：将用户传入的配置选项与Vue构造函数的默认选项进行合并，得到最终的配置对象。
1.  初始化生命周期：创建Vue实例的生命周期钩子，并为`$options`添加一些属性用于存储生命周期状态。
1.  初始化事件：初始化Vue实例的事件系统，包括事件的订阅与派发。
1.  初始化渲染：创建Vue实例的渲染函数和虚拟DOM的相关属性。
1.  初始化状态：设置Vue实例的响应式数据，并创建数据观测的实例。
1.  调用`$mount`：如果配置中存在`el`选项，会自动调用`$mount`方法进行挂载。

```js
// init.js
const { initState } = require('./state')

function initMixin(Vue) {
    // 在Vue的原型上挂载_init函数
    Vue.prototype._init = function (options) {
        // vm变量赋值为Vue实例
        const vm = this

        // 将传进来的options对象赋值给vm上的$options变量
        vm.$options = options

        // 执行初始化状态函数
        initState(vm)
    }
}
module.exports = {
    initMixin: initMixin
}
```
**initState的具体处理**
```js
// 初始化状态 注意这里的顺序，是否能在data里面直接使用prop的值 为什么？
// 这里初始化的顺序依次是 prop>methods>data>computed>watch
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    // 初始化data
    initData(vm); //下面有具体怎么初始化数据的
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
```
```js
// src/state.js 
import { observe } from "./observer/index.js";
// 初始化data数据
function initData(vm) {
  let data = vm.$options.data;
  //   实例的_data属性就是传入的data
  // vue组件data推荐使用函数 防止数据在组件之间共享
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};

  // 把data数据代理到vm 也就是Vue实例上面 我们可以使用this.a来访问this._data.a
  for (let key in data) {
    proxy(vm, `_data`, key);
  }
  // 对数据进行观测 --响应式数据核心
  observe(data);
}
// 数据代理
function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key];
    },
    set(newValue) {
      object[sourceKey][key] = newValue;
    },
  });
}

```
## 2.响应式处理

**可以看到在初始化过程中涉及一个方法 observe(data);这个就是响应式数据核心，也就是大名鼎鼎的数据劫持结合观察者的模式实现vue响应式数据。**
```js
// src/obserber/index.js
import { arrayMethods } from "./array";

// 观察者对象，使用es6的class来构建会比较方便
class Observer {
    constructor(value) {
        // 给传进来的value对象或者数组设置一个__ob__对象
        // 这个__ob__对象大有用处，如果value上有这个__ob__，则说明value已经做了响应式处理
        Object.defineProperty(value, '__ob__', {
            value: this, // 值为this，也就是new出来的Observer实例
            enumerable: false, // 不可被枚举
            writable: true, // 可用赋值运算符改写__ob__
            configurable: true // 可改写可删除
        })

        // 判断value是函数还是对象
        if(Array.isArray(value)) {
            // 如果是数组的话就修改数组的原型
            value.__proto__ = arrayMethods
            // 对数组进行响应式处理
            this.observeArray(value)
        } else {
            // 如果是对象，则执行walk函数对对象进行响应式处理
            this.walk(value)
        }
    }

    walk(data) {
        // 获取data对象的所有key
        let keys = Object.keys(data)
        // 遍历所有key，对每个key的值进行响应式处理
        for(let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = data[key]
            // 传入data对象，key，以及value
            defineReactive(data, key, value)
        }
    }

    observeArray(items) {
        // 遍历传进来的数组，对数组的每一个元素进行响应式处理
        for(let i = 0; i < items.length; i++) {
            observe(items[i])
        }
    }
}

function defineReactive(data, key, value) {
    // 递归重要步骤
    // 因为对象里可能有对象或者数组，所以需要递归
    observe(value)


    // 核心
    // 拦截对象里每个key的get和set属性，进行读写监听
    // 从而实现了读写都能捕捉到，响应式的底层原理
    Object.defineProperty(data, key, {
        get() {
            console.log('获取值')
            return value
        },
        set(newVal) {
            if (newVal === value) return
            console.log('设置值')
            value = newVal
        }
    })
}


function observe(value) {
    // 如果传进来的是对象或者数组，则进行响应式处理
    if (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
        return new Observer(value)
    }
}

module.exports = {
    observe: observe
}

```
> 数据劫持核心是 defineReactive 函数，主要使用 Object.defineProperty 来对数据 get 和 set 进行劫持 这里就解决了之前的问题为啥数据变动了会自动更新视图，因为我们可以在 set 里面去通知视图更新


## 3.响应式处理的注意点
可以看到vue源码中数组和对象是*分开处理*的，数组并没有和对象一样层层递归，给每一个属性都劫持set和get
> -   `对象`的属性通常比较少，对每一个属性都劫持`set和get`，并不会消耗很多性能
>
> -   `数组`有可能有成千上万个元素，如果每一个元素都劫持`set和get`，无疑消耗太多性能了
>
> -   所以`对象`通过`defineProperty`进行正常的劫持`set和get`

## 4.对数组的观测

上面的arrayMethods就是响应式对数组的处理， `数组`是通过`修改数组原型上的部分方法`，来实现`修改数组触发响应式`
```js
// src/obserber/array.js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓
    return result;
  };
});

```


## 4.思维导图

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5447fa8e0dfa4041994579ec162b5455~tplv-k3u1fbpfcp-watermark.image?)
# 参考文章

[鲨鱼哥-手写 Vue2.0 源码（一）-响应式数据原理](https://juejin.cn/post/6935344605424517128 "https://juejin.cn/post/6935344605424517128")