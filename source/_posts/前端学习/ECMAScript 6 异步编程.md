---
title: ECMAScript 6 异步编程
date: 2023-05-11 10:45
tags: [随笔]
categories: 前端随笔
theme: channing-cyan 
highlight: atom-one-dark
---

# 前言
>  观[阮一峰](http://www.ruanyifeng.com/)大佬的《深入掌握 ECMAScript 6 异步编程》 ，记录的笔记,其实也看了很多其他人写的文章，但主要的笔记记录，还得是他。
## 异步编程的方式
- 回调函数 **就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。**
- 事件监听**任务的执行不取决于代码的顺序，而取决于某个事件是否发生**
- 发布/订阅 **存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做["发布/订阅模式"](https://en.wikipedia.org/wiki/Publish-subscribe_pattern)**
- Promises对象**每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数，本质上还是利用回调函数**
- 生成器函数 Generator/ yield **yield表达式可以暂停函数执行，next方法用于恢复函数执行，这使得Generator函数非常适合将异步任务同步化**
- async/await 函数  **async 函数是通过`generator 和 promise 实现的一个自动执行的语法糖`，当函数内部执行到一个await 语句的时候，如果语句返回一个 promise 对象，那么函数将会等待 promise 对象的状态变为 resolve 后再继续向下执行。因此可以将异步逻辑，转化为同步的顺序来书写。**
## 协程
["协程"](https://en.wikipedia.org/wiki/Coroutine)（coroutine），意思是多个线程互相协作，完成异步任务。生成器函数 Generator/ yield 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

举例来说，读取文件的协程写法如下：

 ```
 function *asnycJob() {
   // ...其他代码
  var f = yield readFile(fileA);
   // ...其他代码
 }
 ```

上面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

异步的关键就是把会阻塞线程函数的执行权交出去，让这个函数等待恢复执行，等待的时间内请求（或者其他异步任务）也该执行完了，这时候再来继续执行这个函数。通过上面对协程的运行方式的讲解我们很容易就能想到用协程来解决这个问题，利用`yield`挂起这个阻塞线程函数，然后继续执行后面的语句，等这个函数不再阻塞了，再回到这个函数继续执行。那么问题来了，应该什么时候继续执行这个挂起的函数呢？（配合promise，根据promise返回的异步任务状态），所以诞生了async/await 函数，也是目前在工作和项目中使用最多的方式，具体实现后面会说明。
## Generator 函数的含义与用法
**什么是 Generator 函数**

在Javascript中，一个函数一旦开始执行，就会运行到最后或遇到return时结束，运行期间不会有其它代码能够打断它，也不能从外部再传入值到函数体内而Generator函数（生成器）的出现使得打破函数的完整运行成为了可能，其语法行为与传统函数完全不同Generator函数是ES6提供的一种异步编程解决方案，形式上也是一个普通函数，但有几个显著的特征：

-  function关键字与函数名之间有一个星号 "*" （推荐紧挨着function关键字）
-  函数体内使用 yield 表达式，定义不同的内部状态 （可以有多个yield）
-  直接调用 Generator函数并不会执行，也不会返回运行结果，而是返回一个遍历器对象（Iterator Object）
-  依次调用遍历器对象的next方法，遍历 Generator函数内部的每一个状态

**执行机制**

调用 Generator 函数和调用普通函数一样，在函数名后面加上()即可，但是 Generator 函数不会像普通函数一样立即执行，而是返回一个指向内部状态对象的指针[迭代器Iterator](https://juejin.cn/post/7038951223264804900))，所以要调用遍历器对象Iterator 的 next 方法，指针就会从函数头部或者上一次停下来的地方开始执行


```js
function* func(){ 
    console.log("one"); 
    yield '1'; 
    console.log("two");
    yield '2'; 
    console.log("three");
    return '3'; 
}
```
```js
f.next(); // one // {value: "1", done: false} 
f.next(); // two // {value: "2", done: false} 
f.next(); // three // {value: "3", done: true} 
f.next(); // {value: undefined, done: true}
```
> 第一次调用 next 方法时，从 Generator 函数的头部开始执行，先是打印了 one ,执行到 yield 就停下来，并将yield 后边表达式的值 '1'，作为返回对象的 value 属性值，此时函数还没有执行完， 返回对象的 done 属性值是 false。
>
> 第二次调用 next 方法时，同上步 。
>
> 第三次调用 next 方法时，先是打印了 three ，然后执行了函数的返回操作，并将 return 后面的表达式的值，作为返回对象的 value 属性值，此时函数已经结束，多以 done 属性值为true 。
>
> 第四次调用 next 方法时， 此时函数已经执行完了，所以返回 value 属性值是 undefined ，done 属性值是 true 。如果执行第三步时，没有 return 语句的话，就直接返回 {value: undefined, done: true}。

由此可以看出 **yield表达式可以暂停函数执行，next方法用于恢复函数执行，这使得Generator函数非常适合将异步任务同步化**

## async/await 函数的含义与用法
async/await的本质其实就是Generator和Promise的语法糖

**async/await的使用**

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url)
    }, 1000)
  })
}

async function foo() {
  const res1 = await requestData('aaa')
  const res2 = await requestData(res1 + 'bbb')
  const res3 = await requestData(res2 + 'ccc')
  console.log(res3)
}

foo()
//3秒钟后打印aaabbbccc
```
**上面代码用 Generator 函数实现**

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url)
    }, 1000)
  })
}
function* generatorFoo() {
	const res1 = yield requestData('aaa')
  const res2 = yield requestData(res1 + 'bbb')
  const res3 = yield requestData(res2 + 'ccc')
  console.log(res3)
}
const generate = generatorFoo()
generate.next().value.then(res1 => {
  generate.next(res1).value.then(res2 => {
    generate.next(res2).value.then(res3 => {
      generate.next(res3)
    })
  })
})
```
因此如果我们把**Generator 函数**封装一下递归调用实现Generator 的自动迭代，是不是可以实现**async/await**的效果，所以说**async/await的本质其实就是Generator和Promise的语法糖**

## 参考
[ES6 Generator 函数 | 菜鸟教程 (runoob.com)](https://www.runoob.com/w3cnote/es6-generator.html)

[async/await的本质分析 - 掘金 (juejin.cn)](https://juejin.cn/post/7038968296518975525)