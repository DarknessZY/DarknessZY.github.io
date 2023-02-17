---
title: 常用的css函数式伪类

date: 2023-02-17 16:36

tags: [伪类,随笔]

categories: 前端随笔
---

# 前言

>  能用css一步解决的，尽量少用js，一些合适的 CSS 甚至能让我们少写很多 JS，之前在工作中遇到了一个问题，本来准备用js实现的，在百度娘的科普下，使用某个CSS 函数式伪类就能实现，发现比自己预想的使用js方便多了，于是我就来多多了解了解一些常用的CSS 函数式伪类，此文做个笔记！（如有雷同，纯属抄袭，手动狗头）

## 一、逻辑组合 伪类
### 1. ：not
> `:not` 匹配不符合一组选择器的元素。

例如一个场景，每个列表项需要添加下边框线，一般最后一项是不需要的。通常我们会为每一项都设置下边框线，再单独设置最后一项的 `border-bottom` 为 0。使用 `:not` 也可以实现。

```css
.item{
  width: 200px;
  height: 100px;
  padding-bottom: 10px;
}
.item:not(:last-child) {
  border-bottom: 1px solid #ccc;
}
```
### 2. :has
> `:has` 表示满足一定条件后，就会匹配该元素。这个据说是几十年来最激动人心的CSS发展`开发人员终于有了一种针对父元素的方法`。

例如一个场景，在必填项的前面加上红色的星号

```css
label:has(+input:required)::before{
  content: '*';
  color: red;
}
```
例如:父元素里有某个子元素时改变父元素的高

```js
.father :has(.son) {
  height: 300px
}
```
### 3. :is
> 可以匹配一组选择器中的任意一个或多个，并把最终的选择器视为匹配到的那一个。`:is()`伪类函数**大幅度缩减了选择器列表的字符数，简化了选择器列表的复杂度，降低了书写选择器列表出错的概率**，注意`:is()` 不能与`::before` 和`::after` 伪元素相匹配

```css
.test>img,.test1>img,.test2>img,.test3>img{}
```
上面的可简化为：

```js
 :is(.test,.test1,.tes2,.test3)>img{}
```
### 4. :empty
> `:empty` 匹配没有子元素的元素。有时候列表的外层会包一层盒子，设置 padding 边距。当列表无数据返回时，外层盒子的 padding 会占用空间，使用 `:empty` 匹配无子元素时隐藏盒子，解决占用位置的问题。


```css
.wrapper{
  padding: 10px;
}
.wrapper:emtry{
  display: none;
}
```
## 二、用户行为 伪类
### 1. :hover
> `selector:hover` 表示匹配鼠标经过的selector选择器元素。**:hover不是特备适用于移动端，虽然也能触发，但消失并不敏捷，体验反而奇怪。**

例如：鼠标经过元素时的样式变化，Tips提示，下拉列表和过渡动画等
### 2. :active
> `selector:active` 表示匹配激活状态的selector选择器元素（通过鼠标主键点击或触屏触摸的过程中触发样式，结束后还原样式），支持任意html元素

### 3. :focus

> `selector:focus` 表示匹配聚焦状态的selector选择器元素。

例如：表单聚焦改变样式

### 4. :focus-within
> `selector:focus-within` 表示当前selector选择器元素或者其子元素聚焦时都会匹配（而focus只会匹配对应元素本身）

例如：form表单中任一表单元素聚集时让所有表单元素前面文字高亮


```css
form:focus-within label{ color:darkblue; text-shadow: 0 0 1px; }
```

## 三、树结构伪类 伪类
### 1. :root
> 该伪类匹配的就是html根元素标签。由于现如今浏览器对CSS变量的支持，对于类似整站颜色，布局尺寸这样的变量，业界约定俗成`变量由:root伪类负责，而html选择器负责样式`。
### 2.:first-child和:last-child

> `selector:first-child` 表示匹配作为其父元素的第一个子元素的selector元素

> `selector:last-child` 表示匹配作为其父元素的最后一个子元素的selector元素

对列表元素的第一个/最后一个子元素的通用样式的重置。例如：最后一个子元素和第一个元素不要底部边框。


```js
li:first-child{ border-bottom:none }
li:last-child{ border-bottom:none }
```
### 3. :nth-child()和nth-last-child()
> `selector:nth-child(n)` 表示匹配第n个子元素的selector元素

> `selector:nth-last-child(n)` 表示匹配从后往前数的第n个子元素的selector元素

> -   `selector:nth-child(odd或even)`表示匹配作为其父元素的第奇数/偶数个子元素的selector元素
>
> -   `selector:nth-child(An+B)`表示匹配符合对应规则的子元素。
>
>     其中A，B，n均为不为负的整数，但A前面可以添加负号。
>

示例：

     nth-child(5n)匹配第5，10，15...个子元素
     
     nth-child(3n+4)匹配第4，7，10...个子元素
     
     nth-child(-n+3)匹配前3个子元素
     
     nth-last-child(-n+3)匹配最后3个子元素
### 4. :first-of-type和:last-of-type

> `selector:first-of-type` 表示匹配与selector元素标签类型一致的第一个子元素

> `selector:last-of-type` 表示匹配与selector元素标签类型一致的最后一个子元素

### 5. :nth-of-type()和nth-last-of-type()

> `selector:nth-of-type(n)` 表示匹配与selector元素标签类型一致的子元素集合里第n个子元素

> `selector:nth-last-of-type(n)` 表示与selector元素标签类型一致的子元素集合里的从后往前数的第n个子元素

# 参考文献
[CSS常用伪类选择器详解 - 掘金 (juejin.cn)](https://juejin.cn/post/6943213394694504461#heading-25)