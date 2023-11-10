---
title: nginx里各配置含义解析
date: 2023-11-10 16:53
tags: [随笔]
categories: 前端随笔
---
# 前言
> 因封装了个图片上传的组件，需要一个图片上传的接口，用nest.js把接口整完后，把项目部署到服务器后出现了点小问题，发现是nginx配置错了，于是学习一下nginx，巩固一下。

## nginx是什么？
*Nginx*是一个开源的Web服务器和反向代理服务器,它最初由*Igor Sikorsky*开发,现在由*OpenResty*项目维护。*Nginx*的主要用途是处理*HTTP请求和HTTPS请求*,以及进行*URL转发、负载均衡、反向代理*等。它具有高性能、高可用性和灵活性,被广泛应用于*Web服务器、CDN、反向代理、API网关等场景*中。

## nginx配置文件概述
可以打开你项目nginx目录下的文件

Nginx的配置文件按以下结构组织：

| 配置块     | 功能描述                                           |
| ---------- | -------------------------------------------------- |
| 全局块     | 与Nginx运行相关的全局设置                          |
| events块   | 与网络连接有关的设置                               |
| http块     | 代理、缓存、日志、虚拟主机等的配置                 |
| server块   | 虚拟主机的参数设置（一个http块可包含多个server块） |
| location块 | 定义请求路由及页面处理方式                         |
当你使用 Nginx 时，配置文件按以下结构组织：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ccda87cb5054d28b9d6ce454d7e796a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=1228&s=337326&e=png&b=d3f1fc)

下面是一个示例 Nginx 配置文件，演示了这些块的嵌套关系和用法：

```
# 全局块
user www-data;
worker_processes auto;

# events 块
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# http 块
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # server 块
    server {
        listen 80;
        server_name example.com;

        # location 块
        location / {
            root /path/to/website;
            index index.html;
        }
        
        location /api {
            proxy_pass http://backend_server;
        }
    }
}
```

### 1.  全局块（global block）：

全局块包含与Nginx运行相关的全局设置，如工作目录、错误日志等。以下是一些常见的配置项：

-   `worker_processes`：设置工作进程的数量，可根据服务器性能进行调整。
-   `worker_connections`：设置每个工作进程的最大连接数，可根据服务器性能进行调整。
-   `user`：设置Nginx服务的用户和组。
-   `pid`：设置Nginx服务的进程ID文件路径。
-   `error_log`：设置错误日志文件路径。
-   `access_log`：设置访问日志文件路径。
-   `worker_aio_requests`：设置异步请求的最大并发数。
-   `events { ... }`：定义事件处理相关的配置，如工作线程数、事件处理方法等。

### 2.  events块：

events块包含与网络连接有关的设置，如工作线程数、事件处理方法等。以下是一些常见的配置项：

-   `worker_connections`：设置每个工作进程的最大连接数，可根据服务器性能进行调整。
-   `use`：指定事件处理模块，如epoll、kqueue等。
-   `multi_accept`：设置是否允许多个连接同时接受处理。
-   `accept_mutex`：设置是否启用互斥锁，防止同时处理多个连接。
-   `accept_mutex_delay`：设置互斥锁延迟时间，防止过度锁定。
-   `worker_aio_requests`：设置异步请求的最大并发数。

### 3.  http块：

http块包含代理、缓存、日志、虚拟主机等配置。以下是一些常见的配置项：

-   `server { ... }`：定义一个虚拟主机，如监听端口、server_name、location等。
-   `listen`：设置监听的IP地址和端口。
-   `server_name`：设置虚拟主机的域名或IP地址。
-   `root`：设置静态文件的根目录。
-   `index`：设置默认主页。
-   `charset`：设置字符集。
-   `proxy_pass`：设置代理后端服务器地址。
-   `location`：定义请求路由及页面处理方式，如URL路径、处理方式（如静态文件、动态内容等）。
-   `alias`：设置别名，用于访问静态文件。
-   `expires`：设置静态文件过期时间。
-   `log_format`：设置日志格式。
-   `access_log`：设置访问日志文件路径。
-   `error_log`：设置错误日志文件路径。

### 4.  server块：

server块包含虚拟主机的参数设置，如监听端口、server_name、location等。以下是一些常见的配置项：

-   `listen`：设置监听的IP地址和端口。
-   `server_name`：设置虚拟主机的域名或IP地址。
-   `root`：设置静态文件的根目录。
-   `index`：设置默认主页。
-   `charset`：设置字符集。
-   `proxy_pass`：设置代理后端服务器地址。
-   `location`：定义请求路由及页面处理方式，如URL路径、处理方式（如静态文件、动态内容等）。
-   `alias`：设置别名，用于访问静态文件。
-   `expires`：设置静态文件过期时间。
-   `log_format`：设置日志格式。
-   `access_log`：设置访问日志文件路径。
-   `error_log`：设置错误日志文件路径。

### 5.location块：

location块定义请求路由及页面处理方式，如URL路径、处理方式（如静态文件、动态内容等）。以下是一些常见的配置项：

-   `root`：设置静态文件的根目录。
-   `alias`：设置别名，用于访问静态文件。
-   `expires`：设置静态文件过期时间。
-   `try_files`：设置查找静态文件的顺序。
-   `default_type`：设置默认文件类型。
-   `content_by_lua_block`：使用Lua脚本处理动态内容。
-   `content_by_lua_file`：使用Lua文件处理动态内容。

## nginx的主要作用
1.  静态文件服务：Nginx 可以用作静态文件服务器，用于提供静态文件（如 HTML、CSS、JavaScript、图像文件等）的访问。在配置文件的 server 块中，可以使用 `root` 指令指定静态文件所在的目录。
1.  反向代理：Nginx 可以作为反向代理服务器，将客户端的请求转发给后端服务器进行处理，并将响应再返回给客户端。在配置文件的 server 块中，可以使用 `proxy_pass` 指令指定后端服务器的地址。
1.  负载均衡：Nginx 可以实现负载均衡，将客户端请求分发到多个后端服务器上，实现请求的平衡分配。在配置文件的 server 块中，可以使用 `upstream` 指令定义后端服务器的集群，并在 `location` 块中使用 `proxy_pass` 指令将请求转发给后端服务器集群。
1.  HTTPS 和 SSL/TLS 加密：Nginx 可以配置和管理 HTTPS 服务，并支持 SSL/TLS 协议进行通信加密。在配置文件的 server 块中，可以使用 `listen` 和 `ssl_certificate` 等指令配置 SSL/TLS 证书和加密相关的设置。
1.  虚拟主机：Nginx 支持虚拟主机，可以在一台服务器上配置多个独立的域名或网站。在配置文件的 http 块中，可以定义多个 server 块，每个 server 块对应一个虚拟主机，并根据需要配置不同的域名、监听端口、SSL 设置等。
1.  日志记录和统计：Nginx 可以记录并统计服务器的访问日志，包括客户端IP、请求时间、请求方法、请求路径等信息。在配置文件的 server 块中，可以使用 `access_log` 指令指定访问日志的文件路径和格式。

## 个人博客
[耀耀切克闹 (yaoyaoqiekenao.com)](https://yaoyaoqiekenao.com/)