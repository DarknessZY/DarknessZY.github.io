---
title: JavaScript 异步队列实现
date: 2022-11-10 13:30
tags: [微任务, 宏任务]
categories: 前端随笔
---

# 前言

​	了解JavaScript 异步队列实现，我们需要先了解什么是同步任务，什么是异步任务，异步代码中才区分宏任务微任务，什么是宏任务、微任务？宏任务、微任务有哪些？又是怎么执行的？

# 一、异步任务和同步任务

![同步任务与异步任务](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b354be478dd4d369799be4d4f0087e2~tplv-k3u1fbpfcp-watermark.image?)

​		js 是一种单线程语言，简单的说就是：只有一条通道，那么在任务多的情况下，就会出现拥挤的情况，这种情况下就产生了 ‘多线程’ ，但是这种“多线程”是通过单线程模仿的，一切javascript多线程都是纸老虎！那么就产生了同步任务和异步任务。

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。

- 当指定的事情完成时，Event Table会将这个函数移入Event Queue。

- 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。

- 上述过程会不断重复，也就是常说的Event Loop(事件循环)。

  

  > 那怎么知道主线程执行栈为空啊？js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。

```
let data = [];
$.ajax({
    url:www.javascript.com,
    data:data,
    success:() => {
        console.log('发送成功!');
    }
})
console.log('代码执行结束');
```

- ajax进入Event Table，注册回调函数`success`。
- 执行`console.log('代码执行结束')`。
- ajax事件完成，回调函数`success`进入Event Queue。
- 主线程从Event Queue读取回调函数`success`并执行。

# 二、宏任务和微任务是什么呢？

|                    |                   **宏任务（macrotask）**                    |                   **微任务（microtask）**                    |
| :----------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|      谁发起的      |                     宿主（Node、浏览器）                     |                            JS引擎                            |
|      具体事件      | 1. script (可以理解为外层同步代码)2. setTimeout/setInterval3. UI rendering/UI事件4. postMessage，MessageChannel5. setImmediate，I/O（Node.js） | 1. Promise2. MutaionObserver3. Object.observe（已废弃；Proxy 对象替代）4. process.nextTick（Node.js） |
|      谁先执行      |                            后运行                            |                            先运行                            |
| 会触发新一轮Tick吗 |                              会                              |                             不会                             |

## 1.宏任务、微任务是怎么执行的？

​	执行顺序：先执行同步代码，遇到异步宏任务则将异步宏任务放入宏任务队列中，遇到异步微任务则将异步微任务放入微任务队列中，当所有同步代码执行完毕后，再将异步微任务从队列中调入主线程执行，微任务执行完毕后再将异步宏任务从队列中调入主线程执行，一直循环直至所有任务执行完毕。

![宏任务、微任务是怎么执行](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71de5ee24ed84d108e0d1127c03f6474~tplv-k3u1fbpfcp-watermark.image?)



# 三、关系总结

![总结](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/945651e8e2404a5093810c7d73272897~tplv-k3u1fbpfcp-watermark.image?)

上图也是盗的，自己对这些做个笔记，加深影响，到时候回顾起来也比较方便！

# 参考文章

​	[这一次，彻底弄懂 JavaScript 执行机制 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903512845860872)

​	[ 微任务/宏任务和同步/异步之间的关系_](https://blog.csdn.net/weixin_45888701/article/details/116781078)