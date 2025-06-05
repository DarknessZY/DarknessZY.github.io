---
title: css——笔记记录
date: 2025-05-20 13:30
tags: [面试题,随笔]
categories: 前端随笔
---

## 1.说说你对css盒模型的理解

css盒模型：浏览器在进行页面布局渲染时，将所有的元素表示为一个个矩形盒子，每一个盒子包含4个部分：content，padding，border，margin
其中我们一般写的width和height这两属性其实是content的几何属性。
标准盒模型和怪异盒模型（IE盒模型）

标准盒模型：width+padding+margin+border 这是一般的和模型计算宽度的方式

怪异盒模型：width（width+padding+border）+margin  IE浏览器在编写v8引擎的时候觉得宽度就应该包括了padding和border

可以通过box-sizing切换盒子模型：
- box-sizing:border-box;(要求浏览器以IE盒模型来加载容器)
- box-sizing:content-box;(要求浏览器以标准盒模型来加载容器)


## 2.css中的选择器有哪些？说说优先级

- id选择器
- 类名选择器
- 标签选择器
- 后代选择器
- 子元素选择器
- 相邻兄弟选择器
- 群组选择器
- 属性选择器
- 伪元素选择器
- 伪类选择器

优先级：!import>内联>id选择器>类名选择器>标签选择器

## 3.css中的长度单位有哪些？
- px：像素。1px等于屏幕上1个像素点的大小
- rem：相对长度单位，相对于根元素字体的大小
- em：相对长度单位，相对于父元素字体大小的长度单位
- vw：相当于视窗宽度百分比的长度单位，1vw等于视窗宽度的
- vh：相当于视窗高度百分比的长度单位，1vh
- %: 相对于父元素尺寸的百分比长度单位。若父元素宽度为100px，那么子元素宽度为100%等于100px

## 4.css中有哪些方式可以隐藏页面的元素？区别是什么？
- display：none; 脱离文档流，无法响应事件，回流重绘
- visibility：hidden; 占据文档流，无法响应事件，只重绘不回流
- opacity:0; 占据文档流，可以响应事件
- position: absolute;top:-9999px;left:-9999px;将元素移出页面的可见范围，使其看起来不可见。无法响应事件
- transform:scale(0); 将元素缩小为0，使其看起来不可见,设置pointer-events: none;后不会去响应事件。


## 5.谈谈你对BFC的理解
BFC指的是块级格式化上下文，是CSS中用于决定块级元素如何进行布局的一种规则。

在CSS中，元素要么遵循BFC规则，要么遵循IFC（Inline Formatting Context）规则，这两种规则是 mutually exclusive的，即一个元素不可能同时遵循这两种规则。

BFC的布局规则如下：
1. 遵照从上往下从左往右的布局排列
2. 浮动元素会参与BFC的布局
3. BFC容器内的子元素的margin-top不会和BFC这个父容器发生重叠
   
    

BFC的产生主要是为了解决在某些情况下，块级元素内部子元素的margin、padding等属性对父元素产生影响的问题。在BFC中，内部的Box会在垂直方向上根据margin的值进行排列。即使有浮动元素也是如此。

一个元素要成为BFC，需要满足以下条件之一：

1.  该元素是一个块级元素，如`<div>`、`<p>`等。
1.  该元素的`position`属性值为`relative`、`absolute`或`fixed`。
1.  该元素的`float`属性值不为`none`。
1.  该元素是一个表格单元格（`<td>`或`<th>`）或表格行（`<tr>`）并且`overflow`属性值不为`visible`。
1.  该元素是`block-level`表单元素（如`<input>`、`<textarea>`等），并且`overflow`属性值不为`visible`。


## 6.水平垂直居中的方式有哪些？
1.使用`position`属性配合`transform`进行居中

```js
position: absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
```
2.使用弹性布局

```js
display: flex;
justify-content: center;
align-items: center;
```
3.使用grid布局

```js
display: grid;
justify-items:center;
align-items:center;
height:100%;
```
## 7.css3新增了哪些属性？
- 选择器：属性选择器。伪元素伪类
- box-shadow
- 背景裁剪：background-clip
- transition 过渡动画
- transform 旋转，平移，缩放，倾斜等
- animatuin 纯动画
- 渐变色

## 8.css、sass、less

CSS（层叠样式表）、Sass 和 Less 都是用于定义网页样式的工具，但它们在语法和功能上有一些区别。下面是它们的主要区别：

###  CSS

