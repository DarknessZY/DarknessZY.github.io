---
title: Husky+eslint+ prettier规范代码
date: 2023-05-25 18:12
tags: [git，Husky]
categories: 前端随笔
---

## 1.Git Hooks

   **什么是Git Hooks**

   Git Hooks 在Git执行特定事件（如commit、push、receive等）后触发运行脚本,类似于vue的生命周期钩子，git在某些特定事件发生前或后也会有某些执行特定功能的钩子。`githooks 保存在 .git 文件夹中`

   对于`规范代码提交`我们主要用到的Git Hooks里的这两个钩子，也就是是在git commit执行前对git commit的提交信息做出规范。
    
- pre-commit 预提交钩子  触发时机：`git commit执行前，可以进行遍历、检测亦或是其他操作暂存区代码`  因此我们可以利用该钩子配合[lint-staged](https://github.com/okonet/lint-staged)完成对代码风格的规范
- commit-msg 预提交时提交消息的钩子  触发时机：`同样是git commit执行前，可检查提交消息`  因此我们可以在这个钩子执行时配合[commitlint](https://commitlint.js.org/#/)完成规范代码提交消息

## 2.Husky
**什么是Husky**

就是让原生 git 钩子变得简单好操作的依赖包而已，您可以使用它来**检查提交消息**，**运行测试**，**lint代码**等...当您提交或推送时。**Husky**支持[所有 Git 钩子](https://git-scm.com/docs/githooks)。

**Husky的使用**
-   首先执行安装命令 `npm install husky --save-dev`

-   然后再在项目根目录下package.json 文件的scripts配置项 添加一行代码

```js
"scripts": {
    "prepare": "husky install"
}
```

## 3.eslint+prettier
**eslint**
- 执行命令 `yarn add eslint -D`
- 如果希望ESLint支持TypeScript 执行命令`yarn add typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev`

**prettier**
- 执行命令 `yarn add prettier -D`

**结合ESLint与prettier**

单独使用ESLint需要在其配置文件中额外配置很多规则，而这些规则又大多为prettier的默认规则或者我们已经在prettier配了一份，这样难免出冲突，但插件的作者已经想到了这一点，出了一个名为`eslint-plugin-prettier`的插件。
- 执行命令 `yarn add eslint-plugin-prettier -D`
- ESLint与prettier相关文件配置看个人习惯和公司项目需求配就行了
## 4.lint-staged
**什么是lint-staged**

int-staged 是一个在git暂存区上运行linters的工具

**lint-staged的使用**
-  执行安装命令 `npm install lint-staged --save-dev` 
-  然后再在项目根目录下package.json 文件的添加上相关配置并配合eslint+prettier+pre-commit可以对暂存区代码进行检测和操作

```js
 "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.vue": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{scss,less,styl,html}": [
      "prettier --write"
    ]
  }
```
## 5.commitlint
**什么是commitlint**

就是对你 git commit提交的消息做一个校验的插件，主要还是配合Git Hooks的钩commit-msg一起使用的。

**commitlint的使用**
- 执行命令安装相关依赖 `yarn add @commitlint/cli @commitlint/config-conventional -D`
- 在根目录下新建commitlint.config.js 用来配置commitlint

```js
module.exports = {
  extends: [
    "@commitlint/config-conventional"
  ],
  // 以下时我们自定义的规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'feat', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        'merge' // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
      ]
    ]
  }
};
```
**注意**

如果是用命令建的commitlint.config.js文件，`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`,在vs code中看看它的格式是否正确,如果不是UTF-8需要

改一下格式，我就是因为这个原因卡了半天
![1684205419515.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14869db5337a4f329f83244c4c8ac708~tplv-k3u1fbpfcp-watermark.image?)

## 实现
前面把需要的依赖包和配置文件整好了（package.json里的不要忘了整），接下来就是利用脚本实现

**注意**

![企业微信截图_16841411722462.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5ab36c23a214a5cacb1d486a046ea43~tplv-k3u1fbpfcp-watermark.image?)
所以下面是放在.husk文件夹下利用脚本实现：

-  因为之前一安装好husky并在package.json配置了，直接执行`yarn husky add .husky/pre-commit 'npx --no-install lint-staged "$1"'`之后，会看到在根目录的`.husky`文件夹下多了一个 `pre-commit` 文件，其内容如下：

```js
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install lint-staged "$1"
```
可以看到之前安装并配置的lint-staged在这个钩子中就开始发挥作用了，在提交前利用lint-staged把不规范大代码格式化

- 执行`yarn husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`之后，会看到在根目录的`.husky`文件夹下多了一个 `commit-msg` 文件，其内容如下：

```js
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx --no-install commitlint --edit "$1"
```
可以看到之前安装并配置的commitlint在这个钩子中就开始发挥作用了，开始检测你的提交消息了

## 测试效果
不规范提交

![1684206668224.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6af8c321a8a64b61adab28439b65eed4~tplv-k3u1fbpfcp-watermark.image?)