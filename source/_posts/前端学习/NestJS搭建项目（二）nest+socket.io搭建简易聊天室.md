---
title: NestJS搭建项目（二）nest+socket.io搭建简易聊天室
date: 2024-03-14 16:04
tags: [Nest]
categories: 前端随笔
---


## socket.io

首先介绍一下socket.io吧。

`socket.io`是一个用于实现实时通信的JavaScript库。它可以在浏览器和服务器之间实现双向通信，支持多种传输协议，如WebSocket、LongPolling、XHR等。`socket.io`的主要目的是为了简化实时通信在浏览器和服务器之间的实现，使得开发者可以专注于业务逻辑的实现。

`socket.io`的主要特点包括：

1.  支持多种传输协议：`socket.io`支持WebSocket、LongPolling、XHR等传输协议，可以根据浏览器和服务器的支持情况自动选择合适的传输协议。
1.  自动重连：`socket.io`会自动检测连接断开的情况，并在适当的时候尝试重新连接。
1.  消息压缩：`socket.io`支持对发送的消息进行压缩，以减少传输的数据量。
1.  错误处理：`socket.io`提供了丰富的错误处理机制，可以捕获并处理客户端和服务器之间的错误。
1.  事件机制：`socket.io`使用事件机制来处理消息，使得代码更加简洁和易于维护。

总之，`socket.io`是一款功能强大、易于使用的实时通信库，可以帮助开发者轻松实现浏览器和服务器之间的实时通信。



## Nest具体实现

首先需要安装依赖

npm install @nestjs/platform-socket.io

npm install @nestjs/websockets

新建一个文件用来接受广播消息和发送消息

![企业微信截图_17092795153263.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19ce8a75104d487f8b9134dbaeb6af07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=510&h=211&s=25533&e=png&b=353633)

events.gateway.ts

```js
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
// @WebSocketGateway是一个装饰器，用于创建WebSocket网关类。WebSocket网关类是用于处理 WebSocket连接和消息的核心组件之一。
// 它充当WebSocket服务端的中间人，负责处理客户端发起的连接请求，并定义处理不同类型消息的逻辑
@WebSocketGateway({ cors: { origin: '*' } })
export class EventGateway {
  constructor() {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log(body);
    const msg: any = {};
    const { roomId, name,message } =body || {} 
    msg.text = message
    msg.name = name
    msg.roomId = roomId
    this.server.to(roomId).emit('newMessage', msg)
  }
  // 离开房间
  @SubscribeMessage('leave')
  handleLeave(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { roomId, name } =body || {} 
     // 先广播离开消息给房间内其他人
     this.server.to(roomId).emit('leave', `用户：${name}离开了房间 ${roomId}`);
     client.leave(roomId);
  }
  // 创建房间并加入房间
  @SubscribeMessage('join')
  handleJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { roomId, name } =body || {} 
    client.join(roomId);
    // client只能给发送给发起请求的客户端
    // client.emit('join', `用户：${name}加入了房间 ${roomId}`);  
    // 广播消息给除自己以外的所有客户端
    // client.broadcast.emit('join', `用户：${name}加入了房间 ${roomId}`);
    // 使用服务器实例来广播消息给所有客户端
    this.server.to(roomId).emit('join', `用户：${name}加入了房间 ${roomId}`);
  }

  // 获取当前房间的人数
  @SubscribeMessage('getRoomUsers')
  handleGetRoomUsers(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const room = this.server.sockets.adapter.rooms.get(body.roomId);
    if (room) {
      this.server.to(body.roomId).emit('getRoomUsers', room.size);
    } else {
      this.server.to(body.roomId).emit('getRoomUsers', 0);
    }
  }
}

```
在app.module.ts中

```js
import { EventGateway } from './events/events.gateway';
```
在providers中注入该服务

![截图_17092802096500.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/878e6459c2644b248d50e946c250f083~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=761&h=569&s=348654&e=png&b=383832)
启动项目 yarn start



## 前端实现逻辑

安装依赖： npm install socket.io-client

先连接上socket.io

```js
import { io } from "socket.io-client";
const URL ='socket.io的地址'
const socket = io(URL);
```

socket.emit 发送消息

socket.on 监听消息

例如创建或加入房间 (nest代码中join事件，客户端这边连接上了socket.io，就可以通过对应事件实现双向通讯了)
```js
const createOrJoinRoom = () => {
  socket.emit("join", { roomId: props.state.roomId, name: props.state.name });
}
```
监听加入房间的事件，看看服务端回应广播的消息
```js
  socket.on('join', (e) => {
      console.log(e)
  });
```
其他的离开房间，发送消息等类似加入房间，具体可看源码
## 实现效果
前端样式比较简单具体实现效果如下：

![1709280685432.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32ab79e6688b46eea1967587a36df3ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1564&h=716&s=39474&e=png&b=f0f2f5)



## 体验地址

http://zymanage.yaoyaoqiekenao.com/



## 源码地址

https://github.com/DarknessZY/my-blog-app-nest.git