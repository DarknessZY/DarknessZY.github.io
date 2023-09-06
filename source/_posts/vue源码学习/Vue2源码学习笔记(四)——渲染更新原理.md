---
title: Vue2源码学习(四)——渲染更新原理
date: 2023-08-14 09:13
categories: vue2源码学习
tag: [vue]
---
# 前言
> 跟着鲨鱼大佬的源码看，前面说了初次渲染先经过模版编译=>在挂载时调用_render方法把render函数转化为虚拟dom，虚拟dom通过_update中patch函数渲染为真实dom了。也就是上篇我们调用的vm._update(vm._render())来实现更新功能，但当数据改变时页面并不会自动更新，这是为什么？。
>
> 因为我们不可能每次数据变化都要求用户自己去调用渲染方法更新视图 我们需要一个机制在数据变动的时候自动去更新。这个时候就涉及到渲染更新的原理了,vue通过观察者模式定 Watcher和 Dep完成依赖收集和派发更新从而实现渲染更新。

## 1.定义Watcher

当数据变动之后，通知它去执行某些方法，本质上就是一个构造函数，初始化的时候会去执行 get 方法。
```js
// src/observer/watcher.js
// 全局变量id  每次new Watcher都会自增
let id = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options; //额外的选项 true代表渲染watcher
    this.id = id++; // watcher的唯一标识
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    // 实例化就会默认调用get方法
    this.get();
  }
  get() {
    this.getter();
  }
}
```
## 2.创建渲染Watcher
我们在组件挂载方法里面 定义一个渲染 Watcher 主要功能就是执行核心渲染页面的方法
```js
// src/lifecycle.js
export function mountComponent(vm, el) {
  //   _update和._render方法都是挂载在Vue原型的方法  类似_init

  // 引入watcher的概念 这里注册一个渲染watcher 执行vm._update(vm._render())方法渲染视图

  let updateComponent = () => {
    console.log("刷新页面");
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, null, true);
}
```
## 3.定义Dep
Dep 也是一个构造函数 可以把他理解为观察者模式里面的被观察者 在 subs 里面收集 watcher 当数据变动的时候通知自身 subs 所有的 watcher 更新

Dep.target 是一个全局 Watcher 指向 初始状态是 null

```js
// src/observer/dep.js

// dep和watcher是多对多的关系

// 每个属性都有自己的dep

let id = 0; //dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这个是存放watcher的容器
  }
}
// 默认Dep.target为null
Dep.target = null;
```
## 对象的依赖收集
Vue 2中的对象的依赖收集是通过使用getter/setter和观察者模式来实现的。在getter中进行依赖收集，将当前的Watcher实例添加到属性的依赖列表中。在setter中通知依赖该属性的Watcher实例进行更新=，这种机制使得Vue能够自动追踪数据的依赖关系。

在vue2源码学习(一）中，我们初始化了一个vue实例，并使用defineReactive对其进行了响应式处理。接下来我们需要在访问组件的数据属性时完成一下处理来实现依赖收集
1. 在getter中，Vue会进行依赖收集。当组件渲染时，会创建一个Watcher实例，并将其设置为全局的Dep.target。当访问组件的数据属性时，会触发属性的getter，并将当前的Watcher实例添加到属性的依赖列表中。   
2. 在setter中，Vue会通知依赖该属性的Watcher实例进行更新。当属性的值发生变化时，会触发属性的setter，并调用依赖列表中每个Watcher实例的更新方法。

```js
// src/observer/index.js

// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  observe(value);

  let dep = new Dep(); // 为每个属性实例化一个Dep

  Object.defineProperty(data, key, {
    get() {
      // 页面取值的时候 可以把watcher收集到dep里面--依赖收集
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
        dep.depend();
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      // 如果赋值的新值也是一个对象  需要观测
      observe(newValue);
      value = newValue;
      dep.notify(); // 通知渲染watcher去更新--派发更新
    },
  });
}
```

## 5.完善watcher

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
  }
  //   把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
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
}
```
## 6.完善dep

```js
// src/observer/dep.js

