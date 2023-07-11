---
title: WEB前端基础知识梳理-笔记
date: 2023-07-11 16:53
tags: [面试，随笔]
categories: 前端随笔
---

## 基础部分

### DOM事件流及事件委托机制
*DOM事件流（DOM Event Flow）*： 是描述浏览器中事件传递的一种模型。当页面上发生事件时，浏览器会按照特定的顺序将事件传递给相关的元素。DOM事件流主要包括三个阶段：*捕获阶段（Capture Phase）、目标阶段（Target Phase）、冒泡阶段（Bubble Phase）*。

1.  捕获阶段（Capture Phase）：事件从文档的根节点（即window对象）开始，逐级向下传递到事件的目标元素之前的节点。在捕获阶段，事件是从最外层的祖先元素依次捕获到目标元素，直到达到触发事件的元素。
2.  目标阶段（Target Phase）：事件到达触发事件的元素。
3.  冒泡阶段（Bubble Phase）：事件从触发事件的元素开始，逐级向上冒泡到文档的根节点。在冒泡阶段，事件会依次冒泡到祖先元素，直到达到文档的根节点。

*事件委托（Event Delegation）*：是一种利用事件冒泡机制的技术。通过将事件监听器绑定在祖先元素上，然后利用事件冒泡的原理，从而在事件冒泡到祖先元素时触发事件监听器。这样可以减少事件监听器的数量，提高性能和代码的可维护性。

事件委托的主要原理是通过事件冒泡，将事件处理器绑定到祖先元素上，而不是直接绑定到每个子元素上。当事件发生时，事件会冒泡到祖先元素，然后在祖先元素上触发事件处理器。通过判断事件的目标元素，可以实现根据目标元素的不同做出相应的操作。

事件委托机制的好处有：

-   减少事件处理器的数量，节省内存和提高性能。
-   可以动态地添加或移除子元素，而不需要重新绑定事件处理器。
-   可以处理动态生成的元素，即使在绑定事件处理器之前。


### Ajax
*Ajax（Asynchronous JavaScript and XML）*： 是一种利用JavaScript、XML和HTTP请求的技术，用于在不重载整个页面的情况下与服务器进行异步通信。它可以实现在后台与服务器进行数据交换，并使用JavaScript更新页面的部分内容，从而提升用户体验和页面性能。

**Ajax的特点和优势包括：**

1. 异步通信：Ajax使用异步方式发送和接收数据，可以在后台与服务器进行数据交换，而不需要阻塞用户界面。这允许页面在等待服务器响应时仍然保持响应，并且可以同时进行其他操作。
2. 增量更新：Ajax可以根据需要只更新页面的一部分内容，而不是整个页面。通过使用JavaScript动态地更新DOM，可以提高页面的加载速度和响应速度。
3. 减少带宽消耗：由于只需要传输数据而不是整个页面，Ajax可以减少网络流量，降低带宽消耗。
4. 更好的用户体验：Ajax可以使用户与网站进行交互更加流畅，减少页面加载时间和响应延迟，提升用户体验。
5. 支持多种数据格式：虽然名字中包含XML，但Ajax并不限于只使用XML。它可以使用各种数据格式，如JSON、HTML、纯文本等。

**在使用Ajax时，常见的步骤包括：**

1. 建立XMLHttpRequest对象
2. 设置回调函数
3. 配置请求信息，(如open,get方法)，使用open方法与服务器建立链接
4. 向服务器发送数据
5. 在回调函数中针对不同的响应状态进行处理;


```js
function myAjax() {
    // 1. 建立XMLHttpRequest对象
    var xhr = new XMLHttpRequest()
    // 2. 设置回调函数
    xhr.onreadystatechange = callback
    // 3. 配置请求信息，(如open,get方法)，使用open方法与服务器建立链接
    xhr.open('post', '/xxx', true)
    // 3. 设置请求头信息
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    //4. 向服务器发送数据
    var params = { ... }
    xhr.send(params)
    
}
// 5.  在回调函数中针对不同的响应状态进行处理;
function callback() { 
// 判断异步对象的状态 
    if(xhr.readyState == 4) { 
    // 判断交互是否成功 
        if(xhr.status == 200) { 
        // 获取服务器响应的数据 
        var res = xhr.responseText 
        // 解析数据 
        res = JSON.parse(res) 
        } 
    } 
}
```
## 浏览器相关
### 输入 URL 回车后经过哪些过程
1.  解析 URL，判断是否命中缓存（DNS prefetch）
2.  访问 DNS 服务器，将域名解析获取 IP 地址
3.  三次握手建立 TCP 连接
4.  发送 HTTP 请求
5.  服务器处理请求并返回 HTTP 报文
6.  浏览器解析渲染页面
7.  断开连接：TCP 四次挥手
### 跨域问题
在前端开发中，常见的前端解决跨域问题的方法包括：

1. *JSONP（JSON with Padding）*：JSONP利用&lt;script&gt;标签可以跨域加载外部资源的特性，通过动态创建&lt;script&gt;标签，将请求发送到其他域，并在返回的数据中包含一个回调函数调用，以实现跨域通信。但是JSONP只支持GET请求，且需要目标服务器支持返回预先定义好的回调函数。

```javascript
function handleResponse(data) {
  // 处理响应数据
  console.log(data);
}

var script = document.createElement('script');
script.src = 'http://example.com/api/data?callback=handleResponse';
document.body.appendChild(script);
```

2. *CORS（Cross-Origin Resource Sharing）*：CORS是一种现代化的跨域解决方案，需要服务器设置响应头来允许跨域访问。前端代码无需特殊处理，只需发送跨域请求即可。在服务器响应中，设置Access-Control-Allow-Origin头为允许访问的域名或使用通配符*来表示允许所有域名访问。

3. *使用代理服务器（本地工程化项目配置 Proxy 代理来跨域请求后端（Webpack、Vite），Nginx反向代理）*：前端代码将请求发送到同域的代理服务器，然后由代理服务器转发请求到目标服务器，在代理服务器与目标服务器之间跨域请求。前者更适合在开发环境中使用，而后者更适合在生产环境中使用。至于为什么（有性能，安全性等方面），NGINX具备一些强大的安全功能，如SSL终止、防止DDoS攻击等，安全性肯定是强些，又具有许多高级功能，如反向代理、负载均衡、缓存等。这些功能对于处理大量并发请求、提供高可用性和水平扩展方面非常有用，性能上也肯定好。

