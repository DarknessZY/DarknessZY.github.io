---
title:Vue2源码学习笔记(六)——vue源码学习（六）—— 异步更新原理和diff算法原理
date: 2023-08-31 15:26
categories: vue2源码学习
tag: [vue]
---
# 前言
> 要来力！ diff算法，以前只是知其然而不知其所以然，接下来将完成diff算法原理的学习，至于为什么把他和异步更新原理一起学习，是我认为它们都是性能优化方面的，异步更新是对视图更新的性能优化，而diff是对渲染更新的性能优化。同样还是跟着鲨鱼大佬的源码学习，后面有大佬文章链接。

## 异步更新原理
异步更新原理主要是对视图更新的性能优化，总结：

在Vue 2中，异步更新是通过事件循环机制实现的。当Vue组件的响应式状态发生变化时，Vue会将更新操作推入一个队列中，而不是立即执行更新。然后，在下一个事件循环周期中，Vue会遍历队列并执行更新操作。  

这种异步更新的机制有以下几个好处：  

1. 提高性能：将多个状态变化合并为一个更新操作，避免了频繁的DOM操作，从而提高了性能。 
2. 避免重复更新：如果在同一个事件循环周期内多次修改了同一个状态，Vue只会执行一次更新操作，避免了重复更新。  
3. 避免阻塞UI线程：由于更新操作是在下一个事件循环周期中执行的，所以不会阻塞UI线程，保持了页面的流畅性。

### 1.watcher

```js
// src/observer/watcher.js
import { queueWatcher } from "./scheduler";
export default class Watcher {
  update() {
    // 每次watcher进行更新的时候  是否可以让他们先缓存起来  之后再一起调用
    // 异步队列机制
    queueWatcher(this);
  }
  run() {
    // 真正的触发更新
    this.get();
  }
}

```

### 2.queueWatcher 实现队列机制
queueWatcher函数是用于实现异步更新队列机制的关键函数之一。它的作用是将Watcher对象推入更新队列中，以便在下一个事件循环周期中执行更新操作

```js
// src/observer/scheduler.js

import { nextTick } from "../util/next-tick";
// 定义一个全局的更新队列数组
const queue = [];
// 定义一个标志位，用于表示是否正在执行更新操作
let isUpdating = false;
// 定义一个函数，用于执行更新操作
function flushSchedulerQueue() {
  // 标记为正在执行更新操作
  isUpdating = true;

  // 遍历更新队列中的Watcher对象，并依次执行其更新操作
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i];
    watcher.run();
  }

  // 清空更新队列
  queue.length = 0;

  // 标记更新操作已完成
  isUpdating = false;
}

// 定义一个函数，用于将Watcher对象推入更新队列中
function queueWatcher(watcher) {
  // 如果Watcher对象尚未在更新队列中，则将其推入队列中
  if (!queue.includes(watcher)) {
    queue.push(watcher);
  }

  // 如果更新队列为空且当前不处于更新操作中，则执行更新操作
  if (queue.length === 1 && !isUpdating) {
    nextTick(flushSchedulerQueue);
  }
}
```

3.nextTick的实现原理
可以看到在执行异步渲染时，我们使用nexTick，nexTick是在下次Dom更新执行延迟回调，那它的具体实现方式是什么呢？

简单版：

```js
// 定义一个回调函数数组
const callbacks = [];

// 定义一个标志位，用于表示是否正在执行回调函数
let pending = false;

// 定义一个函数，用于执行回调函数
function flushCallbacks() {
  // 标记为正在执行回调函数
  pending = true;

  // 遍历回调函数数组，并依次执行回调函数
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }

  // 清空回调函数数组
  callbacks.length = 0;

  // 标记回调函数已执行完成
  pending = false;
}

// 定义一个函数，用于将回调函数推入回调函数数组中
function nextTick(callback) {
  // 将回调函数推入回调函数数组中
  callbacks.push(callback);

  // 如果当前不处于执行回调函数的状态，则执行回调函数
  if (!pending) {
    setTimeout(flushCallbacks, 0);
  }
}
```
采用优雅降级后的：

