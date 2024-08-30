---
title: js基础回顾
date: 2024-08-30 16:54
tags: [前端随笔]
categories: 前端随笔
---

## javaScripit的数据类型

基本数据类型：number、bigint、string、null、undefined、boolean、symbol

引用数据类型：array、object、function 本质上都是object

## js的引用数据类型和基本数据类型的区别
1.存储位置不同

基本数据类型：直接存储在栈（stack）中的简单数据段

引用数据类型：以 **地址：数据** 的映射关系来进行存储，地址存放在栈内存中。数据实体存放在堆内存中。

## 什么是栈？什么是堆？
栈是一种线性数据结构，遵循先进后出的原则，用于存储简单数据结构。
堆是一种用于动态内存分配的数据结构，用于存储复杂的数据结构和对象。
## js如何判断数据类型？
1.typeof
typeof主要用来检测一个变量是不是基本数据类型（null除外， typeof null的结果是object）
如果用typeof检测引用数据类型基本判断的都是object，typeof function判断的结果是function。

2.instanceof：通过查找原型链来检测某个变量是否为某个类型数据的实例

```js
 const a = [0, 1, 2];
        console.log(a instanceof Array); // true
        console.log(a instanceof Object); // true

        const b = {name: 'xx'};
        console.log(b instanceof Array); // false
        console.log(b instanceof Object); // true
```

3.Object.prototype.toString.call()方法来揭示类型
每种引用类型都会直接或间接继承自Object类型，因此它们都包含toString()函数。不同数据类型的toString()类型返回值是不一样的，所以通过toString()函数可以准确判断值的类型。
## Es6新增的语法
- 1.模版字符串
- 2.解构赋值
- 3.let和const
- 4.默认参数
- 5.扩展运算符
- 6.类（class）
- 7.模块化 （export关键字导出模块，import关键字导入模块）
- 8.promise
- 9.Generator
- 10.箭头函数
- 11.for of


## let、const、var的区别
- 1.var声明的变量存在变量提升，let和const没有（在声明前使用会报错）
- 2.var声明的变量可以多次声明，后面声明的会覆盖前面的，let和const不允许在相同作用域重复声明
- 3.let和const是块级作用域（只要块级作用域内存在let命令，这个区域不受外包影响），var是受外部影响的。
- 4.var和let可以修改声明的变量，const不行，但对于引用数据类型，可以修改其里面的属性值，内存地址是无法修改的
## 箭头函数this指向
1.所有函数在执行时，会创建一个函数执行上下文，普通函数的执行上下文中会有一个变量this，而箭头函数不会创建自己的this对象只会继承在自己作用域的上一层的this

2.箭头函数没有自己的this，所以箭头函数中的this的指向在它定义时就已经确定了，之后不会改变。
### 数组常用方法

```js
arr.push() 向数组末尾添加
arr.pop() 数组末尾删除
arr.shift() 数组头部删除
arr.unshift() 向数组头部添加
arr.join(',') 数组以什么形式分隔
arr.sort() 数组排序
arr.splice(1,2,'1') 在指定位置删除指定个数元素再增加任意个数元素 （实现数组任意位置的增删改)
arr.concat(arr2) 合并arr和arr2两数组
arr.toString() 数组转字符串，本质是内部调用了arr.join()
arr.valueOf()  返回数组的值
arr.indexOf() 查询某个元素第一次出现的位置，存在返回该元素下标，不存在返回-1
arr.lastIndexOf() 反向查询某个元素第一次出现的位置
arr.includes() 检查数组中有没有某个值
```
数组迭代方法

```js
arr.forEach()  遍历数组,每次循环中执行传入的回调函数
arr.map()  遍历数组,每次循环中执行传入的回调函数，需要有返回值，据回调函数的返回值,生成一个新的数组
arr.some()  遍历数组,判断某个元素是否满足条件
arr.every() 遍历数组,判断所有元素都满足条件
arr.find() 遍历数组,执行回调函数,回调函数执行一个条件,返回满足条件的第一个元素,不存在返回undefined
arr.findIndex() 遍历数组,执行回调函数,回调函数接受一个条件,返回满足条件的第一个元素下标,不存在返回-1
arr.reduce()  (归并)遍历数组, 每次循环时执行传入的回调函数,回调函数会返回一个值,将该值作为初始值prev,传入到下一次函数中,返回的最终操作结果
arr.reduceRight() 同上reduce，不过是从右往左
```
### 字符串的方法

