---
title: 从零开始搭建博客(五)——使用valine评论系统
date: 2022-10-11 20:00
categories: 博客搭建
tag: [valine,博客搭建] 
---

# 一、hexo框架的主题使用valine

## **1. 注册 Leancloud 账号**

在leancloud官网注册一个账号，海外同学推荐使用leancloud国际版，国内同学可以使用华东或华北节点。

# 2.创建应用获取appid和appkey

注册完成后进入控制台->创建应用->创建开发版应用。创建完开发版应用如下：点击最右边小齿轮也就是设置，找到`应用凭证`，获取appid和appkey


![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88cbb84d544c466fa8b242d80c6e0670~tplv-k3u1fbpfcp-zoom-1.image)

## 3.配置valine

最后去自己主题下的_config.yml文件下(注意不是根目录下的，是你克隆的主题的_config.yml)，配置一下valine，目前hexo官网给的许多主题都是可以用valine的，直接配置就行

以ayer主题为例，具体配置含义如下：

```
# 启用Valine必须先创建leancloud应用， 获取 id|key 填入即可
leancloud:
  enable: true
  app_id:# 将应用key的App ID设置在这里
  appkey: # 将应用key的App Key设置在这里
valine:
  enable: true #是否启用valine
  notify: false# 邮箱通知 , https://github.com/xCss/Valine/wiki，默认为false
  verify: false# 验证码 默认为false
  placeholder: Just go go ^_^ # 初始化评论显示，根据自己修改，这里默认，
  avatar: monsterid # 头像风格，默认为mm，可进入网址：https://valine.js.org/visitor.html查看头像设置，这里有许多头像风格，进行设置
  guest_info: nick,mail,link # 自定义评论标题
  pageSize: 10 # 分页大小，10页就自动分页
  visitor: true # 是否允许游客评论 ，进入官网查看设置：https://valine.js.org/visitor.html
```

# 二、valine评论数据管理

去LeanCloud的控制台找到数据存储=>结构化数据=>Comment,在这里你可以对评论的数据进行管理

![1673512632892.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f28620488c6540d6b80756e2ac125719~tplv-k3u1fbpfcp-watermark.image?)