---
title: cookie、localStorage、sessionStorage
date: 2022-12-14 13:30
tags: [面试题,随笔]
categories: 前端随笔
---

# 一、三者的异同

| 特性      | Cookie                                       | localStorage                        | sessionStorage                      |
| ------- | -------------------------------------------- | ----------------------------------- | ----------------------------------- |
| 数据的生命期  | 一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效 | 除非被清除，否则永久保存                        | 仅在当前会话下有效，关闭页面或浏览器后被清除              |
| 存放数据大小  | 4K左右                                         | 一般为5MB                              | 一般为5MB                              |
| 与服务器端通信 | 每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题        | 仅在客户端（即浏览器）中保存，不参与和服务器的通信           | 仅在客户端（即浏览器）中保存，不参与和服务器的通信           |
| 易用性     | 需要程序员自己封装，源生的Cookie接口不友好                     | 源生接口可以接受，亦可再次封装来对Object和Array有更好的支持 | 源生接口可以接受，亦可再次封装来对Object和Array有更好的支持 |

# 二、localStorage和sessionStorage操作

#### setItem存储value

用途：将value存储到key字段

```
sessionStorage.setItem("key", "value");     localStorage.setItem("site", "js8.in");
```

#### getItem获取value

用途：获取指定key本地存储的值

```
var value = sessionStorage.getItem("key");     var site = localStorage.getItem("site");
```

#### removeItem删除key

用途：删除指定key本地存储的值

```
sessionStorage.removeItem("key");     localStorage.removeItem("site");
```

#### clear清除所有的key/value

用途：清除所有的key/value

```
sessionStorage.clear();     localStorage.clear();
```