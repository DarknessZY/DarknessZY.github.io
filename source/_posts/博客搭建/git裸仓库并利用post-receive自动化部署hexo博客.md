---
title: git裸仓库并利用post-receive自动化部署hexo博客
date: 2023-06-01 09:12
categories: 博客搭建
tag: [博客搭建,git自动化部署] 
---

# 前言

> 因为最近想把自己的博客项目实现自动化部署，所以百度百科了这个相关的知识，然后总结，并记录笔记，总结并分享自己的操作！

## 1.git普通库

**什么是普通库**

就是使用`git init`命令创建git仓库，可以先看看其目录结构

```js

[root@VM-0-3-centos data]# git init simple
Initialized empty Git repository in /data/simple/.git/
[root@VM-0-3-centos data]# cd simple/
[root@VM-0-3-centos simple]# touch README.md
[root@VM-0-3-centos simple]# cd ..
[root@VM-0-3-centos data]# tree -a simple/
simple/
|-- .git
|   |-- branches
|   |-- config
|   |-- description
|   |-- HEAD
|   |-- hooks
|   |   |-- applypatch-msg.sample
|   |   |-- commit-msg.sample
|   |   |-- post-update.sample
|   |   |-- pre-applypatch.sample
|   |   |-- pre-commit.sample
|   |   |-- prepare-commit-msg.sample
|   |   |-- pre-push.sample
|   |   |-- pre-rebase.sample
|   |   `-- update.sample
|   |-- info
|   |   `-- exclude
|   |-- objects
|   |   |-- info
|   |   `-- pack
|   `-- refs
|       |-- heads
|       `-- tags
`-- README.md

10 directories, 14 files

```

通过上述命令操作后可以看到，`git init simple` 操作之后，创建了一个名为 simple 的库，simple 目录下还有一个` .git` 子目录，其中包含了git系统常用的文件，在` .git 目录`外是我们的工作区，可以存放我们库中待更新的文件，修改之后可以通过 `git add`，`git commi`t 等命令更新 .git 中的内容，简单来说普通库就是在工作目录 simple 中还包括一个 `.git 目录`

## git裸仓库

**什么是裸仓库**

就是使用git init --bare 命令创建git仓库，可以先看看其目录结构

```js
[root@VM-0-3-centos data]# git init --bare bare.git
Initialized empty Git repository in /data/bare.git/
[root@VM-0-3-centos data]# tree bare.git/ -a
bare.git/
|-- branches
|-- config
|-- description
|-- HEAD
|-- hooks
|   |-- applypatch-msg.sample
|   |-- commit-msg.sample
|   |-- post-update.sample
|   |-- pre-applypatch.sample
|   |-- pre-commit.sample
|   |-- prepare-commit-msg.sample
|   |-- pre-push.sample
|   |-- pre-rebase.sample
|   `-- update.sample
|-- info
|   `-- exclude
|-- objects
|   |-- info
|   `-- pack
`-- refs
    |-- heads
    `-- tags

9 directories, 13 files

```

目录结构来看裸仓库和普通库很像，甚至是一模一样，那么我们仿照普通库操作在这个目录下提交一个文件会怎样呢？

```js
[root@VM-0-3-centos data]# cd bare.git/
[root@VM-0-3-centos bare.git]# touch README.md
[root@VM-0-3-centos bare.git]# git add README.md
fatal: This operation must be run in a work tree
[root@VM-0-3-centos bare.git]# git status
fatal: This operation must be run in a work tree
[root@VM-0-3-centos bare.git]#

```

通过操作发现这个裸仓库`不允许增删改库内的文件`，甚至连 `git status` 这种命令都无法使用，统一提示了 `fatal: This operation must be run in a work tree` 这句话，告诉用户这些命令都必须在工作区内操作，既然不能修改，那么这个裸仓库就是“只读”的，那么它还有什么用呢？
虽然裸仓库不允许直接修改，但是可以`作为服务端远程仓库`，在本地克隆这个远程仓库之后再进行修改，这也是最常见的应用方式，总结来说，`普通库和裸仓库的区别就是：普通库拥有工作目录，并且工作目录中可以存放正常编辑和提交的文件，而裸库只存放这些文件的commit记录，不允许用户直接在上面进行各种git操作`。

## 3.为什么使用裸仓库而不使用普通库

普通库实际上包含两份数据的，一份在 .git 目录中以object形式存在，一份在工作目录中以源文件形式存在，我们每次使用 git 命令，可以保证工作目录内文件和 .git 目录数据是一致的，但是如果将普通库作为远端时，在下游提交数据时，远端库中的 .git 目录会直接更新，但是工作区却不知道此时谁在用，不能直接更新覆盖，这就造成了数据不一致的情况。

## 4.自动化部署

**post-receive**

post-receive是服务端钩子，`post-receive` 挂钩在整个过程完结以后运行，可以用来更新其他系统服务或者通知用户。 它接受与 `pre-receive` 相同的标准输入数据。 它的用途包括给某个邮件列表发信，通知持续集成（continous integration）的服务器， 或者更新问题追踪系统（ticket-tracking system） —— 甚至可以通过分析提交信息来决定某个问题（ticket）是否应该被开启，修改或者关闭。 该脚本无法终止推送进程，不过客户端在它结束运行之前将保持连接状态， 所以如果你想做其他操作需谨慎使用它，因为它将耗费你很长的一段时间。

**自动化部署原理**

利用 `post-receive` 进行自动化部署的原理就是，我们可以修改 `post-receive` 脚本，在修改提交后自动部署最新内容，实现自自动化部署。

## 5.具体操作

需求：服务端建立裸仓库，在接收到新的提交时，自动将项目部署到`/myPoject-Yao/distblog/DarknessZY.github.io` 目录下

**服务端远端操作**

*   建立裸仓库`/myPoject-Yao/repo/myBlog.git`,建立对应的部署目录`/myPoject-Yao/distblog`
*   新建 `/myPoject-Yao/repo/myBlog.git/hooks/post-receive`脚本,内容如下：

```js
#!/bin/sh
echo '======上传代码到服务器======'
unset GIT_DIR
DeployPath=/myPoject-Yao/distblog/DarknessZY.github.io
cd $DeployPath
git pull origin master
echo '======代码更新完成======'
```

**本地hexo项目操作**

*   关联服务器的远程裸仓库

```js
git remote add origin2 root@服务器公网地址:/myPoject-Yao/repo/myBlog.git
```

*   修改hexo博客根目录下的\_config.yml

```js
deploy:
- type: git
  repo: git@github.com:DarknessZY/DarknessZY.github.io.git
  branch: master
- type: git
  repo: root@服务器公网地址:/myPoject-Yao/repo/myBlog.git
  branch: master
```

## 6.注意

*   如果服务器不是直接用的root用户，而是新建了一个用户，记得给给用户高权限，用户名尽量不要起和其他命令冲突的语义化命名
*   建立的裸仓库和脚本文件也记得给高权限
*   如果不想输入密码，可把本地git生成的公钥id\_pub复制到服务器的/root/.ssh/authorized\_keys下

## 7.我的博客

*[耀耀切克闹](https://yaoyaoqiekenao.com/)*