```js
// src/util/next-tick.js

let callbacks = [];
let pending = false;
function flushCallbacks() {
  pending = false; //把标志还原为false
  // 依次执行回调
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
let timerFunc; //定义异步方法  采用优雅降级
if (typeof Promise !== "undefined") {
  // 如果支持promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== "undefined") {
  // MutationObserver 主要是监听dom变化 也是一个异步方法
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") {
  // 如果前面都不支持 判断setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 最后降级采用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  // 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
  callbacks.push(cb);
  if (!pending) {
    // 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
    pending = true;
    timerFunc();
  }
}

```
### 3.nextTick原理总结
因此`nextTcik`说白了就是通过事件循环的机制（每次当一次事件循环结束后，即一个宏任务执行完成后以及微任务队列被清空后，浏览器就会进行一次页面更新渲染。），利用微任务和宏任务结合优雅降级的方式来执行回调函数，从而实现在下次`Dom`更新完后执行的回调函数。当某个由`watcter`监听观察的值发生，并通知相应的`DOM`更新，这时`dom`更新同步执行发现`nextTcik`是个微任务或宏任务，放在队列中，同步任务执行完了，浏览器就会进行一次页面更新渲染，再取出nextTick的队列，执行了`nextTick`的回调函数。

最后将其挂载到`vue`的原型方法上，就是我们经常使用的`$nextTick()`方法了

