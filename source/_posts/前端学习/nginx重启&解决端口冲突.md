---
title: nginx重启&解决端口冲突
date: 2024-11-29 19:53
tags: [随笔]
categories: 前端随笔
---

前言

> 测试环境突然不能访问了，经排查最开始发现是nignx没进程了，于是我觉得重启下nignx就行了。重启后发现还是不行，看nginx重启的端口中9090有好多使用的，感觉是端口冲突，处理了端口冲突后，测试环境可以使用了。记录一下本次处理

1.查看nginx进程
ps -ef | grep nignx
![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ea047eef21d446699db635c77614f636~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ICA6ICA5YiH5YWL6Ze554Gs:q75.awebp?rk3s=f64ab15b&x-expires=1736841686&x-signature=Z0Yj%2FfnyTMTukT%2B6IyJ2ceBnlzE%3D)

2.如果没有nginx进程，就需要重启nginx服务,进入nginx所在目录，去重启ginx服务

cd /opt/nginx/

sudo service nginx restart

3.重启后发现还是不行，查看是否是端口冲突了

![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/04e86eaf09524063ab275f0b04f4e029~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ICA6ICA5YiH5YWL6Ze554Gs:q75.awebp?rk3s=f64ab15b&x-expires=1736841686&x-signature=%2F8PrgmUxCQGhpwh8fjkWNDcWrc8%3D)
4.确实是端口冲突了，找到端口冲突逻辑，删除冲突端口对应的pid

sudo lsof -i：9090

发现是primetheu进程导致的，其pid为7252
![image.png](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/e39b21196de84367afbfe8c529fdc60d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg6ICA6ICA5YiH5YWL6Ze554Gs:q75.awebp?rk3s=f64ab15b&x-expires=1736841686&x-signature=%2B3LBvmL3e9oIWPYC%2F35RG%2BR53eE%3D)

5.将prometheu关闭，再删除冲突端口对应的pid进程

systemctl stop prometheus.service

sudo lsof -i :9090

sudo kill -9 7252

6.再重启nginx

sudo service nginx restart