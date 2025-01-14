---
title: 漏洞扫描——react项目源代码泄漏
date: 2025-01-13 14:23
tags: [漏扫]
categories: 前端随笔
---



> 安全部门对我们前端项目进行漏洞扫描发现，前端有一个React项目生产环境源代码泄漏，解决过程的记录

## 1、React项目源代码泄漏

安全部门给我们的描述是：公网系统源代码泄露 。漏洞详情：没有正确配置，导致项目源码泄露

定位到问题：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/bf3bb246b63f4a648607ce93439fb1f7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ICA6ICA5YiH5YWL6Ze554Gs:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTc4MTY4MTExNjY3OTg1NCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737426451&x-orig-sign=HXnDC5%2BHDBizhyUHdlOfkRXDtz8%3D)

## 2、为什么出现了项目源码泄漏

这是因为source-map,源映射的原因：

在前端开发中，源映射（Source Maps）是一种将压缩或编译后的代码映射回源代码的技术。这使得开发者可以在调试时查看原始的、未压缩的代码，而非难以阅读的生产环境代码。

在许多构建工具和框架中（例如 Create React App），process.env.GENERATE\_SOURCEMAP 是一个环境变量，用于控制是否生成源映射文件。当你将 process.env.GENERATE\_SOURCEMAP 设置为 'false' 时，构建工具将不会生成对应的源映射文件。

如果源映射文件存在，用户或恶意攻击者可以使用它们轻松地调试和查看原始源代码。这可能会导致源代码的某些私有逻辑和实现细节暴露，从而带来潜在的安全风险。

## 3、解决方式

React项目在需要将环境变量GENERATE\_SOURCEMAP设置为false

```js
process.env.GENERATE_SOURCEMAP = 'false';
```

然后编译打包上传服务器，可以看到已经解决了源代码泄漏的问题
![企业微信截图\_17364046515706.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/63563ec79ed94125893ca70c009055c8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ICA6ICA5YiH5YWL6Ze554Gs:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTc4MTY4MTExNjY3OTg1NCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737426451&x-orig-sign=IcLl6SaipPE0QrJ3J9CE5Cy7VBU%3D)

### 设置为 false 的影响

*   **不生成源映射**：当设置 process.env.GENERATE\_SOURCEMAP 为 'false'，构建过程将禁用源映射的生成。这意味着在生产环境中用户无法访问源映射文件，阻止了他们查看源代码。
*   **代码可读性**：虽然在调试过程中，没有源映射可能使得错误更难追踪，但在生产环境中保护源代码是更为重要的。
*   **提高安全性**：通过不生成源映射，减小了源代码被分析和利用的风险。

当设置 process.env.GENERATE\_SOURCEMAP 为 'false' 时，你可以减轻源代码泄漏的风险，因为用户无法获得源映射文件，从而无法轻松地查看原始代码。