```js
str.concat(str2,str3) 连接字符串
str.indexof() 搜索指定字符位置
str.lastIndexOf() 搜索指定字符最后1一次出现的位置
str.replace('wo','ni') 字符串替换wo替换为ni
str.slice(2,4) 取字符串的某个部分，返回一个新的字符串。
str.subString(2,7) 截取两下标之间的字符，修改的是原字符串，slice是生成新字符串
str.substr(start,length) 返回的字符串包含从 start的length个字符
str.split(',') 字符串转数组，根据xx分隔
str.trim() 从一个字符串的两端删除空白字符
str.includes('xx') 检查字符串是否包含指定的字符，有为true，反之false
str.toLowerCase() 字符转小写
str.toUpperCase() 字符转大写
str.endsWith()  检查字符串是否已指定字符串结束，是返回true，反之
str.repeat(2) 将字符串复制指定次数 
```
### 对象常用的实例方法

```js
Object.create(pro,obj) : 创建一个对象

Object.assign(target,...obj) : 浅拷贝，可以合并对象

Object.defineProperty(obj, prop, descriptor) : 添加或修改一个自有属性并返回对象

Object.keys() : 返回给定对象自身key组成的数组

Object.values(): 返回给定对象自身value组成的数组

Object.freeze(obj) : 冻结对象,对象不可改变

Object.entries(obj) : 返回对象键值对数据

Object.getPrototypeOf(obj) : 返回对象原型

Object.is(value1, value2) : 判断两个值是否相等,约等于 ===
```
### object.defineProperty和Proxy都是怎么实现数据代理的
Object.defineProperty()方法可以用来定义一个对象的属性,并为其设置一个getter或setter函数。当访问或修改该属性时,会自动调用这些函数。通过这种方式,可以实现对数据的读取和修改进行控制。

Proxy对象可以用来创建一个代理对象,该代理对象会拦截对原始对象的读取和修改操作,并将其转发到原始对象上。通过这种方式,可以实现对数据的读取和修改进行控制。

### 怎么理解promise的
promise是异步编程的一种解决方案

promise仅有三种状态：pending（进行中）、rejected（失败）、fulfilled（成功）

promise的使用：
```js
promise
.then(result => {···})  //状态发生改变时
.catch(error => {···}) // 指定发生错误时的回调函数
.finally(() => {···}); // 不管promise最后的状态，都执行
```

promise.all()

`Promise.all()`方法用于将多个 `Promise`实例，包装成一个新的 `Promise`实例

实例`p`的状态由`p1`、`p2`决定，分为两种：

-   只有`p1`、`p2`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数
-   只要`p1`、`p2`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数

注意，如果作为参数的 `Promise` 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]

```


promise.race()

promise.race()方法同样是将多个promise实例，包装成一个新的promise实例，只要其中一个实例状态变化就跟着改变，例如设置图片超时时间


```js
//请求某个图片资源
function requestImg(){
    var p = new Promise(function(resolve, reject){
        var img = new Image();
        img.onload = function(){
           resolve(img);
        }
        //img.src = "https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg"; 正确的
        img.src = "https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg1";
    });
    return p;
}

//延时函数，用于给请求计时
function timeout(){
    var p = new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('图片请求超时');
        }, 5000);
    });
    return p;
}

Promise
.race([requestImg(), timeout()])
.then(function(results){
    console.log(results);
})
.catch(function(reason){
    console.log(reason);
});

```
## bind()、call()和apply()
-   三者都可以改变函数的`this`对象指向
-   三者第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`
-   三者都可以传参，但是`apply`是数组，而`call`是参数列表，且`apply`和`call`是一次性传入参数，而`bind`可以分为多次传入
-   `bind`是返回绑定this之后的函数，`apply`、`call` 则是立即执行

## 事件循环

js里的所有任务都可以分为同步任务和异步任务，同步任务一般会直接进入主执行栈中，异步任务则是进入一个任务队列中，当主线程里的同步任务执行完了，会去任务队列里读取异步任务推入主线程执行。异步任务队列不只有一个，分为宏任务和微任务，当主线程来读取异步任务队列时，会先将所有微任务依次执行完，再去执行宏任务，期间有其他任务进入也是按上面规则，如此循环形成事件循环

常见的微任务：promise.then(),promise.catch(),process.nextTick

常见的宏任务：setTimeOut等定时器事件、postMessage

## 原型和原型链
原型：每个函数都有一个特殊的属性叫做原型prototype，该原型prototype有一个自有属性construct，这个属性指向该函数。还有一个_proto_属性，该属性指向的是构造函数的原型。

原型链：当在实例化的对象中访问一个属性时，首先会在该对象内部(自身属性)寻找，如找不到，则会向其__proto__指向的原型中寻找，如仍找不到，则继续向原型中__proto__指向的上级原型中寻找，直至找到或Object.prototype.__proto__为止（值为null），这种链状过程即为原型链。

## js中如何实现继承的
js中常见的继承方式：
原型链继承、构造函数继承（call）、组合继承、原型式继承（Object.creat（）实现的是浅拷贝）、寄生组合继承

e56中`extends` 的语法糖和寄生组合继承的方式基本类似