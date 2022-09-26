---
title: 前端兼容性问题
date: 2022-09-26 18:46
categories: 前端兼容性问题
tag: [前端兼容] 
---

# 一、CSS样式兼容

## 1.border移动端兼容

box-shadow， border等不明原因被遮挡的问题；小于1px的边框在部分机型显示不全 或 完全渲染不出来的问题，这个是在工作中UI走查，查出来的，刚开始我还不知道为什么，还是经验太浅了，哈哈！

### 方案一 transform rotateZ(360deg)

此方法也能解决 box-shadow， border等不明原因被遮挡的问题

```
border: 0.5px solid #000;
border-radius: 0.5px;

// 解决ios边框显示一半的问题
transform: rotateZ(360deg);
```

### 方案二 和UI沟通，尽量避免使用0.5px的边，线（推荐）

0.5px的边线在移动端渲染还有一些未知的问题，建议尽量不要使用0.5px的边线

```
// iphone XS 把0.5px的dashed 虚线  渲染成了 border-bottom 0.5px dotted #C4C4C9
border-bottom: 0.5px dashed #C4C4C9;
```