CSS 是最基本的样式定义语言，用于描述 HTML 或 XML（包括如 SVG、XUL 这类 XML 分支语言）文档的外观和格式。CSS 的语法简单明了，由选择器（selector）和声明块（declaration block）组成。

#### 示例：
```css
body {
  background-color: lightblue;
}

h1 {
  color: navy;
  margin-left: 20px;
}
```

###  Sass

Sass（Syntactically Awesome Stylesheets）是一种 CSS 预处理器，它扩展了 CSS 的语法，提供了许多有用的功能，如变量、嵌套规则、混合（mixins）、继承等。Sass 有两种语法：缩进式的 `.sass` 语法和括号式的 `.scss` 语法。

#### 示例（.scss 语法）：
```scss
$primary-color: navy;

body {
  background-color: lightblue;
}

h1 {
  color: $primary-color;
  margin-left: 20px;
}
```

#### 示例（.sass 语法）：
```sass
$primary-color: navy

body
  background-color: lightblue

h1
  color: $primary-color
  margin-left: 20px
```

###  Less

Less 也是一种 CSS 预处理器，它与 Sass 类似，提供了变量、嵌套规则、混合（mixins）、运算等特性。Less 的语法更接近于 CSS，因此对于熟悉 CSS 的开发者来说，Less 的学习曲线相对较低。

#### 示例：
```less
@primary-color: navy;

body {
  background-color: lightblue;
}

h1 {
  color: @primary-color;
  margin-left: 20px;
}
```

### 主要区别

1. **语法**：
   - CSS 是原生语言，没有预处理器特性。
   - Sass 有两种语法：缩进式的 `.sass` 和括号式的 `.scss`。
   - Less 的语法与 CSS 非常相似，但增加了预处理器特性。

2. **功能**：
   - CSS 本身不支持变量、嵌套规则、混合等高级功能。
   - Sass 和 Less 都扩展了 CSS，提供了变量、嵌套规则、混合、继承、运算等高级功能。

3. **使用场景**：
   - 对于简单的项目或不需要高级功能的场景，直接使用 CSS 即可。
   - 对于复杂的项目或需要更高效、更可维护的样式代码，Sass 和 Less 都是很好的选择。

# 11.重排（回流）和重绘
#### 重排（回流）
重排是指浏览器重新计算页面元素的位置和尺寸，并进行布局的过程。当以下情况发生时，会触发重排：

1.  添加或删除可见的 DOM 元素。
2.  元素尺寸改变（宽度、高度等）。
3.  内容变化，如文本变化。
4.  浏览器窗口尺寸变化。
5.  计算或获取某些属性，如 `offsetWidth`、`scrollHeight` 等。

重排是一个相对昂贵的操作，因为它涉及到整个页面或部分页面的布局更新。为了减少重排的次数，可以尽量批量修改样式，或者使用 `documentFragment`、`requestAnimationFrame` 等技术。

### 重绘（Repaint）

重绘是指浏览器将元素的外观更新到屏幕上的过程。当以下情况发生时，会触发重绘：

1.  样式变化，但不影响布局，如颜色、背景色、边框等。
2.  元素可见性变化，如 `visibility`、`opacity` 等。

重绘的成本低于重排，因为它只需要将新的样式应用到已有的元素上，而不需要重新计算布局。

# 10.居中为什么要使用transform（为什么不使用marginLeft/Top）
transform 属于合成属性（composite property），对合成属性进行 transition/animation 动画将会创建一个合成层（composite layer），这使得被动画元素在一个独立的层中进行动画。通常情况下，浏览器会将一个层的内容先绘制进一个位图中，然后再作为纹理（texture）上传到 GPU，只要该层的内容不发生改变，就没必要进行重绘（repaint），浏览器会通过重新复合（recomposite）来形成一个新的帧。

top/left属于布局属性，该属性的变化会导致重排（reflow/relayout），所谓重排即指对这些节点以及受这些节点影响的其它节点，进行CSS计算->布局->重绘过程，浏览器需要为整个层进行重绘并重新上传到 GPU，造成了极大的性能开销。

# 11.CSS3中transition和animation的属性分别有哪些
 **transition 过渡动画：** 
- (1) transition-property：属性名称 
- (2) transition-duration: 间隔时间 
- (3) transition-timing-function: 动画曲线 
- (4) transition-delay: 延迟 

 **animation 关键帧动画：**
- (1) animation-name：动画名称
- (2) animation-duration: 间隔时间 
- (3) animation-timing-function: 动画曲线 
- (4) animation-delay: 延迟 
- (5) animation-iteration-count：动画次数 
- (6) animation-direction: 方向 
- (7) animation-fill-mode: 禁止模式