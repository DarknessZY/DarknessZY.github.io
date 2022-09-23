---
title: 从零开始搭建博客(一)——本地搭建hexo框架
date: 2022-09-22 19:00
categories: 博客搭建
tag: [hexo框架,博客搭建] 
---

# 一、hexo框架

## 1.什么是 Hexo？

Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

## 2.安装前提

安装 Hexo 相当简单，只需要先安装下列应用程序即可：

- [Node.js](http://nodejs.org/) (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
- [Git](http://git-scm.com/)

如果您的电脑中已经安装上述必备程序，那么恭喜您！你可以直接前往 [安装 Hexo](https://hexo.io/zh-cn/docs/#安装-Hexo) 步骤。

如果您的电脑中尚未安装所需要的程序，请自行百度按指示完成安装。

## 3.安装 Hexo

### （1）本地安装 hexo

首先在本地新建一个空文件夹，用来存放 Hexo 的文件和以后要写的博客文件，注意不要有中文路径，避免可能出现的问题。取名 MyBlog。

使用VS code 打开该文件夹，右键打开终端

```
# 安装 hexo 框架
npm install -g hexo-cli
# 初始化文件夹
hexo init
# 安装 hexo 依赖包
npm install
```

命令很好理解，第一行安装 hexo 模块，`-g`表示安装全局模块；第二行是 hexo 初始化，会用 `git clone`命令去 GitHub 下载一个 hexo 默认模板代码库；第三行是安装依赖包，类似安装 pip 的 requirement 文件，会根据刚下载的代码库中的配置文件，下载并安装所需依赖包。

### （2）可能遇到的问题

- **`npm install -g hexo-cli`命令执行卡住，或者报错连接不上**

可能是 npm 源速度太慢，可以尝试修改淘宝源解决，再重新执行安装命令。npm 源的概念就和 Python 中的 pip 源一样，默认源是`https://registry.npmjs.org/`。

```
# 查看 npm 源
npm config get registry
# 临时修改 npm 源安装 hexo (仅本条命令有效)
npm --registry=https://registry.npm.taobao.org install -g hexo-cli
# 或者永久修改 npm 源
npm config set registry https://registry.npm.taobao.org
```

如果是公司内网使用代理访问外网 (比如`ping registry.npmjs.org` `ping registry.npm.taobao.org`都不通)，可以尝试给 npm 配置代理解决，再重新执行安装命令。

```
# 设置代理
npm config set proxy http://serverip:port
npm confit set https-proxy http:/serverip:port
# 设置带用户名密码的代理
npm config set proxy http://username:password@serverip:port
npm confit set https-proxy http://username:password@serverip:port
# 取消代理
npm config delete proxy
npm config delete https-proxy
```

- **`hexo init`命令执行卡住，或者报错连接不上**

同上设置代理

## 4.运行本地博客

前面三条命令执行成功，Hexo 框架在本地就已经搭建好了，下面看看效果。

在vs code 的终端中运行命令

```
# 生成静态网站
hexo g
# 启动服务器
hexo s
```

点击运行成功后的出来的地址

自此一个简单的本地博客诞生了

