---
title: 从零开始搭建博客(二)——hexo主题搭建
date: 2022-09-22 20:00
categories: 博客搭建
tag: [hexo框架,博客搭建] 
---

<!-- <meta name="referrer" content="no-referrer" /> -->


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

本菜鸟使用的主题就是以简约为主：

- **ayer**

Demo 示例：[岛](https://shen-yu.gitee.io/)

GitHub 主页：[hexo-theme-ayer](https://github.com/Shen-Yu/hexo-theme-ayer)

## 3.更换主题

以 **ayer** 主题为例。

在 vs code中根目录下，右键新建终端，执行下面命令：

```
npm i hexo-theme-ayer -S
#如果hexo < 5.0
# 国内用户如果速度较慢，可以把github地址替换为：https://gitee.com/mirrors/ayer.git
git clone https://github.com/Shen-Yu/hexo-theme-ayer.git themes/ayer
```
此时打开博客根目录下的 themes 文件夹可以看到多了个 ayer 文件夹。


![1673503194683.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14089c4ea9a040c9b675ad91230683c8~tplv-k3u1fbpfcp-watermark.image?)

然后用记事本打开博客根目录下的 _config.yml (`D:\MyBlog_config.yml`)，找到`theme`标签，默认值是`landscape`主题，把它改为要更换的主题名字`ayer`，然后执行启动命令。

```js
# 清理 && 生成 && 启动
hexo clean && hexo g && hexo s
```

![1673503295276.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b169bc466154832b63b76d2170de1b6~tplv-k3u1fbpfcp-watermark.image?)

这1时再到浏览器打开网址`http://localhost:3000`，可以看到我们的博客已经换上一款非常精美的主题。

# 二.本地写博客

**利用Markdown语法的软件写博客，本地试运行：**

这里推荐使用Typora或uTools的Markdown笔记功能，具体怎么使用这两款软件， 就和掘金写文章差不多，官方都有说明。其中Typora现在开始收费了，但可以去下载老版本，老版本是免费的，具体操作可以按：

[Typora免费版](http://www.itmind.net/16468.html )

根据这个网址上面来操作，下载老版本的Typora，但具体还能用多久就不知道了，有钱的小伙伴可以直接去官网下载正版，本人老穷b了。

![5CBFAEB737CB3B14DDC82E5F0B6A357B.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a1d6ef57b314c3dae17ac224cc8b66d~tplv-k3u1fbpfcp-watermark.image?)

把写好的文章复制到根目录下的source=>_posts

![1673503721548.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2782defc88e84650bb394e8ff971f37d~tplv-k3u1fbpfcp-watermark.image?)
然后执行命令：

```js
hexo clean && hexo g && hexo s
```
本地看时就发现文章已经有了:

![1673503821935.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03993c78db734feba5d08a0baf347424~tplv-k3u1fbpfcp-watermark.image?)