4. *WebSocket*：WebSocket是一种支持在浏览器和服务器之间进行全双工通信的协议，它不受同源策略的限制，可以直接进行跨域访问。
5. *postMessage*：postMessage是H5新引入的可跨源通信的API，可以通过这个api，让主页面和任意iframe页面或者windows.open打开的页面进行双向通信。

需要注意的是，为了保护用户的安全性，浏览器实施了同源策略，限制了不同源（协议、域名、端口号任一不同）之间的交互行为。因此，跨域请求在默认情况下是受到限制的。上述方法都是在特定条件下解决跨域问题的方案，不同的场景可以选择不同的方法。

**postMessage的使用**

window.postMessage()是一个JavaScript方法，允许在不同的window或iframe之间进行跨域通信。它允许你向其他浏览上下文（页面、iframe、子窗口等）发送消息，并且不需要同源限制。

该方法接受两个参数（实际是3个参数，但一般只用到前2个）：

1. message：要发送的数据，可以是字符串、数字、对象等。

2. targetOrigin：目标窗口的源，即目标窗口的域名。只有在目标窗口与当前窗口具有相同的源时，目标窗口才能接收到消息。也可以使用通配符 "*" 表示允许任何源接收消息，但这样可能会存在安全风险。

使用示例：

在当前页面中发送消息：

```javascript
var otherWindow = window.opener;  // 获取目标窗口的引用
var message = 'Hello, World!';    // 要发送的消息

otherWindow.postMessage(message, 'https://example.com');
```

在目标窗口中接收消息：

```javascript
window.addEventListener('message', function(event) {
  if (event.origin === 'https://example.com') {  // 检验消息来自合法的源
    var receivedMessage = event.data;             // 接收到的消息
    console.log(receivedMessage);
  }
});
```

`window.opener`获取了打开当前窗口的窗口的引用。然后使用`postMessage()`方法将消息发送给目标窗口，并指定目标窗口的源。目标窗口中使用`window.addEventListener()`监听`message`事件，并通过`event.origin`检验消息的源。如果消息来自合法的源，就可以获取到消息内容`event.data`。

### 移动端屏幕适配
在移动端屏幕适配中，我们需要确保网页或应用程序能够在不同尺寸和分辨率的移动设备上呈现良好的用户体验。以下是一些常见的移动端屏幕适配方法：

1. *响应式布局*：使用CSS媒体查询和弹性布局等技术，根据不同的屏幕尺寸和设备方向，调整页面布局和样式。这使得页面能自适应不同的屏幕大小，并保持可读性和操作性。

2. *流体布局*：使用百分比或rem等相对单位来定义元素的尺寸和间距，而不是使用固定像素值。这允许页面元素相对于屏幕大小进行伸缩，以适应不同的设备。（通过插件postcss-pxtorem完成）

3. *视口设置*：通过设置视口的meta标签来调整页面在移动设备上的显示方式。使用`<meta name="viewport">`标签来设置视口宽度、缩放、禁止缩放等选项，以确保页面在不同设备上呈现正确。

4. *移动端特定样式*：通过使用CSS媒体查询和移动端特定的样式规则，为移动设备提供更好的用户体验。例如，调整字体大小、按钮大小、触摸目标的可点击区域等。

5. *使用Flexbox或Grid布局*：Flexbox和Grid布局是强大的CSS布局工具，可以帮助我们以更灵活的方式创建响应式布局。它们提供了一种简单而直观的方式来控制页面中元素的位置和尺寸。

6. *测试和调试*：在开发过程中，务必经常在不同的移动设备上测试和调试应用程序。使用浏览器开发者工具、模拟器或真实设备进行调试，以确保页面在各种设备上呈现正确且良好的用户体验。

