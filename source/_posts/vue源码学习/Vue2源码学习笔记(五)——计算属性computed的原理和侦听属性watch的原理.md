---
title: Vue2源码学习笔记(五)—计算属性computed的原理和侦听属性watch的原理
date: 2023-08-31 15:26
categories: vue2源码学习
tag: [vue]
---
# 前言

> 随着前面的学习，我对整个vue框架有了更深的理解，接下来学习的是计算属性computed的原理和侦听器watch的原理，这两基本也是在工作用的比较多的了。

## 侦听属性watch的原理
主要实现方式：当定义一个侦听属性时，Vue会在内部创建一个Watcher实例来监视指定的数据。这个Watcher实例会在初始化时获取初始值，并将自身添加到数据的依赖列表中。当被侦听的数据发生变化时，Watcher实例会被通知，并触发相应的回调函数。
### 1.侦听属性的初始化
在Vue实例化（initMixin（vue）的_init）时，会对侦听器进行初始化在initState中调用initWatch。在initWatch中Watch会对数组进行遍历处理，然后才调用createWatcher，通过原型方法$watch传入处理参数创建一个观察者收集依赖变化。
```js
// src/state.js

// 统一初始化数据的方法
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.watch) {
    //侦听属性初始化
    initWatch(vm);
  }
}

// 初始化watch
function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let k in watch) {
    const handler = watch[k]; //用户自定义watch的写法可能是数组 对象 函数 字符串
    if (Array.isArray(handler)) {
      // 如果是数组就遍历进行创建
      handler.forEach((handle) => {
        createWatcher(vm, k, handle);
      });
    } else {
      createWatcher(vm, k, handler);
    }
  }
}
// 创建watcher的核心
function createWatcher(vm, exprOrFn, handler, options = {}) {
  if (typeof handler === "object") {
    options = handler; //保存用户传入的对象
    handler = handler.handler; //这个代表真正用户传入的函数
  }
  if (typeof handler === "string") {
    //   代表传入的是定义好的methods方法
    handler = vm[handler];
  }
  //   调用vm.$watch创建用户watcher
  return vm.$watch(exprOrFn, cb, options);
}
```

### 2.$watch
```js
//  src/state.js
import Watcher from "./observer/watcher";
Vue.prototype.$watch = function (exprOrFn, cb, options) {
  const vm = this;
  //  user: true 这里表示是一个用户watcher
  let watcher = new Watcher(vm, exprOrFn, cb, { ...options, user: true });
  // 如果有immediate属性 代表需要立即执行回调
  if (options.immediate) {
    handler(); //如果立刻执行watch中的回调函数
  }
};
```
### 3.Watcher
在之前写的Watcher中，通过调用 get 方法获取并保存一次旧值
```js
// src/observer/watcher.js

import { pushTarget, popTarget } from "./dep";

// 全局变量id  每次new Watcher都会自增
let id = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options; //额外的选项 true代表渲染watcher
    this.id = id++; // watcher的唯一标识
    this.deps = []; //存放dep的容器
    this.depsId = new Set(); //用来去重dep
    this.user = options.user; //标识用户watcher
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    } 
    // 实例化就会默认调用get方法
    this.get();
  }
  get() {
    pushTarget(this); // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    this.getter(); //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    popTarget(); // 在调用方法之后把当前watcher实例从全局Dep.target移除
  },
  set(newValue) { 
      if (newValue === value) return; 
      // 如果赋值的新值也是一个对象 需要观测 
      observe(newValue); 
      value = newValue; 
      dep.notify(); // 通知渲染watcher去更新--派发更新 },
 }     
  //把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      //   直接调用dep的addSub方法  把自己--watcher实例添加到dep的subs容器里面
      dep.addSub(this);
    }
  }
  //   这里简单的就执行以下get方法  之后涉及到计算属性就不一样了
  update() {
    this.get();
  }
  
  //run方法会在监听的数据发生改变时,set劫持的数据通知渲染watcher去更新--派发更新，在这个时候执行 run()
  run() {
    const newVal = this.get(); //新值
    const oldVal = this.value; //老值
    this.value = newVal; //现在的新值将成为下一次变化的老值
    if (this.user) {
      // 如果两次的值不相同  或者值是引用类型 因为引用类型新老值是相等的 他们是指向同一引用地址
      if (newVal !== oldVal || isObject(newVal)) {
        this.cb.call(this.vm, newVal, oldVal);
      }
    } else {
      // 渲染watcher
      this.cb.call(this.vm);
    }
  }
}
```
## 计算属性computed的原理
具体原理如下：  