// dep和watcher是多对多的关系
// 每个属性都有自己的dep
let id = 0; //dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这个是存放watcher的容器
  }
  depend() {
    //   如果当前存在watcher
    if (Dep.target) {
      Dep.target.addDep(this); // 把自身-dep实例存放在watcher里面
    }
  }
  notify() {
    //   依次执行subs里面的watcher更新方法
    this.subs.forEach((watcher) => watcher.update());
  }
  addSub(watcher) {
    //   把watcher加入到自身的subs容器
    this.subs.push(watcher);
  }
}
// 默认Dep.target为null
Dep.target = null;
// 栈结构用来存watcher
const targetStack = [];

export function pushTarget(watcher) {
  targetStack.push(watcher);
  Dep.target = watcher; // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop(); // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1];
}
```
## 7.数组的依赖收集
Vue中，数组的依赖收集相对于对象稍微复杂一些。由于JavaScript的限制，*Vue无法通过getter/setter直接捕获数组的变化*。因此，Vue采用了一些特殊的技巧来实现数组的依赖收集。

当Vue观察一个数组时，它会重写数组的一些原型方法（如push、pop、shift等），并在这些方法被调用时触发依赖收集和派发更新。
1. 首先，Vue会调用原始的数组方法，以确保数组的正常操作。  
  
2. 然后，Vue会遍历数组中的每个元素，并对每个元素进行观察（observe）。这是为了确保数组中的每个元素都是响应式的。  
  
3. 接下来，Vue会检查是否有正在进行依赖收集的Watcher实例（即是否存在全局的Dep.target）。如果有，Vue会将这个Watcher实例添加到数组的依赖列表中。  
  
4. 最后，Vue会通过调用依赖列表中每个Watcher实例的更新方法来派发更新。

```js
// src/observer/index.js

// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  let childOb = observe(value); // childOb就是Observer实例

  let dep = new Dep(); // 为每个属性实例化一个Dep

  Object.defineProperty(data, key, {
    get() {
      // 页面取值的时候 可以把watcher收集到dep里面--依赖收集
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
        dep.depend();
        if (childOb) {
          // 这里表示 属性的值依然是一个对象 包含数组和对象 childOb指代的就是Observer实例对象  里面的dep进行依赖收集
          // 比如{a:[1,2,3]} 属性a对应的值是一个数组 观测数组的返回值就是对应数组的Observer实例对象
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果数据结构类似 {a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套  数组包含数组的情况  那么我们访问a的时候 只是对第一层的数组进行了依赖收集 里面的数组因为没访问到  所以五大收集依赖  但是如果我们改变了a里面的第二层数组的值  是需要更新页面的  所以需要对数组递归进行依赖收集
            if (Array.isArray(value)) {
              // 如果内部还是数组
              dependArray(value); // 不停的进行依赖收集
            }
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      // 如果赋值的新值也是一个对象  需要观测
      observe(newValue);
      value = newValue;
      dep.notify(); // 通知渲染watcher去更新--派发更新
    },
  });
}
// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    // e.__ob__代表e已经被响应式观测了 但是没有收集依赖 所以把他们收集到自己的Observer实例的dep里面
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      // 如果数组里面还有数组  就递归去收集依赖
      dependArray(e);
    }
  }
}

```
## 8.数组的派发更新

```js
// src/observer/array.js

methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性代表的是该数据已经被响应式观察过了 __ob__对象指的就是Observer实例
    const ob = this.__ob__;
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
    if (inserted) ob.observeArray(inserted); // 对新增的每一项进行观测
    ob.dep.notify(); //数组派发更新 ob指的就是数组对应的Observer实例 我们在get的时候判断如果属性的值还是对象那么就在Observer实例的dep收集依赖 所以这里是一一对应的  可以直接更新
    return result;
  };
});
```
# 总结
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cf5aa3ec2c24167802106f9b4d14354~tplv-k3u1fbpfcp-watermark.image?)
# 参考文章
[手写Vue2.0源码（三）-初始渲染原理｜技术点评 - 掘金 (juejin.cn)](https://juejin.cn/post/6937120983765483528#heading-3)