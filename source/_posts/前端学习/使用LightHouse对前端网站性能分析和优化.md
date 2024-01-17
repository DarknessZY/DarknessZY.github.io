---
title: 使用LightHouse对前端网站性能分析和优化
date: 2024-01-17 17:33
tags: [面试,随笔]
categories: 前端性能优化
---

## LightHouse

> 网站性能检测有很多，最近学习使用了LightHouse，LightHouse 是 Google 开发的，它提供了一个基于浏览器服务的网站性能分析工具。LightHouse 使用了深度学习技术和大规模语言模型来预测代码中的性能瓶颈，并给出详细的分析报告。


以微软的Edge为例，打开控制台，点击右边的+，就能找到LightHouse，然后对你想要进行分析的网站进行
![性能分析.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48bea8ef1d864453bd7a6b8fb520b50d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1872&h=672&s=42015&e=png&b=fefefe)


## Lighthouse 主要监测指标

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fabf30d7b62449d902360c92e0cac98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526&h=372&s=43703&e=png&b=fefcfc)
| 指标                             | 说明                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| 性能指标（Performance）          | 页面的性能评分，包括：首次内容绘制（First Contentful Paint）、（Largest Contentful Paint）最大内容绘制、可交互时间（Time to Interactive）、速度指标（Speed Index）、（Cumulative Layout Shift）累计布局位移。 |
| 可访问性/无障碍（Accessibility） | 监测页面的可访问性与优化建议。                               |
| 最佳做法（Best Practice）        | 页面是否符合最佳实践。                                       |
| 搜索引擎优化（SEO）              | 页面是否针对搜索引擎结果排名进行了优化。                     |
| PWA（Progressive Web App） | 验证 PWA 的各个方面的性能情况。            


## 性能指标

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f607f8597f64f72a977a62a92e5252d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=473&h=384&s=20484&e=png&b=fffdfd)
我们利用LightHouse做前端网站性能分析主要关注的就是Performance这一块，上面提到Performance页面的性能评分指标分为：**FCP (First Contentful Paint)、LCP(Largest Contentful Paint)、SI (Speed Index)、TBT(Total Blocking Time)、CLS(Cumulative Layout Shift)**，下面将具体的了解这几个东西


### 1.FCP
**FCP**（First Contentful Paint）即**首次内容绘制**。它统计的是**从进入页面到首次有 DOM 内容绘制所用的时间**。这里的 DOM 内容指的是文本、图片、非空的 `canvas` 或者 SVG。

**FCP** 和我们常说的白屏问题相关，它记录了页面首次绘制内容的时间。

下图可以看到为什么导致FCP慢，以及是什么导致FCP慢甚至点击蓝色的链接跳转相关如何解决这块的问题，能帮助我们快速定位到什么原因导致白屏的，已经响应的解决方案，红色的代表影响比较大，橙色是中等。

可以看到下面三条橙色的就是我们老生常谈的首屏优化，不过和红色一样，我们可以看到具体是哪里需要优化：
- 缩减 JavaScript
- 启用文本压缩
- 减少未使用的 CSS
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27a836b543e543439346177625d7669a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1701&h=818&s=76802&e=png&b=ffffff)


### 2.LCP
**LCP**（Largest Contentful Paint）即**最大内容绘制**。它统计的是**从页面开始加载到视窗内最大内容绘制的所需时间**，这里的内容指文本、图片、视频、非空的 canvas 或者 SVG 等。

*注意：FCP关注的是页面上任何内容的首次呈现时间，而LCP关注的是最大的内容元素的呈现时间。*

例如：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aba4b89d42c4ba491f38df2eff17019~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1392&h=768&s=84673&e=png&b=ffffff)

这个图片太大了，完全呈现给用户需要1710毫秒，最大的内容渲染时间有点长了，所以我们就可以考虑优化这个块，压缩这个图片之类的。


### 3.SI
**SI**（Speed Index）即**速度指数**。Lighthouse 会在页面加载过程中捕获视频，并通过 [speedline](https://link.zhihu.com/?target=https%3A//github.com/paulirish/speedline) 计算帧与帧之间视觉变化的进度，这个指标反映了**网页内容填充的速度**。页面解析渲染过程中，资源的加载和主线程执行的任务会影响到速度指数的结果。 

### 4.TBT
**TBT**（Total Blocking Time）是指在页面加载过程中，**用户输入或交互受到阻塞的总时间**。它衡量了在加载过程中由于JavaScript执行和主线程忙碌而导致用户输入延迟的总时间。 TBT 是 Web 性能指标之一，用于评估页面加载过程中的交互性能。
这个一般是由js引起，如下图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a013889d55ee481ea5e7aafb3f4108e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1781&h=665&s=70550&e=png&b=fefefe)