`注意在使用这些方案时需要注意一下兼容性的问题`
### 数据存储
[cookie、localStorage、sessionStorage随笔](https://juejin.cn/post/7161965374374674468)
### 浏览器缓存
*浏览器缓存*是指浏览器在访问网页时将一些静态资源（如图片、CSS文件、JavaScript文件等）保存在本地的临时存储空间中，以便在下次访问同一网页时能够更快地加载这些资源，提高网页的加载速度和用户体验。

浏览器缓存分为两种类型：`强缓存和协商缓存`。

*强缓存*是通过设置响应头中的Cache-Control和Expires字段来实现的。当浏览器发送请求时，会先检查本地缓存中是否存在该资源的副本，并根据Cache-Control和Expires字段的值判断是否可使用缓存。如果可使用缓存，则直接从本地缓存中加载资源，不会发送请求到服务器。
- **Expires**（http 1.0 时期产物）：设置的是具体的过期时间。
- **cache-control**（http 1.1 时期产物）：设置的是经过多少时间（单位秒）之后过期，与 Expires 同时存在的话优先级更高。

*协商缓存*是通过设置响应头中的Last-Modified和ETag字段来实现的。当浏览器发送请求时，会先发送一个带有If-Modified-Since和If-None-Match字段的请求到服务器，服务器根据这些字段的值判断资源是否有更新。如果资源没有更新，则返回304 Not Modified状态码，浏览器直接从本地缓存中加载资源。如果资源有更新，则返回新的资源，并更新本地缓存。
-   **Last-modified**：顾名思义，最后一次更改时间。

-   **ETag**：优先级更高，资源的唯一标识。优点是精度更高，因为 Last-modified 时间单位是秒，如果文件在 1 秒内被修改多次就很难侦测到。缺点是性能有一定消耗，因为获得资源的hash值需要额外计算。


浏览器缓存可以有效减少网络请求，提高网页的加载速度。但有时候也会导致问题，例如当网站更新了静态资源但用户的浏览器缓存仍然存在旧版本的资源时，用户可能无法看到最新的内容。为了解决这个问题，可以通过修改资源的文件名或者使用版本号来强制浏览器重新加载资源。
### 前端路由
[前端路由的基础理解](https://juejin.cn/post/7150118507030511624)
### 垃圾回收机制
javaScript中的垃圾回收机制是自动管理内存的一种方式。JavaScript引擎使用的垃圾回收算法主要是基于`标记-清除（Mark and Sweep）算法`。

标记-清除算法分为两个阶段：

- 标记阶段：垃圾回收器会从根对象开始，遍历所有的对象，并标记出那些仍然被引用的对象。在JavaScript中，全局变量、当前调用栈上的局部变量以及正在运行的函数中的变量都被视为根对象。
- 清除阶段：垃圾回收器会对内存进行清理，释放那些没有被标记的对象所占用的内存空间。
不管什么程序语言，内存生命周期基本是一致的：

JS 是在定义变量时就完成了内存分配，而“垃圾回收器”的工作是跟踪内存的分配和使用，以便当分配的内存不再使用时，自动释放它。


除了标记-清除算法，JavaScript引擎还使用了其他优化算法来提高垃圾回收的效率，例如`分代回收（Generational Collection）`和`增量回收（Incremental Collection）`。

*分代回收*将对象分为新生代和老生代两个年代。新生代中的对象生命周期较短，垃圾回收频率较高；而老生代中的对象生命周期较长，垃圾回收频率较低。通过不同的回收算法和策略来处理不同年代的对象，可以提高垃圾回收的效率。

*增量回收*是一种在执行垃圾回收时，与程序交替执行的方式。这样可以将垃圾回收的任务分解成多个小部分，在每个小部分执行完后让程序继续执行，以减少垃圾回收对程序执行的影响，并提高响应性能。

总的来说，JavaScript的垃圾回收机制是一种自动管理内存的方式，通过使用标记-清除算法以及其他优化算法来检测和释放不再使用的内存空间，从而提高程序的性能和可靠性。
### V8引擎垃圾回收机制
V8是一款用于执行JavaScript代码的高性能JavaScript引擎，它内置了独特的垃圾回收机制，与普通的垃圾回收机制存在一些不同之处。以下是V8垃圾回收机制的主要特点：

1.  分代回收：V8的垃圾回收器采用了分代回收策略。它将内存分为新生代（young generation）和老生代（old generation）两个代。新生代中存放的是新创建的对象，生命周期较短；而老生代中存放的是存活时间较长的对象。通过将内存分代，可以根据对象的生命周期采用不同的回收策略，提高垃圾回收的效率。
1.  增量式垃圾回收：V8的垃圾回收器采用了增量式垃圾回收，在执行JavaScript代码的过程中，将垃圾回收的任务分解为多个小部分，并与程序交替执行。这样可以将垃圾回收的负担分散到程序执行的过程中，减少了垃圾回收对应用程序的影响，提高了响应性能。
1.  Scavenge算法：新生代内存的垃圾回收使用了Scavenge算法。该算法将新生代内存空间分为From空间和To空间，对象首先分配到From空间，随着垃圾回收的进行，存活的对象会被复制到To空间，同时进行压缩操作，然后清空From空间。这种方式有效地解决了新生代内存中频繁发生的垃圾回收问题。
1.  标记-清除算法：老生代内存的垃圾回收使用了标记-清除算法。垃圾回收器首先通过根对象遍历，标记所有可达的对象，然后清除那些未标记的对象，并回收它们占用的内存空间。V8的垃圾回收器还采用了增量标记和压缩操作，提高了清除过程的效率。

总体而言，V8的垃圾回收机制在分代回收、增量式垃圾回收、Scavenge算法和标记-清除算法等方面与普通的垃圾回收机制有一些不同。这些特点使得V8能够在执行高性能JavaScript代码的同时，有效地管理内存并提高垃圾回收的效率。
## 网络相关
### HTTP 1.0/1.1/2.0/3.0 的特性
*HTTP 1.0*
1.  确定了协议是**无状态**的，即同一客户端每次请求都没有任何关系
2.  消息结构包含请求头和请求体

*HTTP 1.1*
1.  持久连接：引入了持久连接（Persistent Connection），可以在一次TCP连接中发送多个HTTP请求和响应，减少了连接建立和关闭的开销。
2.  流水线：引入了流水线（Pipelining），允许客户端同时发送多个请求，提高了并发性能。
3.  虚拟主机：通过Host请求头字段，可以在一台服务器上运行多个网站。
4.  缓存控制：引入了缓存控制机制，使得服务器和客户端可以更好地管理缓存和减少数据传输。
5.  分块传输编码：支持分块传输编码（Chunked Transfer Encoding），可以在不知道内容长度的情况下逐块发送数据。

*HTTP 2.0*

1.  二进制传输：HTTP 2.0使用二进制格式传输数据，替代了HTTP 1.x的文本格式，提高了传输效率和容错性。
2.  多路复用：引入了多路复用（Multiplexing），可以通过一个连接并发发送多个请求和响应，解决了HTTP 1.x的队头阻塞问题，提高了性能。
3.  请求优先级：可以设置请求的优先级，确保重要请求优先处理。
4.  头部压缩：使用HPACK算法对HTTP头部进行压缩，减少了数据传输的大小。
5.  服务器推送：服务器可以主动推送数据给客户端，减少客户端请求的延迟。

*HTTP 3.0*

1.  使用QUIC协议：HTTP 3.0使用QUIC（Quick UDP Internet Connections）作为传输协议，基于UDP提供更快的连接建立和数据传输。
2.  强化安全性：HTTP 3.0默认使用加密的传输，提供更好的安全性和隐私保护。
3.  抗网络阻塞：引入了拥塞控制机制，可以更好地应对网络阻塞和高延迟的情况。
### GET 和 POST 区别

-   Get 传输**大小相对受限**（不同浏览器之间不同），Post **大小不受限制**
-   Get 通过 **URL** 编码传输数据，Post 通过 **body** 传输，支持多种编码格式（两者都是**明文传输**，都不是安全的，但 Get 参数直接暴露在 URL 上，不能用来传递敏感信息）
-   浏览器会**缓存** Get 请求，Post 则**不会缓存**。（在该特性下Get请求可能会出现 304 不更新，解决方法：链接加个随机参数）
### 网络安全
**XSS**（跨站脚本攻击）：

利用了浏览器对于从服务器所获取的内容的信任，注入恶意脚本在受害者的浏览器中得以运行，分为反射型、储存型、DOM型。开启 *CSP*（内容安全策略）可以减少或消除这类攻击，副作用是 `eval`、`Function()` 等方法会失效。类似的还有 *CRLF* 攻击，防御此类攻击的核心就是严格控制用户提交的内容，对输入进行过滤，对输出进行转义。

**CSRF**（跨站伪造请求）：
利用受害者的登录凭证（cookie）达到冒充该用户执行操作的目的，这在被攻击方很难完全防御，所以只能尽量减少 cookie 的使用，目前大部分网站也都是用 Token 来进行身份验证的，可以有效避免该类攻击。

**Injection**（注入攻击）
这种攻击主要是接口设计不当导致的，例如接口根据用户传递的内容拼接 SQL，那么就可以通过传递 SQL 语句来注入攻击；又例如根据传递的内容来拼接 Shell 命令，那么攻击者如果传了类似 *&& rm -rf xxx* 这样的命令就会被执行，后果不言而喻。  


**DoS**（服务拒绝）、**DDoS**（分布式服务拒绝）：

通过构造大量特定请求，导致服务器资源被消耗过度，挤压正常的请求，进而产生雪崩效应。在 DDoS 攻击中更是利用了僵尸网络，使得追溯源头的可能性几乎为零，这类攻击主要目的在于消耗服务器带宽，非常难防御，常见的有 SYN 洪泛攻击（利用 TCP 三次握手），只能通过一些手段缓解，例如缩短超时，让服务器更快地释放掉长时间响应的连接，从而增加攻击者的成本。  


**中间人攻击**：

通过拦截窃取手段破坏通信，信息在用户和服务之间的传递都会暴露在攻击者的视野中。使用 HTTPS 协议传输一般可以避免，还有就是敏感信息不要使用明文传输，剩下的就只能交给用户的安全意识了，比如用户连接了不安全的公共 wifi，那么他就有可能被攻击。

### TCP 三次握手四次挥手的理解

*TCP（Transmission Control Protocol）* 是一种常用的传输层协议，用于在计算机网络中进行可靠的数据传输。为了建立和终止一个TCP连接，TCP使用了三次握手和四次挥手的过程。

*三次握手（Three-way Handshake）* 是在客户端和服务器之间建立TCP连接的过程。具体步骤如下：

1. 第一次握手：客户端向服务器发送一个连接请求报文段（SYN）,服务端接收了报文，此时服务端可以确定客户端发送功能正常，自己接收也正常。
2. 第二次握手： 服务器收到请求后，确认连接请求，并发送一个带有确认标志的报文段（SYN+ACK）作为响应,但此时服务端还不确定自己的发送是否正常
3. 客户端收到服务器的响应后，再发送一个带有确认标志的报文段（ACK），表示连接已建立，双方都确认各自收发功能正常。

这样，双方就完成了三次握手，建立了可靠的TCP连接，可以开始进行数据传输。

*四次挥手（Four-way Handshake）* 是在客户端和服务器之间终止TCP连接的过程。具体步骤如下：

1. 客户端发送一个终止连接请求报文段（FIN）给服务器，表示客户端不再发送数据了。
2. 服务器收到请求后，发送一个确认报文段（ACK），表示已收到客户端的终止请求。
3. 服务器发送一个终止连接请求报文段（FIN）给客户端，表示服务器也不再发送数据了。
4. 客户端收到请求后，发送一个确认报文段（ACK），表示已收到服务器的终止请求。

这样，双方就完成了四次挥手，TCP连接成功终止。

三次握手和四次挥手的目的是为了保证双方都同意建立和终止连接，并确保数据的可靠传输。通过握手和挥手过程，双方可以进行信息交换，协商参数，并确保连接的稳定性和可靠性。

### 域名发散和域名收敛
*域名发散（Domain Name Expansion）和域名收敛（Domain Name Convergence）* 是在网络中管理和分配域名的两种不同策略。

*域名发散* 是指将一个域名分配给多个不同的IP地址或资源。这意味着同一个域名可能会映射到不同的服务器或资源上。这种策略在分布式系统或负载均衡环境中常见。例如，一个大型网站可能会将其域名映射到多个服务器上，以实现更好的性能和可靠性。

*域名收敛*是指将多个域名指向同一个IP地址或资源。这意味着多个不同的域名将指向同一个服务器或资源。这种策略经常用于集中管理和简化网络架构。例如，一个公司可能会有多个域名，但它们都指向同一台服务器，这样可以方便地管理和维护这些域名和服务器。

选择采用域名发散或域名收敛策略取决于特定的网络需求和设计目标。域名发散可以提供更好的负载均衡和容错能力，但需要更复杂的配置和管理。域名收敛可以简化管理，但可能会对性能和可靠性产生风险。
## CSS相关
### CSS盒模型
CSS盒模型（CSS Box Model）是用于定义和布局HTML元素的一种模型。它将每个HTML元素看作一个矩形的盒子，包括内容区域、内边距、边框和外边距
1.  内容区域（Content）：这是盒子中放置实际内容的部分，如文本、图像等。它的大小由`width`和`height`属性定义。
2.  内边距（Padding）：这是内容区域与边框之间的空白区域。它的大小由`padding-top`、`padding-right`、`padding-bottom`和`padding-left`属性定义。
3.  边框（Border）：这是一个包围内容区域和内边距的线条或样式。它的大小和样式由`border-width`、`border-style`和`border-color`属性定义。
4.  外边距（Margin）：这是盒子与其他盒子之间的空白区域。它的大小由`margin-top`、`margin-right`、`margin-bottom`和`margin-left`属性定义。

标准盒模型：`box-sizing: content-box`，另外也可通过可以在HTML文档的`<head>`标签中添加文档类型声明（DOCTYPE）设置标准盒模型
-   在标准盒模型中，元素的总宽度和高度包括了内容区域、内边距、边框和外边距。
-   元素的宽度（`width`）和高度（`height`）属性指定的是内容区域的尺寸。
-   总宽度 = `width` + 左内边距 + 右内边距 + 左边框 + 右边框 + 左外边距 + 右外边距。
-   总高度 = `height` + 上内边距 + 下内边距 + 上边框 + 下边框 + 上外边距 + 下外边距。

IE盒模型（怪异盒子模型）：`box-sizing: border-box`

元素宽度为内容宽度+边距+边框（content + padding + border = width）
### BFC
BFC的全称是块状格式化上下文
> 一个块格式化上下文（block formatting context） 是Web页面的可视化CSS渲染出的一部分。它是块级盒布局出现的区域，也是浮动层元素进行交互的区域。
>
>  一个块状格式化上下文可由以下方法创建：

1.  根元素（html元素）或其它包含它的元素
2.  浮动元素 (元素的 float 不是 none)
3.  position 的值不为relative和static
4.  内联块 (元素具有 display: inline-block)
5.  表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
6.  表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
7.  具有overflow 且值不是 visible 的块元素
8.  display: flow-root
9.  column-span: all 应当总是会创建一个新的格式化上下文，即便具有 column-span: all 的元素并不被包裹在一个多列容器中。
10. 弹性盒flex boxes（元素具有display: flex或inline-flex）

**应用：**

1.  阻止 `margin` 重叠
2.  阻止元素被浮动元素覆盖（以前常用于**自适应两栏布局**）
3.  清除内部浮动（父级元素**高度塌陷**问题）
### 回流与重绘
*回流*：是指浏览器根据DOM树和CSS样式计算元素的几何属性和布局信息的过程。当页面中的元素发生了改变（如添加、删除、修改元素的位置、大小等），浏览器会重新计算元素的布局信息，以确定每个元素在文档中的准确位置。回流是一种比较昂贵的操作，因为它会影响页面的整体布局，可能需要重新计算许多元素的位置，对性能有一定的影响。

**具体哪些情况会导致回流：**

1. 页面首次渲染
2. 浏览器窗口变化
3. 元素**尺寸**或**位置**变化（宽高、边距、边框等）
4. 元素**内容**发生变化（文字数量、图片大小、字体大小变化）
5. 添加删除**可见**的 DOM 节点
6. 激活 css 伪类（hover、active等）
7. 查询某些属性或调用某些方法（浏览器会必须回流来保证数据的准确性）

*重绘*：是指浏览器对页面进行重新绘制的过程，即根据元素的新的样式计算并绘制页面的外观。当元素的样式发生了改变（如颜色、背景、边框等），浏览器会重新计算元素的视觉效果，并将其重新绘制在屏幕上。相比于回流，重绘的开销较小，因为它只需要更新元素的样式，不需要重新计算布局。

*回流必将引起重绘，重绘不一定引起回流。回流的性能开销更大*

**如何减少回流重绘（性能优化）：**

**HTML层面**：

1.  避免使用 `table` 布局
2.  在 DOM 树最末端改变 class

**CSS层面**：

1.  尽量减少使用 CSS 表达式（如：`calc`）
2.  避免多层内联样式
3.  将复杂动效应用在脱离文档流的元素上（`position: absolute / fixed`）

**JS层面**：

1.  避免用 JS 操作样式（多个样式改变尽量**合并为一次操作**）
2.  如无法避免多次应用样式或操作 DOM，则可以先设置元素隐藏（先 `display:none` 再操作）
3.  重复使用元素属性时赋值给变量（避免重复查询元素导致回流）
4.  某些操作尽量采用防抖节流（如 resize、scroll）

### 实现水平垂直居中
**flex布局（最常用）**

```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}

```
**grid布局（兼容性不太好，适合内部系统，自己用）**
```css
.parent {
    display: grid;
    place-items: center;
}
```
**translate偏移居中(绝对定位中最好用的方式，不限宽高)**

```js
.prant{
    position:relative;
}
.child{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%)
}
```
### css多行文本隐藏
单行文本溢出隐藏
```css
overflow: hidden;
```
单行文本溢出隐藏显示省略号

```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```
多换文本溢出隐藏显示省略号

```css
text-overflow: -o-ellipsis-lastline;
overflow: hidden
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;//想显示几行改成几
-webkit-box-orient: vertical;
```
### css换行

**1.自动换行：**

```css
word-wrap:break-word;
word-break:normal; 
```

**2.强制换行：**

```css
word-break:break-all;       按字符截断换行 /* 支持IE和chrome，FF不支持*/
word-wrap:break-word;    按英文单词整体截断换行  /* 以上三个浏览器均支持 */
```
* 注意：单词换行需要父盒子为块级元素  

**3.强制不换行：**
```css
white-space:nowrap;
```
### 隐藏元素的办法
[聊聊 CSS 隐藏元素的 10 种实用方法](https://juejin.cn/post/7210412098810740795)
### css常见问题
[解决常见的 CSS 问题 - 学习 Web 开发 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Howto)

## JS基础知识
### 数据类型
基本数据类型：`undefined`、`null`、`string`、`number`、`boolean`、`bigint`、`symbol`,基本数据类型存放在栈内存中，大小是可预期的。

引用数据类型有：  `Object`、`Array`，引用数据类型存放在堆内存中，主要储存复杂数据。

**怎样理解 堆、栈、队列 ？**

【*堆*】：想象一个仓库，在申请到一片空间后就可以放任何东西，但是东西放多了找起来就比较麻烦，所以需要一份“清单”，通过查找清单上的索引去找你要的那堆东西，就不用每次都进仓库乱翻。

【*栈*】：想象一个箱子，先放进去的东西反而被压在了箱底，也就最慢才会被拿出来，所以说*先进后出，后进先出*。

【*队列*】：排队没什么好说吧，讲究一个先来后到，所以肯定*先进先出*。

这是我笔记主要来源的一篇文章作者的理解，感觉非常通俗易懂。
### JS 处理数组常用的方法

```js
Array.push() //末尾添加
Array.unshift()//头部添加
Array.pop() //末尾删除
Array.shift() //末尾添加
Array.reserve()//翻转数组
Array.sort() //排序
Array.slice(start, end)//切割，不改变原数组，返回新数组
Array.splice(start, length, newItem)//更改数组（删除，添加数组）
Array.indexOf()//查元素下标，查到返回元素下标，没有返回-1
```
**数组循环**

```js
Array.forEach((item,index)=>{})//用来循环遍历数组的,无返回值 代替了for
Array.map((item,index)=>{returen ...}) //映射数组的，有返回值
Array.filter((item,index)=>{return ...}) //过滤数组,返回过滤后的数组
Array.every((item,index)=>{return ...}) //主要是用来判断数组中是不是每一个都满足条件，返回一个布尔值
Array.some((item,index)=>{return ...}) //主要是用来判断数组中有没有满足条件的,返回布尔值
Array.find((item,index)=>{return ...}) //用来获取数组中满足条件的第一个数据，没有返回undefined
Array.reduce((prev,item,index)=>{return ...}) //用来叠加的，prev :一开始就是初始值 当第一次有了结果以后；这个值就是第一次的结果
```
### JS 处理对象常用的方法
1.对象遍历

```js
const obj = { property1: "value1", property2: "value2", property3: "value3" };
for(let key in obj ) {
    console.log(key, obj[key]);
}
```
2.对象合并

```js
const target = {property1: "value1"}
const source = {property2 "value2,property3 "value3,}
Object.assign(target,source)
console.log(target);
// 输出: { property1: "value1", property2: "value2", property3: "value3" }
```
3.对象中的属性检查

```js
const obj = { property: "value" }; 
console.log("property" in obj); // 输出: true 
console.log("nonexistent" in obj); // 输出: false
```
4.对象拷贝

```js
//使用 Object.assign({},Obj)
const obj = { property: "value" }; 
const clone = Object.assign({}, obj); 
console.log(clone); // 输出: { property: "value" } 
// 或者 使用解构赋值和扩展运算符(...)
const clone2 = { ...obj }; 
console.log(clone2); // 输出: { property: "value" }
```
>
> 上面的2种方式，如果对象的属性值为简单类型，通过这两种方式得到的新对象为深拷贝，如果属性值为【对象或者其他引用类型】，那对于这个对象实际上还是浅拷贝。

**深拷贝方案**

1.使用 JSON 序列化和反序列化
```js
const obj = { property: "value", nestedObj: { nestedProperty: "nestedValue" } }; 
const clone = JSON.parse(JSON.stringify(obj)); 
console.log(clone); // 输出: { property: "value", nestedObj: { nestedProperty: "nestedValue" } } 
// 修改克隆对象的属性不会影响原始对象 
clone.property = "new value"; 
clone.nestedObj.nestedProperty = "new nested value"; 
console.log(obj); // 输出: { property: "value", nestedObj: { nestedProperty: "nestedValue" } }
```
`需要注意的是，使用 JSON 序列化和反序列化的方法无法处理函数、循环引用等特殊类型数据。`

2.递归复制对象

这种方法通过递归地遍历原始对象，并针对对象的属性逐个进行深拷贝，以创建一个原对象的独立副本。
```js
function deepClone(obj) {
    if(obj === null || typeof obj!=='object') {
        return obj;
    }
    const clone = Array.isArray(obj)?[]:{};
    for(let key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj,key)) {
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}
const obj = {property: "value", nestedObj: { nestedProperty: "nestedValue" }}
const clone = deepClone(obj)
// 修改克隆对象的属性不会影响原始对象 
clone.property = "new value"; 
clone.nestedObj.nestedProperty = "new nested value"; 
console.log(obj); // 输出: { property: "value", nestedObj: { nestedProperty: "nestedValue" } }
```
`要注意处理循环引用的情况，否则可能导致无限循环`
### 闭包
闭包就是函数里面嵌套函数，并且内部函数可以访问外包函数的变量和作用域。

**闭包的主要作用：**

1. *保护数据和方法*：闭包可以创建私有变量和函数，避免全局污染，只有内部函数才能访问和修改这些数据和方法。这提供了一种封装和隐藏实现细节的方式，增加了代码的安全性和可维护性。

2. *保持状态*：通过在闭包内部保存变量的状态，可以在函数调用之间保持数据的持久性。这在处理异步操作、循环事件绑定等场景中非常有用。

3. *记忆和缓存*：使用闭包可以实现记忆功能和缓存计算结果。例如，可以使用闭包缓存函数的计算结果，避免重复计算，提高性能。（在vue中计算属性中，可以使用闭包来缓存一些计算结果，当依赖的数据没有发生变化时，可以直接使用缓存结果而不进行重复计算，提高性能。）

4. *延迟执行*：闭包可以用来实现延迟执行功能，包括延迟函数调用、动画效果、事件监听等。闭包可以在特定条件满足时触发函数执行。（节流和防抖）

5. *实现模块化和封装*：通过使用闭包，可以将相关的数据和方法封装在一个独立的作用域中，形成一个模块，提供模块化开发的能力。这样可以提高代码的可读性和可维护性。（axios的封装）

6. *共享数据和状态管理*：闭包可以用于共享数据和状态管理。通过将数据存储在闭包作用域中，并提供访问和修改的方法，可以实现多个组件或函数之间的状态共享和管理。(vueX）

总的来说，闭包是一种强大的编程概念，在JavaScript和其他编程语言中都有广泛的应用。它可以用来*处理数据封装、状态管理、模块化开发、函数式编程等*多个方面，提供了简洁、灵活和高度可控的编程方式。

`当然不恰当的使用闭包将会导致内存泄漏，以下是常见的闭包导致内存泄漏的情况`：

1.*保留外部变量*：  
    闭包会引用外部函数中的变量，导致这些变量无法被垃圾回收。当闭包存在时，外部函数的作用域仍然存在，即使外部函数已经执行完毕或不再需要。如果闭包中引用的变量占用大量内存，而且没有正确释放闭包，就会导致内存泄漏。
    
2.*不恰当的循环引用*：  
    闭包内部的函数引用了其外部函数中的变量，而外部函数又引用了闭包内部函数，形成循环引用。如果这些循环引用无法被及时释放，就会导致内存泄漏。这种情况在使用事件监听器、定时器、异步操作等场景中比较常见。
    
3.*未正确清理资源*：  
    闭包中可能引用了一些需要手动清理的资源，比如事件监听器定时等。如果不正确地释放这些资源，就会造成内存泄漏。

`处理方式：`

 -   及时销毁闭包：在不再需要闭包时，确保将其置为null，这样可以打破对外部作用域的引用，使垃圾回收器能够回收内存。
-   避免循环引用：确保闭包中引用的外部变量能够被及时释放，避免形成循环引用。
-   显式清理资源：当闭包中引用了需要手动清理的资源时，确保适时释放这些资源，比如解绑事件监听器、取消定时器等。

### JS 原型链
JavaScript中的原型链是一种对象之间继承属性和方法的机制。每个JavaScript对象在创建时都有一个内部属性`[Prototype]`，它指向另一个对象，我们称之为原型对象（prototype）。

每个函数都有 `prototype` 属性，每个函数实例对象都有一个 `__proto__` 属性，`__proto__` 指向了 `prototype`，当访问实例对象的属性或方法，会先从自身构造函数中查找，如果找不到就通过 `__proto__` 去原型中查找，直到找到该属性或方法或到达原型链的顶端（即Object.prototype）。(全篇背诵，手动狗头）

以下是原型链的一些关键概念和操作：

1. __proto__属性：每个JavaScript对象都有一个特殊的`__proto__`属性，它指向该对象的原型对象。通过`obj.__proto__`可以访问到对象的原型对象。

2. prototype属性：函数对象（包括构造函数和普通函数）会有一个`prototype`属性，它指向一个对象，成为该函数的原型对象。对于构造函数来说，它的`prototype`属性会被用作新创建的实例对象的原型。例如：

   ```javascript
   function Person() {}
   Person.prototype.age = 25;
   var john = new Person();
   console.log(john.age); // 25
   ```

3. instanceof操作符：用于检查一个对象是否是某个构造函数的实例。它会沿着原型链向上查找。例如：

   ```javascript
   function Person() {}
   var john = new Person();
   console.log(john instanceof Person); // true
   ```

4. 创建对象的方式：通过构造函数、对象字面量或`Object.create()`方法来创建对象时，会根据原型链来确定新创建对象的原型。

   ```javascript
   function Person() {}
   var john = new Person(); // john的原型为Person.prototype
   var jane = Object.create(Person.prototype); // jane的原型为Person.prototype
   var jim = {}; // jim的原型为Object.prototype
   ```
### call、apply、bind
`call`、`apply`和`bind`都是JavaScript中用于控制函数执行上下文（即函数的`this`值）的方法。

**1.call**

`call`方法：`call`方法允许你显式地指定函数的执行上下文（即函数内部的`this`指向哪个对象），并且可以传入多个参数。具体用法是通过函数对象调用`call`方法，传入一个对象作为第一个参数，这个对象将成为函数执行时的`this`值，之后可以跟随多个参数。

```js
function greet() { 
    console.log("Hello, " + this.name); 
} 
var person = { name: "John" }; 
greet.call(person); // 输出：Hello, John
```
在上述例子中，通过调用`greet.call(person)`，将`greet`函数的执行上下文绑定为`person`对象，函数内部的`this`指向`person`，从而得到正确的输出结果。

以下是一个`手写call方法的简单版`：
```js
Function.prototype.customCall = function(context,...args) {
    context = context || window;
    const key = Symbol();//创建一个唯一的键值，避免命名冲突
    context[key] = this //将当前函数作为对象的方法
    const result = context[key](...args) //执行函数
    delete context[key];
    return result;//返回函数执行结果
}
```
**2.apply**

apply()方法与call方法类似都是，用于指定函数执行的上下文，也可以传入多个参数。不同之处在于，apply方法接受一个数组作为参数列表。数组中的元素作为实参传递给函数

```js
function greet(greeting) { 
    console.log(greeting + ", " + this.name); 
} 
var person = { name: "John" }; 
greet.apply(person, ["Hello"]); // 输出：Hello, John
```
通过调用`greet.apply(person, ["Hello"])`，将`greet`函数的执行上下文绑定为`person`对象，并传入一个参数数组`["Hello"]`，函数内部的`this.name`将获得正确的值。

以下是一个`手写apply方法的简单版`：
```js
Function.prototype.customApply = function(context,args=[]){
    context = context || window;
    const key =Symbol();
    context[key] = this;
    const result = context[key](...args);
    delete context[key];
    return result;
}
```

**3.bind**

`bind`方法用于创建一个新的函数，并将指定的对象作为这个新函数的执行上下文，同时可以在调用新函数时传入一些参数。区别于前两者的是，`bind方法不会立即执行函数，而是返回一个绑定上下文后的新函数`。

```js
function greet() { 
    console.log("Hello, " + this.name); 
} 
var person = { name: "John" }; 
var greetPerson = greet.bind(person); 
greetPerson(); // 输出：Hello, John
```
通过`greet.bind(person)`创建了一个新函数`greetPerson`，并将`person`对象作为执行上下文。当调用`greetPerson()`,发现页是改变这个新函数的执行上下文

`以下是一个手写bind方法的简单版`：
```js
Function.prototype = function(context,...args) {
    const self = this;
    return function boundFn(...innerArgs) {
        if(this instanceof boundFn) {
            return new self(...args,...innerArgs);
        } else {
            return self.apply(context,[...args,...innerArgs])
        }
    }
}
```
## JS进阶
### ES6 新语法/特性
**模板字符串**

 使用反引号（``）括起来的字符串，可以包含变量和表达式，并支持多行字符串。
```js
let name = "耀耀"; 
let message = `Hello, ${name}! Welcome to the world of JavaScript `;
```
**`let`、`const`**

```js
let zy = 'zy'; //块级作用域
const R =3.1415 //声明常量，并且不可更改，块级作用域
```

**箭头函数（没有自己的 `this`，不能使用 `new` 命令，不能调用 `call`）**

箭头函数提供了更简洁的函数定义语法，同时绑定了上下文的this值
```js
let sum = (a, b) => a + b;
```
 **`class` 类**

 类是一种创建对象的模板，支持构造函数、方法和继承等特性
```js
class Person { 
    constructor(name) { 
        this.name = name; 
    } 
    sayHello() { 
    console.log(`Hello, ${this.name}!`);
    } 
} 
let person = new Person("耀"); 
person.sayHello(); // 输出: "Hello, 耀!"
```
**`export`、`import` 模块化（ES Module）**
```js
// math.js 
export function add(a, b) { return a + b; } 
// app.js 
import { add } from "./math.js"; 
console.log(add(2, 3)); // 输出: 5
```
**扩展运算符（很常用，`...` 用于组装数组/对象）**

```js
let obj1 = { x: 1, y: 2 }; 
let obj2 = { ...obj1, z: 3 }; 
console.log(obj2); // 输出: { x: 1, y: 2, z: 3 }
```
 **解构赋值**

 可以将数组或对象的属性解构赋值给变量
```js
let [x, y] = [1, 2]; 
let {firstName, lastName} = {firstName: "Alice", lastName: "Smith"};
```

 **`Set`（元素值是唯一的，常用于数组去重）**
```js
const arr = [1,2,2,3,3]
const uniqueArr = [...new Set(arr)] //[1,2,3]
```
 **`Map`（性能更好的对象）**

`Map`在JavaScript中的作用是提供了一种存储和访问键值对的方式，可以用于数据处理、查询、遍历和优化等多种场景。根据具体的需求，你可以选择使用`Map`作为数据结构来更高效地处理和操作数据。

**`Promise`、`async/await`（es7之后才支持）**

下面的异步编程有说明

### JS异步编程

[JavaScript 异步队列 - 掘金 (juejin.cn)](https://juejin.cn/post/7164559783830224904)

[ECMAScript 6 异步编程 阅读笔记 - 掘金 (juejin.cn)](https://juejin.cn/post/7231735955794444344)
### JS实现继承的方式
1.  原型继承
2.  构造函数继承
3.  组合继承（call / apply）
4.  寄生组合继承
5.  class继承（es6）

## vue相关
### vue的数据双向绑定原理

采用了"发布-订阅"的设计模式，通过Object.defineProperty()劫持各个属性的getter、setter，在数据变动时调用Dep.notify发布消息给订阅者Watcher，使之更新相应的视图

vue2使用Object.defineProperty的缺陷:

1.不能监听数组的变化，所以vue2需要对数组原型链上的方法进行一些修改才能实现监听

2.只能劫持对象的属性，所以需要深度遍历对象

Vue3中将Object.defineProperty替换为Proxy解决了对象深度监听的问题，因为 `Proxy` 代理了整个对象。
### diff算法
Vue中的diff算法也叫做虚拟DOM的周界算法，主要用来比较两个虚拟DOM节点的差异。当一个组件的数据发生变化时，Vue通过重新渲染一个虚拟DOM树，然后将新旧虚拟DOM树进行对比。通过比较新旧虚拟DOM树的差异，Vue就能够明确哪些地方需要被更新，哪些地方无需重新渲染。

Vue的diff算法是通过深度优先、先序遍历的方式进行的，它将两个虚拟DOM树进行逐层比较，当找到某一层不一样的节点时，停止下降，然后比较这些节点的子节点。当所有的子节点都完成了比较之后，算法会由下至上进行回溯，此过程被称为执行patch操作。在执行patch操作时，Vue对于不同类型的节点的更新方式也不同，对于元素节点，可以更新它的属性和子节点；对于文本节点，只能更新它的文本内容；对于每个子节点，如果key值相同，可以进行复用或者重新排序，或者将其他的节点移动到这个位置。

通过这种逐层对比，Vue的diff算法能够快速高效地计算出哪些界面需要更新，从而避免了不必要的渲染和重绘，提高了渲染性能和用户体验。
### Virtual Dom（虚拟DOM）
虚拟Dom是一种用来表示真实Dom结果的javaScript对象树。它是构建在浏览器原生Dom上的一个抽象层，虚拟dom可以在内存中进行操作，而不需要直接更新真实的Dom，最终通过diff 算法比较新旧差异，才会将最终的变化应用到真实的DOM上。

其实虚拟 DOM 并不能直接提升 DOM 操作性能，它出现的理由是 *JS 执行速度远比真实 DOM 操作要快*,因此结合diff算法，可以批量更新dom来提高性能，减少直接操作真实DOM的开销。

### vue权限管理该怎么做？
方案有很多，我就只说我常用的一种。

菜单和路由都由后端返回，前端统一定义路由组件，需要将数据处理一下，将`component`换为真正的组件，将处理完的路由表通过pinia存好，然后通过router.addRoute(route)动态挂载，完成菜单权限管理。

```ts

/**
 * 根据 menu 服务器返回的路由
 * @param menu
 * @returns
 */

const getRoutesByMenu = (menu: Array<IMenuModel>): Array<RouteRecordRaw> => {
	const routes: Array<RouteRecordRaw> = []
	for (const item of menu) {
		routes.push({
			path: item.path,
			component: shallowRef(Layout),
			name: item.name,
			meta: item.meta,
			children: getChildren(item.children, item)
		})
	}
	// console.log('router', routes)

	return routes
}

/**
 * 获取 menu children
 * @param children
 * @param item
 * @returns
 */
const getChildren = (children: Array<IMenuModel> | undefined, item: IMenuModel | RouteRecordRaw): Array<RouteRecordRaw> => {
	const childArray: Array<RouteRecordRaw> = []
	if (!children || children.length === 0) {
		childArray.push({
			path: item.path,
			name: item.name,
			component的处理: modules['/src/views' + item.path + '/index.vue'],//component的处理
			meta: item.meta
		})
	} else {
		for (let i = 0; i < (children as any).length; i++) {
			childArray.push(...getChildren((children as any)[i].children, (children as any)[i]))
		}
	}
	return childArray
}
```
使用，其中404页面，一般放在最后add到路由表中，避免出现啥未知错误。
```ts
//menu 将后端返回的菜单数据处理过了的
await permissionStore.setRoutes(menu)
    permissionStore.dynamicRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
    })
// 添加 404
router.addRoute({
    path: '/:pathMatch(.*)',
    redirect: '/404'
 })
```
## 前端性能优化
当考虑前端性能优化时，需要从网络层面、JavaScript 层面和 CSS 层面进行分析和优化。

### 网络层面优化

1.  减小文件大小：通过压缩文件、使用图像压缩算法、删除不必要的注释和空格等方式来减小文件大小。使用适当的文件格式（如 WebP 图片格式）来提高图像的压缩效率。
1.  HTTP/2 和 HTTP/3：利用 HTTP/2 或 HTTP/3 协议提供的多路复用、头部压缩、服务器推送等性能优化特性，减少网络请求的开销。
1.  加载资源顺序：使用预加载和按需加载的技术，按照优先级加载关键资源，避免阻塞主要内容的加载。
1.  缓存：配置适当的缓存策略，通过设置适当的缓存头（如 Cache-Control、Expires），使浏览器可以缓存静态资源以减少重复请求。

### JavaScript 层面优化

1.  代码压缩与混淆：使用压缩工具（如 UglifyJS、Terser）来删除不必要的字符、注释和空格，并进行变量名缩减，以减小文件大小。
1.  延迟加载和异步加载：使用延迟加载和异步加载技术来减少初始加载的 JavaScript 文件大小，只在需要时加载相关脚本。
1.  代码优化：避免不必要的计算、循环和操作，在关键路径上进行性能分析和优化。优化算法和数据结构的选择，避免性能瓶颈。
1.  避免频繁的 DOM 操作：减少直接操作 DOM 的次数，使用虚拟 DOM 或动态模板来优化页面渲染性能。

### CSS 层面优化

1.  压缩和合并 CSS：使用压缩工具（如 cssnano）来删除不必要的字符、注释和空格，并将多个 CSS 文件合并为一个以减少网络请求次数。
1.  避免使用低效的选择器：避免使用通配符、属性选择器等效率较低的选择器，尽量使用 ID 选择器和类选择器。
1.  避免过多的 CSS 动画和过渡：过多的 CSS 动画和过渡可能会导致性能下降。限制动画的数量和复杂性，并使用硬件加速技术（如使用 `transform` 和 `opacity`）来提高性能。
1.  使用媒体查询和响应式布局：使用媒体查询来为不同屏幕尺寸和设备提供不同的样式，以实现响应式布局，减少不必要的布局更改。

## 博客
[耀耀切克闹](https://yaoyaoqiekenao.com/)
## 笔记来源
[「1.5w字总结」Web前端开发必知必会详尽知识手册](https://juejin.cn/post/7216174863447146552#heading-31)

[聊聊 CSS 隐藏元素的 10 种实用方法](https://juejin.cn/post/7210412098810740795)

 [BFC-块状格式化上下文的特性及具体应用](https://juejin.cn/post/7117245974031892510#heading-1)