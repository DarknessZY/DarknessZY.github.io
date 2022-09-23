---
title: 从零开始搭建博客(二)——hexo主题搭建
date: 2022-09-22 20:00
categories: 博客搭建
tag: [hexo框架,博客搭建] 
---

# 一、更换 Hexo 博客主题

## 1. 如何找主题

默认主题非常简洁，适合大佬使用，像我等菜鸟，自己不会做却又想使用花里胡哨的主题，就要学会找主题了。

下面是我寻找主题的三个方法。

- **官方网站**

  Hexo 官网收录了几百个第三方主题，其中有许多中文开发者开发的主题。

  在 Hexo 官网点击“主题”，或者直接进入 Hexo 主题页：[themes](https://hexo.io/themes/)

  通过上方的搜索框可以根据标签搜索。

## 2.github开源Hexo 博客主题

大多数流行的主题都在 GitHub 托管开源了，我们可以直接去 GitHub 下载。

在 Github 官网搜索`hexo-theme`，选择`All GitHub`，或者直接进入搜索页：[search?q=hexo-theme](https://github.com/search?q=hexo-theme)

市面上使用比较多的主题：

- **Next**

Demo 示例：[NexT](https://theme-next.js.org/) | [Dandy](https://dandyxu.me/) | [Raincal](https://raincal.com/)

GitHub 主页：[hexo-theme-next](https://github.com/iissnan/hexo-theme-next)

这个是 Hexo 最流行的主题，GitHub 上 15.5k stars，在 Hexo 主题中排行第一。

- **matery**

Demo 示例：[闪烁之狐](http://blinkfox.com/)

GitHub 主页：[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)

- **butterfly**

Demo 示例： [Butterfly](https://butterfly.js.org/) | [JerryC](https://jerryc.me/)

GitHub 主页：[hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly)



本菜鸟使用的主题就是以简约为主：

- **ayer**

Demo 示例：[岛](https://shen-yu.gitee.io/)

GitHub 主页：[hexo-theme-ayer](https://github.com/blinkfox/hexo-theme-matery)

## 3.更换主题

以 **ayer** 主题为例。

在 vs code中 Mylog根目录下，右键，执行下面命令：

```
npm i hexo-theme-ayer -S
#如果hexo < 5.0
# 国内用户如果速度较慢，可以把github地址替换为：https://gitee.com/mirrors/ayer.git
git clone https://github.com/Shen-Yu/hexo-theme-ayer.git themes/ayer
```

我在使用 **ayer** 找到了这样一位大佬，后面的操作就是跟着这位大佬的搭建博客进行的了：[杰克小麻雀](https://blog.csdn.net/yushuaigee?type=blog )

该博主的文章对我后面的搭建有巨大帮助，各位过去看看吧！后面估计很多内容可能会照着大佬来，如有雷同，纯属抄袭（手动狗头）

# 二.本地写博客

**利用Markdown语法的软件写博客，本地试运行：**

这里推荐使用Typora或uTools的Markdown笔记功能，具体怎么使用这两款软件，官方都有说明。

把写好的文章复制到



![](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20220922184421310.png)



![](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20220922184517354.png)