1. 在Vue实例化时，会对计算属性进行初始化。计算属性的定义包括一个计算函数和一个缓存属性。  
  
2. 当计算属性被访问时，会触发计算函数的执行。在计算函数中，可以访问其他响应式数据。  
  
3. 计算函数会根据依赖的响应式数据进行计算，并返回计算结果。  
  
4. 计算属性会将计算结果缓存起来，下次访问时直接返回缓存的值。  
  
5. 当依赖的响应式数据发生变化时，计算属性会被标记为"dirty"（脏），下次访问时会重新计算并更新缓存的值。  

通过计算属性，我们可以将复杂的逻辑封装成一个属性，并在模板中直接使用。计算属性会自动追踪依赖的数据，并在需要时进行更新，提供了一种简洁和高效的方式来处理衍生数据。  

*注意:* 计算属性适用于那些依赖其他响应式数据的场景，而不适用于需要进行异步操作或有副作用的场景。对于这些情况，可以使用侦听器（watcher）或使用methods来处理。

书接上文，在Vue实例化（*initMixin（vue）*的*_init*）时，不仅会对侦听器进行初始化同时也会对计算属性进行初始化。
### 1.计算属性初始化
在*initComputed函数*中，遍历计算属性对象，为每个计算属性创建一个Watcher实例，并将其存储在*vm._computedWatchers*中。
```js
// src/state.js
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.watch) {
    //侦听属性初始化
    initWatch(vm);
  }
  if(opts.computed) {
    initComputed(vm) 
  }
}
function initComputed(vm) {
  const computed = vm.$options.computed;
  //用来存放计算watcher
  const watchers = vm._computedWatchers = Object.create(null);
  for (const key in computed) {
     //获取用户定义的计算属性
    const userDef = computed[key];
    //创建计算属性watcher使用
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    //-vm：计算属性所属的Vue实例。
    //- getter：计算属性的获取函数，用于计算计算属性的值。 
    //- noop：一个空操作函数，作为回调函数的占位符。  
    //- computedWatcherOptions：一个包含特定于计算属性观察者的选项的对象。
   // watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)
   // 创建计算watcher lazy设置为true 
   watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}
```

### 2.对计算属性进行属性劫持
*defineComputed* 方法主要是重新定义计算属性，其实最主要的是劫持get方法也就是计算属性依赖的值。

*为啥要劫持呢？* 因为我们需要根据依赖值是否发生变化来判断计算属性是否需要重新计算

