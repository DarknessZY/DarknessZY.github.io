---
title: css滚动条，让滚动条看起来更好看
date: 2022-12-03 14:23
tags: [css样式]
categories: 前端随笔
---
# css滚动条
相关样式属性说明（详情查看图片，序号一一对应） 
1. ::-webkit-scrollbar 滚动条整体部分，可以设置 width, height, background, border 等
2. ::-webkit-scrollbar-button 滚动条两端的按钮，可以设置 display:none 让其不显示，也可以添加背景图片、颜色改变其显示效果 
3. ::-webkit-scrollbar-track 外层轨道，可以设置 display:none 让其不显示，也可以添加背景图片、颜色改变其显示效果 
4. ::-webkit-scrollbar-track-piece 内层滚动槽 
5. ::-webkit-scrollbar-thumb 滚动的滑块，也就是可以用鼠标点击拖动的部分 
6. ::-webkit-scrollbar-corner 边角 
7. ::-webkit-resizer 定义右下角拖动块的样式。

![159ada1eddb44a00c5f7003f9df9961f.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4ba6b948dc46aeb59dd77439b71ea9~tplv-k3u1fbpfcp-watermark.image?)
```
/* 改变element表格的滚动条样式 */
.el-table__body-wrapper::-webkit-scrollbar {
    width: 4px; /* 纵向滚动条的大小 */
    height: 10px; /* 横向滚动条的大小 */
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
}
.el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
}
```