TBT 的延迟通常由 JavaScript 的执行和主线程忙碌引起。当页面加载过程中存在大量的 JavaScript 代码执行或者主线程被长时间占用时，会导致用户输入或交互受到阻塞，从而增加 TBT。因此，优化 JavaScript 的加载和执行，以及减少主线程的繁忙程度，可以有助于减少 TBT。
根据上面提示，我们可以优化JavaScript 资源加载

资源加载的优化通常有几个思路：

-   合理的加载顺序/策略（延迟加载/预先加载）
-   压缩优化资源的体积
-   代码分割 & 公共提取 & 按需加载
### 5.CLS
**CLS**（Cumulative Layout Shift）即**累计布局位移**进行评估。这个指标是通过比较单个元素在帧与帧之间的位置偏移来计算

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ddff6cd7b5e4fe8a7401d970c470203~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1847&h=664&s=85729&e=png&b=fefefe)
看的出来，使用LightHouse后很快可以定位到需要优化哪里

## 无障碍设计
Accessibility 辅助功能 : 无障碍设计，也称为网站可达性。是指所创建的网站对所有用户都可用/可访问，不管用户的生理/身体能力如何、不管用户是以何种方式访问网站。

比如：

> Background and foreground colors do not have a sufficient contrast ratio. 这个意思就是某处文字背景色和文字颜色对比度不够，对于视障用户可能不好区分,展开可以看到具体是哪块元素。

## 最佳做法
est Practices 最佳做法 : 实践性检测，如网页安全性，如是否开启 HTTPS、网页存在的漏洞等

## SEO

SEO（Search Engine Optimization）：搜索引擎优化检测，如网页 title 是否符合搜索引擎的优化标准等


## 总结

>总之使用LightHouse对前端网站性能分析后，能帮助我们开发者定位到哪里需要优化，哪个图片太大影响正常资源加载等等，对应开发者来说是个不错的工具，当然也不一定非要按照上面提示的优化，开发者也肯定有自己的考量。我自己的网站性能指标在80左右就行了，懒得继续折腾了（手动狗头）。如果是公司的项目，能跑就行，哈哈！

## 八股总结
谈到性能优化，跑不掉的就是八股文，也总结一下。
1. 使用lazy loading：通过将大量数据分成几块，用户只有点击触发某个特定的元素时，才会加载这部分数据。这样可以减少初始化数据时的性能开销。
2. 使用虚拟scrolllist：通过将大量数据分成小块，并将其渲染为虚拟的滚动列表。这样可以减少渲染开销，提高用户体验。
3. 使用图片懒加载：通过使用JavaScript或者在HTML属性中设置`onload`事件，当图片加载完成时再显示，这样可以减少初始化时的性能开销。
4. 使用预加载：通过在页面加载时预先加载一些数据和资源，当用户访问时可以更快地渲染。
5. 使用现代前端框架：使用现代前端框架可以简化代码，提高性能，例如React、Vue、Angular等。
6. 优化列表和数组操作：使用现代前端框架提供的列表和数组操作方法，可以减少代码量，提高性能。
7. 使用Gzip压缩：通过在服务器端使用Gzip压缩静态资源，可以减少网络传输时的时间开销。
8. 使用CDN：通过将静态资源部署到CDN服务器上，可以提高用户体验，减少网络传输时的时间开销。
9. 优化DOM操作：在使用JavaScript操作DOM时，尽量减少操作的次数和复杂度，以提高性能。
10. 使用事件代理：将事件监听器添加到父元素上，可以减少事件监听器的数量，提高性能。

## 个人博客
[耀耀切克闹 (yaoyaoqiekenao.com)](https://yaoyaoqiekenao.com/)

## 参考文章

[前端性能测试工具 Lighthouse(灯塔)使用 - 掘金 (juejin.cn)](https://juejin.cn/post/7220230543005253691#heading-36)

[使用 Lighthouse 分析前端性能 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/376925215)