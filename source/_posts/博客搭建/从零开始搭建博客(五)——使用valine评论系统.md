---
title: 从零开始搭建博客(五)——使用valine评论系统
date: 2022-09-10 20:00
categories: 博客搭建
tag: [valine,博客搭建] 
---

# 一、hexo框架的主题使用valine

## **1. 注册 Leancloud 账号**

在leancloud官网注册一个账号，海外同学推荐使用leancloud国际版，国内同学可以使用华东或华北节点。

![image-20221010145137300](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20221010145137300.png)



# 2.创建应用获取appid和appkey

注册完成后进入控制台->创建应用->创建开发版应用。创建完开发版应用如下：点击最右边小齿轮也就是设置，找到`应用凭证`，获取appid和appkey

![image-20221010145306850](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20221010145306850.png)

![img](https://i.loli.net/2019/06/21/5d0c997a60baa24436.jpg)

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

![image-20221011155013366](https://cdn.jsdelivr.net/gh/DarknessZY/myblog@master/img/image-20221011155013366.png)