*createComputedGetter方法*就是判断计算属性依赖的值是否变化的核心了 我们在计算属性创建的Watcher增加dirty标志位，如果标志变为true代表需要调用*watcher.evaluate*来进行重新计算了
```js
function defineComputed(target, key, userDef) {
// 定义普通对象用来劫持计算属性
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };
  // 重新定义计算属性 对get和set劫持
  if (typeof userDef === 'function') {
  // 如果是一个函数 需要手动赋值到get上
    sharedPropertyDefinition.get = createComputedGetter(key);
  } else {
  // 利用Object.defineProperty来对计算属性的get和set进行劫持
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set;
  }
  
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 在getter函数中，首先获取对应的Watcher实例，然后判断是否需要重新计算计算属性的值。如果需要重新计算，则调用watcher.evaluate()进行计算，并在需要时进行依赖收集。最后，返回计算属性的值
function createComputedGetter(key) {
  return function computedGetter() {
  //获取对应的计算属性watcher
    const watcher = this._computedWatchers && this._computedWatchers[key];
    
    if (watcher) {
    //计算属性取值的时候 如果是脏的 需要重新求值
      if (watcher.dirty) {
        watcher.evaluate();
      }
     // 如果Dep还存在target 这个时候一般为渲染watcher 计算属性依赖的数据也需要收集
      if (Dep.target) {
        watcher.depend();
      }
      
      return watcher.value;
    }
  };
}
```
### 3.watcher的改造
```js
// src/observer/watcher.js

// import { pushTarget, popTarget } from "./dep";
// import { queueWatcher } from "./scheduler";
// import {isObject} from '../util/index'
// // 全局变量id  每次new Watcher都会自增
// let id = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    // this.vm = vm;
    // this.exprOrFn = exprOrFn;
    // this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    // this.options = options; //额外的选项 true代表渲染watcher
    // this.id = id++; // watcher的唯一标识
    // this.deps = []; //存放dep的容器
    // this.depsId = new Set(); //用来去重dep
    // this.user = options.user; //标识用户watcher
    this.lazy = options.lazy; //标识计算属性watcher
    this.dirty = this.lazy; //dirty可变  表示计算watcher是否需要重新计算 默认值是true

    // 如果表达式是一个函数
    // if (typeof exprOrFn === "function") {
    //   this.getter = exprOrFn;
    // } else {
    //   this.getter = function () {
    //     //用户watcher传过来的可能是一个字符串   类似a.a.a.a.b
    //     let path = exprOrFn.split(".");
    //     let obj = vm;
    //     for (let i = 0; i < path.length; i++) {
    //       obj = obj[path[i]]; //vm.a.a.a.a.b
    //     }
    //     return obj;
    //   };
    // }
    // 非计算属性实例化就会默认调用get方法 进行取值  保留结果 计算属性实例化的时候不会去调用get
    this.value = this.lazy ? undefined : this.get();
  }
  get() {
    pushTarget(this); // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    const res = this.getter.call(this.vm); //计算属性在这里执行用户定义的get函数 访问计算属性的依赖项 从而把自身计算Watcher添加到依赖项dep里面收集起来
    popTarget(); // 在调用方法之后把当前watcher实例从全局Dep.target移除
    return res;
  }
  //   把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
  //   addDep(dep) {
  //     let id = dep.id;
  //     if (!this.depsId.has(id)) {
  //       this.depsId.add(id);
  //       this.deps.push(dep);
  //       //   直接调用dep的addSub方法  把自己--watcher实例添加到dep的subs容器里面
  //       dep.addSub(this);
  //     }
  //   }
  //   这里简单的就执行以下get方法  之后涉及到计算属性就不一样了
  update() {
    // 计算属性依赖的值发生变化 只需要把dirty置为true  下次访问到了重新计算
    if (this.lazy) {
      this.dirty = true;
    } else {
      // 每次watcher进行更新的时候  可以让他们先缓存起来  之后再一起调用
      // 异步队列机制
      queueWatcher(this);
    }
  }
  //   计算属性重新进行计算 并且计算完成把dirty置为false
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  depend() {
    // 计算属性的watcher存储了依赖项的dep
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend(); //调用依赖项的dep去收集渲染watcher
    }
  }
  //   run() {
  //     const newVal = this.get(); //新值
  //     const oldVal = this.value; //老值
  //     this.value = newVal; //跟着之后  老值就成为了现在的值
  //     if (this.user) {
  //       if(newVal!==oldVal||isObject(newVal)){
  //         this.cb.call(this.vm, newVal, oldVal);
  //       }
  //     } else {
  //       // 渲染watcher
  //       this.cb.call(this.vm);
  //     }
  //   }
}

```
## 小结
计算属性computed和侦听属性watch还是有很大区别的计算属性一般用在需要对依赖项进行计算并且可以缓存下来，当依赖项变化会自动执行计算属性的逻辑，一般用在模板里面较多而侦听属性用法是对某个响应式的值进行观察（也可以观察计算属性的值）一旦变化之后就可以执行自己定义的方法
# 个人博客
[耀耀切克闹 (yaoyaoqiekenao.com)](https://yaoyaoqiekenao.com/)
# 参考文章
[手写Vue2.0源码（十）-计算属性原理 - 掘金 (juejin.cn)](https://juejin.cn/post/6956407362085191717)