## diff算法原理
前提纪要：[Vue2源码学习笔记(三)——初次渲染原理 - 掘金 (juejin.cn)](https://juejin.cn/post/7265455444037582907)

`Vue`在初始化页面后，会将当前的真实`DOM`转换为虚拟`DOM`（Virtual DOM），并将其保存起来，这里称为`oldVnode`。然后当某个数据发变化后，`Vue`会先生成一个新的虚拟`DOM`——`vnode`，然后将`vnode`和`oldVnode`进行比较，找出需要更新的地方，然后直接在对应的真实`DOM`上进行修改。当修改结束后，就将`vnode`赋值给`oldVnode`存起来，作为下次更新比较的参照物。其中新旧`vnode`的比较，也就是我们常说的`Diff`算法
-   **为什么需要 diff ?**

复用 DOM 比直接替换（移除旧 DOM，创建新 DOM ）性能好的多。
-   **diff 原则？**

原地复用 > 移动后复用 >> 暴力替换

### 1.patch 核心渲染方法
`patch()`方法，该方法接收新旧虚拟Dom，即`oldVnode`，`vnode`.

1.首先，检查`oldVnode`是否是一个真实的`DOM`元素，如果是，则表示这是初次渲染，不需要进行Diff算法的比较。   

2.如果`oldVnode`是一个虚拟`DOM`节点，那么就需要使用Diff算法进行更新过程。首先，代码检查新旧虚拟`DOM`节点的标签是否一致，如果不一致，则直接用新的虚拟`DOM`节点替换旧的真实`DOM`节点。  

3.接下来，代码检查旧虚拟`DOM`节点是否是一个文本节点，如果是，则比较新旧文本内容是否一致，如果不一致，则更新旧文本节点的`textContent`。  

4.如果既不是标签不一致的情况，也不是文本节点的情况，那么说明标签一致且不是文本节点。为了节点复用，代码将旧虚拟`DOM`节点对应的真实`DOM`节点赋值给新虚拟`DOM`节点的`el属性`。  

5.然后，代码调用`updateProperties`函数来更新新虚拟`DOM`节点的属性。

6.接下来，代码获取旧虚拟DOM节点的子节点和新虚拟`DOM`节点的子节点，并进行比较和更新。  

- 如果旧节点和新节点都有子节点，代码调用`updateChildren`函数来比较和更新子节点。  
- 如果只有旧节点有子节点，代码将旧节点的innerHTML清空，相当于移除所有旧子节点。  
- 如果只有新节点有子节点，代码遍历新子节点，并将它们创建为真实`DOM`节点，并添加到旧节点的`el`中。  
  

这样，根据新旧虚拟`DOM`节点的差异，代码完成了相应的更新操作。以下是简单的实现方式：

```js
// src/vdom/patch.js

export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // oldVnode是真实dom元素 就代表初次渲染
  } else {
    // oldVnode是虚拟dom 就是更新过程 使用diff算法
    if (oldVnode.tag !== vnode.tag) {
      // 如果新旧标签不一致 用新的替换旧的 oldVnode.el代表的是真实dom节点--同级比较
      oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }
    // 如果旧节点是一个文本节点
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text;
      }
    }
    // 不符合上面两种 代表标签一致 并且不是文本节点
    // 为了节点复用 所以直接把旧的虚拟dom对应的真实dom赋值给新的虚拟dom的el属性
    const el = (vnode.el = oldVnode.el);
    updateProperties(vnode, oldVnode.data); // 更新属性
    const oldCh = oldVnode.children || []; // 老的儿子
    const newCh = vnode.children || []; // 新的儿子
    if (oldCh.length > 0 && newCh.length > 0) {
      // 新老都存在子节点
      updateChildren(el, oldCh, newCh);
    } else if (oldCh.length) {
      // 老的有儿子新的没有
      el.innerHTML = "";
    } else if (newCh.length) {
      // 新的有儿子
      for (let i = 0; i < newCh.length; i++) {
        const child = newCh[i];
        el.appendChild(createElm(child));
      }
    }
  }
}

```
### 2.调用updateProperties函数来更新新虚拟DOM节点的属性
`updateProperties`函数的主要作用就是将新虚拟`DOM`节点的属性映射到对应的真实`DOM`节点上，是根据新旧虚拟`DOM`节点的属性差异，代码完成了对真实`DOM`节点属性的更新操作。
```js
//  src/vdom/patch.js

// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode, oldProps = {}) {
  const newProps = vnode.data || {}; //新的vnode的属性
  const el = vnode.el; // 真实节点
  // 如果新的节点没有 需要把老的节点属性移除
  for (const k in oldProps) {
    if (!newProps[k]) {
      el.removeAttribute(k);
    }
  }
  // 对style样式做特殊处理 如果新的没有 需要把老的style值置为空
  const newStyle = newProps.style || {};
  const oldStyle = oldProps.style || {};
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }
  // 遍历新的属性 进行增加操作
  for (const key in newProps) {
    if (key === "style") {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}
```
### 3.updateChildren 更新子节点-diff 核心方法
`updateChildren`函数通过双指针的方式，新旧头尾指针进行比较，循环向中间靠拢,对比新旧子节点数组的差异，并根据差异进行相应的更新操作，实现了虚拟DOM的高效更新。
```js
// src/vdom/patch.js

// 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}
// diff算法核心 采用双指针的方式 对比新老vnode的儿子节点
function updateChildren(parent, oldCh, newCh) {
  let oldStartIndex = 0; //老儿子的起始下标
  let oldStartVnode = oldCh[0]; //老儿子的第一个节点
  let oldEndIndex = oldCh.length - 1; //老儿子的结束下标
  let oldEndVnode = oldCh[oldEndIndex]; //老儿子的起结束节点

  let newStartIndex = 0; //同上  新儿子的
  let newStartVnode = newCh[0];
  let newEndIndex = newCh.length - 1;
  let newEndVnode = newCh[newEndIndex];

  // 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
  function makeIndexByKey(children) {
    let map = {};
    children.forEach((item, index) => {
      map[item.key] = index;
    });
    return map;
  }
  // 生成的映射表
  let map = makeIndexByKey(oldCh);

  // 只有当新老儿子的双指标的起始位置不大于结束位置的时候  才能循环 一方停止了就需要结束循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 因为暴力对比过程把移动的vnode置为 undefined 如果不存在vnode节点 直接跳过
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头和头对比 依次向后追加
      patch(oldStartVnode, newStartVnode); //递归比较儿子以及他们的子节点
      oldStartVnode = oldCh[++oldStartIndex];
      newStartVnode = newCh[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      //尾和尾对比 依次向前追加
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 老的头和新的尾相同 把老的头部移动到尾部
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); //insertBefore可以移动或者插入真实dom
      oldStartVnode = oldCh[++oldStartIndex];
      newEndVnode = newCh[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 老的尾和新的头相同 把老的尾部移动到头部
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldCh[--oldEndIndex];
      newStartVnode = newCh[++newStartIndex];
    } else {
      // 上述四种情况都不满足 那么需要暴力对比
      // 根据老的子节点的key和index的映射表 从新的开始子节点进行查找 如果可以找到就进行移动操作 如果找不到则直接进行插入
      let moveIndex = map[newStartVnode.key];
      if (!moveIndex) {
        // 老的节点找不到  直接插入
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        let moveVnode = oldCh[moveIndex]; //找得到就拿到老的节点
        oldCh[moveIndex] = undefined; //这个是占位操作 避免数组塌陷  防止老节点移动走了之后破坏了初始的映射表位置
        parent.insertBefore(moveVnode.el, oldStartVnode.el); //把找到的节点移动到最前面
        patch(moveVnode, newStartVnode);
      }
    }
  }
  // 如果老节点循环完毕了 但是新节点还有  证明  新节点需要被添加到头部或者尾部
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 这是一个优化写法 insertBefore的第一个参数是null等同于appendChild作用
      const ele =
        newCh[newEndIndex + 1] == null ? null : newCh[newEndIndex + 1].el;
      parent.insertBefore(createElm(newCh[i]), ele);
    }
  }
  // 如果新节点循环完毕 老节点还有  证明老的节点需要直接被删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldCh[i];
      if (child != undefined) {
        parent.removeChild(child.el);
      }
    }
  }
}
```
### 4.改造原型渲染更新方法_update
当数据发生变化时订阅者`watcher`就会调用_update
```js
// src/lifecycle.js

export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const prevVnode = vm._vnode; // 保留上一次的vnode
    vm._vnode = vnode;
    if (!prevVnode) {
      // patch是渲染vnode为真实dom核心
      vm.$el = patch(vm.$el, vnode); // 初次渲染 vm._vnode肯定不存在 要通过虚拟节点 渲染出真实的dom 赋值给$el属性
    } else {
      vm.$el = patch(prevVnode, vnode); // 更新时把上次的vnode和这次更新的vnode穿进去 进行diff算法
    }
  };
}
```

### 5.diff算法总结

-   当数据发生改变时，订阅者`watcher`就会调用原型方法_update中的`patch`给真实的`DOM`打补丁

-   判断是否是初始化渲染，是则不需要diff算法，否则就走diff算法
    -   找到对应的真实`dom`，称为`el`
    -    如果都有都有文本节点且不相等，将`el`文本节点设置为`Vnode`的文本节点
    -   如果`oldVnode`有子节点而`VNode`没有，则删除`el`子节点
    -   如果`oldVnode`没有子节点而`VNode`有，则将`VNode`的子节点真实化后添加到`el`
    -   如果两者都有子节点，则执行`updateChildren`函数比较子节点


-   `updateChildren`主要做了以下操作：
    -   设置新旧`VNode`的头尾指针
    -   新旧头尾指针进行比较，循环向中间靠拢，根据情况`patch`重复流程或调用`createElem`创建一个新节点
    -   从哈希表寻找 `key`一致的`VNode` 节点再分情况操作，如果标签，key值，属性都相同就可以就地复用
    
# 个人博客
[耀耀切克闹 (yaoyaoqiekenao.com)](https://yaoyaoqiekenao.com/)

# 参考文章
[手写Vue2.0源码（六）-diff算法原理 - 掘金 (juejin.cn)](https://juejin.cn/post/6953433215218483236#heading-6)