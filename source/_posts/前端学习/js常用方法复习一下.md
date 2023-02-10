---
title: js常用方法
date: 2023-02-10 18:46
categories: 前端随笔
tag: [前端随笔] 
---

## 一、对象和字符串常用的方法

### 字符串常用的方法

1.indexOf()： 检索字符串，返回的是字符在字符串的下标

2.concat()：连接字符串

3.match()：在字符串内检索指定的值或找到一个或多个正则表达式的匹配，返回的是值而不是值的位置。

4.replace()：替换匹配的字符串

5.search()：检索与字符串匹配的子串，返回的是第一个字符所在的位置

6.split()：把字符分割成数组

7.substr()：从起始索引号提取字符串中指定书目的字符

### 对象常用的方法

1.Object.assign()

Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。常用来合并对象。

assign其实是浅拷贝而不是深拷贝，如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。

```
const obj1 = { a: 1, b: 2 }
const obj2 = { b: 4, c: 5 }
const obj3 = Object.assign(obj1, obj2)
const obj4 = Object.assign({}, obj1) // 克隆了obj1对象
```

2.Object.keys() 对象的下标

3.Object.values() 对象的值

3.is方法和（===）功能基本类似，用于判断两个值是否绝对相等。

```
Object.is(1,1);//true
Object.is(1,true);//false
Object.is([],[]);//false
Object.is(+0,-0);//false
Object.is(NaN,NaN);//true
```
## 二、javascript高阶函数
### 1.map()

定义：map()方法定义在JavaScript的Array中，它返回一个新的数组，数组中的元素为原始数组调用函数处理后的值。

注意：map()不会对空数组进行检测，map()不会改变原始数组

语法：array.map(function(currentValue, index, arr), thisIndex)

参数说明：

currentValue：必须。当前元素的的值。 index：可选。当前元素的索引。 arr：可选。当前元素属于的数组对象。

thisIndex：可选。对象作为该执行回调时使用，传递给函数，用作"this"的值。

### 2.reduce

定义：reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值

注意: reduce() 对于空数组是不会执行回调函数的和map一样。

语法：array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

参数说明：

total 必需。初始值, 或者计算结束后的返回值。 currentValue 必需。当前元素 currentIndex 可选。当前元素的索引 arr 可选。当前元素所属的数组对象。

```
totalAge = users.reduce((total, user) => user.age + total, 0);
console.log(totalAge);
```

### 3.filter

定义：filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。

注意： filter() 不会对空数组进行检测。

注意： filter() 不会改变原始数组。

语法 array.filter(function(currentValue,index,arr), thisValue)

参数说明：

currentValue 必须。当前元素的值 index 可选。当前元素的索引值 arr 可选。当前元素属于的数组对象

```
startsWithB = (string) => string.toLowerCase().startsWith('b');
namesStartingWithB = users.filter((user) => startsWithB(user.name));
console.log(namesStartingWithB);
// [{ "name": "Bill", "age": 20 }]
```