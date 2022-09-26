---
title: npm随笔
date: 2022-09-26 13:12
tags: [npm，随笔]
categories: 前端随笔
---

# 一、npm 安装中的 i、-g、--save、--save-dev、-D、-S的区别

## 基本说明：

- **`i`** 是 **`install`** 的简写
- **`-g`** 是全局安装，不带 **`-g`** 会安装在个人文件夹
- **`-S`** 是 **`--save`** 的简写，安装包信息会写入 **`dependencies`** 中
- **`-D`** 是 **`--save-dev`** 的简写，安装包写入 **`devDependencies`** 中

## dependencies 与 devDependencies：

- **`dependencies`** 生产阶段的依赖,也就是项目运行时的依赖

- **`devDependencies`** 开发阶段的依赖，就是我们在开发过程中需要的依赖，只在开发阶段起作用的

  例如：你写 ES6 代码，需要 babel 转换成 es5 ，转换完成后，我们只需要转换后的代码，上线的时候，直接把转换后的代码部署到生产环境，不需要 bebal 了，生产环境不需要。这就可以安装到 devDependencies ，再比如说代码提示工具，也可以安装到 devDependencies，如果你用了 `Element-UI`，由于发布到生产后还是依赖 `Element-UI`，这就可以安装到 **`dependencies`**