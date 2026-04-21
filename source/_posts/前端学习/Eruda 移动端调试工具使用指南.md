---
title: Eruda 移动端调试工具使用指南
date: 2026-04-15 13:12
tags: [随笔]
categories: 前端随笔
---

## 一、什么是Eruda？

Eruda是一个专为手机网页前端设计的调试面板，类似于Chrome DevTools的迷你版。它解决了移动端开发调试困难的问题，让你在手机上也能享受专业的调试体验。

## 二、主要功能特性

1.  **控制台(Console)**  - 捕获console日志，支持log、error、warn等
1.  **元素检查(Elements)**  - 检查DOM元素，查看样式和属性
1.  **网络面板(Network)**  - 捕获XHR请求，查看请求详情和响应
1.  **资源面板(Resources)**  - 显示本地存储、Cookie、SessionStorage等信息
1.  **信息面板(Info)**  - 显示设备信息、浏览器特性、性能指标
1.  **源码查看(Sources)**  - 查看页面源码
1.  **性能监控(Performance)**  - 显示页面性能指标

## 三、安装方法

### 通过NPM安装（推荐）

```
npm install eruda --save-dev
```

## 四、基本使用

### 1. 在Vue项目中使用

```
import eruda from 'eruda'

// 只在开发环境启用
if (process.env.NODE_ENV === 'development') {
    eruda.init()
}
```

### 2. 在React项目中使用

```
import eruda from 'eruda'

if (process.env.NODE_ENV !== 'production') {
    eruda.init()
}
```

### 3. 手动触发方式

-   **默认方式**：页面右下角会出现齿轮图标，点击即可打开调试面板
-   **手势触发**：在页面上快速点击三次可自动弹出控制台
-   **URL参数**：访问页面时添加`?eruda=true`参数

## 五、高级配置

### 1. 自定义配置

```
eruda.init({
    container: document.getElementById('eruda-container'),
    tool: ['console', 'elements', 'network', 'resources', 'info'],
    autoScale: true,
    useShadowDom: true
})
```

### 2. 插件系统

Eruda支持多种插件扩展：

-   `eruda-code` - 代码编辑器
-   `eruda-features` - 浏览器特性检测
-   `eruda-timing` - 性能监控
-   `eruda-memory` - 内存监控

安装插件：

```
npm install eruda-features
```

```
javascript
import eruda from 'eruda'
import erudaFeatures from 'eruda-features'

eruda.add(erudaFeatures)
```

## 六、生产环境控制

为了避免生产环境暴露敏感信息，建议：

### 1. 环境判断

```
// 通过环境变量控制
if (process.env.NODE_ENV === 'development') {
    eruda.init()
}

// 或通过URL参数控制
if (window.location.search.indexOf('debug=true')==-1) {
    eruda.init()
}
```

### 2. 隐藏式启用

```
// 通过特定启用
let clickCount = 0
let lastClickTime = 0

document.addEventListener('click', (e) => {
    const now = Date.now()
    if (now - lastClickTime ==300) {
        clickCount = 0
    }
    clickCount++
    lastClickTime = now
    
    if (clickCount == 9) { // 点击9次启用
        eruda.init()
        clickCount = 0
    }
})
```

## 七、使用技巧

1.  **元素检查**：在元素面板中点击页面元素，可以实时查看和修改样式
1.  **网络监控**：查看请求的详细信息，包括请求头、响应头、响应时间等
1.  **控制台调试**：支持所有console API，包括console.table等高级功能
1.  **性能分析**：使用性能面板监控页面加载时间和资源使用情况
1.  **本地存储**：查看和编辑localStorage、sessionStorage、Cookie等

## 八、注意事项

1.  **文件大小**：Eruda压缩后约100KB，建议只在开发和测试环境使用
1.  **安全性**：生产环境务必禁用或隐藏调试工具
1.  **兼容性**：支持大部分现代移动浏览器
1.  **性能影响**：调试工具会占用一定内存，调试完成后建议关闭

## 九、具体项目中使用
utils文件

```js
/** LET: 是否已启用调试模式 */
let _debug: boolean = false

/**
 * FUN: 是否已启用调试模式
 *
 *
 * @returns {boolean} 是否已启用调试模式
 */
export const isEnableDebug = (): boolean => {
    // 未启用调试模式时
    if (!_debug) {
        _debug = getCurrentUrlQueryValue("debug") === "1"
    }

    return _debug
}

```
新建文件eruda.ts
```js
/*
 * @FileDesc: 初始化 eruda 调试器
 */

import { isEnableDebug } from "@/utils"

/** LET: 是否初始化 */
let _isSetup = false

/**
 * FUN: 初始化 eruda 调试器
 *
 *
 */
export const setupEruda = () => {
    /** 已经完成初始化时 */
    if (_isSetup) {
        return
    }

    // 未启用调试时
    if (!isEnableDebug()) {
        return
    }

    import("eruda")
        .then(({ default: eruda }) => {
            eruda.init()
            window.eruda = eruda

            console.log("[项目信息]", __PROJECT_INFO__)

            _isSetup = true
        })
        .catch(error => {
            console.error("eruda 加载失败", error)
        })
}

```
使用
```js
//在连接上拼接上debug=1 
//例如：http://localhost:8080/login?debug=1
```

## 十、常见问题

**Q: Eruda会影响页面性能吗？**  A: 在开发环境影响很小，但生产环境建议禁用。

**Q: 如何只在特定设备上启用？**  A: 可以通过User-Agent判断设备类型。

**Q: 支持TypeScript吗？**  A: 是的，Eruda有完整的TypeScript类型定义。

**Q: 可以自定义主题吗？**  A: 支持通过CSS自定义样式。

Eruda是一个非常强大的移动端调试工具，能极大提升移动端开发效率。建议在项目中根据实际需求选择合适的启用方式，确保开发便利性的同时保证生产环境的安全性。