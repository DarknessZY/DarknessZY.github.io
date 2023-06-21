---
title: React基础
date: 2022-11-23 13:30
tags: [recat]
categories: recat
---
# React JSX
全称：javascript XML

作用：用来创建react虚拟dom对象

优点：
-   JSX 执行更快，因为它在编译为 JavaScript 代码后进行了优化。
-   它是类型安全的，在编译过程中就能发现错误。
-   使用 JSX 编写模板更加简单快速。

基本语法规则：
- 遇到以<开头的代码 以标签语法来解析 html的同名标签就转化成html的标签
- 遇到以{开头的代码 以js语法来解析 标签中的js语法一定要用{}包裹起来

基本使用：

```js
const element = <h1 className="foo">Hello, world</h1>;
ReactDOM.render(element,document.getElementById('root'));
```

## 1.使用JSX

```js
ReactDOM.render(
      	<div>
      	<h1>zy</h1>
        <p data-myattribute = "somevalue">React学习</p>
        </div>
      	,
      	document.getElementById('root')
      );
```
### 1.1 JSX中使用js语法
- JSX 中使用 JavaScript 表达式。表达式需写在花括号  **{}**  中
- 在 JSX 中不能使用 **if else** 语句，但可以使用 **conditional (三元运算)**  表达式来替代。以下实例中如果变量 **i** 等于 **1** 浏览器将输出 **true**, 如果修改 i 的值，则会输出 **false**.

实例：

```js
ReactDOM.render( 
     <div> 
        <h1>{1+1}</h1>
        <h1>{i == 1 ? 'True!' : 'False'}</h1> 
     </div> 
     , document.getElementById('root') 
);
```
### 1.2 JSX中使用样式
React 推荐使用内联样式。我们可以使用 **camelCase** 语法来设置内联样式. React 会在指定元素数字后自动添加 **px** 。

```js
var myStyle = { fontSize: 100, color: '#FF0000' }; 
ReactDOM.render( 
        <h1 style = {myStyle}>zy</h1>, 
        document.getElementById('root') 
);
```
### 1.3 JSX中使用注释
注释需要写在花括号中

```js
ReactDOM.render( 
        <div>
        <h1>zy</h1>, 
        {/*注释 我无敌，你随意*/}
        </div>
        document.getElementById('root') 
);
```
### 1.3 JSX中使用数组
JSX 允许在模板中插入数组，数组会自动展开所有成员：
```js
var arr = [ 
    <h1>666</h1>, 
    <h2>777</h2>, 
]; 
ReactDOM.render( 
    <div>{arr}</div>, 
    document.getElementById('root') 
);
```
```js
var arr = ['React','html','css']; 
ReactDOM.render( 
    <ul>{arr.map((item,index) =>{
        return <li key={index}>{item}</li>
    )}</ul>, 
    document.getElementById('root') 
);
```