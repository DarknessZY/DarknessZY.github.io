---
title: React学习笔记(一)
date: 2023-06-05 14:22
tags: [recat]
categories: recat
---
<meta name="referrer" content="no-referrer" />

# 前言

> vue3的也历经了几个大项目，可以说的上是熟练运用了，本来我也在想，是继续深度研究vue，看看源码实现啥的，半年前买的霍春阳大佬写的《Vue.js的设计与实现》只看了1/2，也是惭愧，看了这么久都没看完，一直断断续续的看，哪怕是这样，我也感觉收获也颇深。先订个目标，react学完后，把这本书后面的学完看完。(可能对外面市场的焦虑，想多掌控一些技能，于是便先开始了对React的学习，之前虽然有了解，但我不怎么系统的学习),当然本文本来就是学习记录，如有雷同，肯定是我C+V过来记录的。

## 学习步骤

*   官网的快速入门 => 井字棋小游戏（因为有vue基础，我先去官网，试了试提供的例子，感觉挺有趣的）
*   react组件
*   react生命周期

## react组件

### **什么是react组件**

它接收任意的输入参数（props），并返回用于描述页面展示内容的React元素，也就是说我们在javascript函数中写一些react元素，处理一些逻辑，其实这就是一个组件。 组件可以将UI拆分成一个个独立的可复用的代码片段，并且可以对每个片段进行独立构思和管理，因此组件还能够很好的实现代码的复用。

### **react组件的分类**

React 组件可以分为两种形式：*类（class）组件*和*函数（function）组件*

#### **函数（function）组件**

*   *函数式（function）组件*：函数式组件其实就是写一个JavaScript函数，接收一个props对象作为参数，并返回用于描述页面内容的React元素（JSX语法），这就构成了一个函数式组件。官网例子就是使用的这种方式。

```js
export default function MyApp() {  
return (  
    <div>  
        <h1>Welcome to my app</h1>  
        <MyButton />  
    </div>  
    );  
}
```

*注意*：

    1.组件名称必须以大写字母开头
    2.return出去的React元素需要有一个外层节点包裹着

#### **类（class）组件**

*   *类（class）组件*：使用ES6中的类（class）来定义React组件，通过声明一个类来实现定义一个React组件

```js
import React from 'raeact' ​
class B extends React.Component {    
  constructor(props){        
    super(props)   
  }    
  render(){        
    return(       
      <div>hi</div>       
    )   
  } 
}
export default B
```

*注意*：

     1.定义类组件必须要继承自React的Component类或React.PureComponent
     2.类中必须要定义一个名为render的函数，函数的返回值应该是React元素（JSX语法）
     3.在类的内部默认会有个props属性（继承自Component）可以直接使用
     4.与函数组件一样，组件名称必须以大写字母开头
     5.在类的构造函数（constructor）中通过this.props访问属性值是获取不到的，因为这时props还没有挂载到this.props上，要等constructor执行完成之后才会挂载
     6.如果非要在构造函数（constructor）中使用this.props来获取，则可以把外面传进来的props传递给constructor中的父类构造函数super从而实现this.props的挂载
     7.类组件是动态组件，基于数据驱动视图渲染

### react组件生命周期

#### **什么是react组件生命周期**

在 React 中，对于每一次由状态改变导致页面视图的改变，都会经历两个阶段：`render 阶段`、`commit 阶段`。只有 class 组件才有生命周期，因为 class 组件会创建对应的实例，而函数组件不会。组件实例从被创建到被销毁的过程称为**组件的生命周期**。红色的为react18删除,删除的我也就没深入了解。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da24c97e83f94eda99b0f0677fb3ef04~tplv-k3u1fbpfcp-watermark.image?)

#### **初始化阶段(render 阶段)**

*constructor*

`constructor`是JavaScript中的一个构造函数，在创建一个新对象时被调用。它通常用于初始化实例的属性或方法。继承了React.Component后，该方法只会执行一次，调用该方法会返回一个组件实例。
在初始化阶段执行，可直接对 `this.state` 赋值。其他生命周期函数中只能通过 `this.setState` 修改 state，不能直接为 `this.state` 赋值。

*使用场景：* 一般在 constructor 中做一些组件的初始化工作，例如：初始化组件的 state。

*getDerivedStateFromProps*

简单翻译过来就是从Props中获得State，所以该函数的功能就是从`更新后的props中获取State，它让组件在 props 发生改变时更新它自身的内部 state`。

*shouldComponentUpdate*

在组件准备更新之前调用，但是首次渲染或者使用 forceUpdate 函数时不会被调用。跟它的名字一样，它用来判断一个组件是否应该更新。

默认情况下，当组件的 props 或者 state 变化时，都会导致组件更新。它在 render 方法之前执行，如果它的返回值为 false，则不会更新组件，也不会执行后面的 render 方法。

它接收两个参数，nextProps 和 nextState，即下一次更新的 props 和下一次更新的 state。我们可以将 `this.props` 和 nextProps 比较，以及将 `this.state` 与 nextState 比较，并返回 false，让组件跳过更新。

*使用场景：* 这个生命周期方法通常用来做性能优化

*render*

render 方法是类组件中唯一必须实现的方法，它的返回值将作为页面渲染的视图。render 函数应该为纯函数，也就是对于相同的 state 和 props，它总是返回相同的渲染结果。

#### **commit 阶段(运行中阶段)**

commit 阶段在首次渲染时会执行 componentDidMount，在组件更新时会执行 getSnapshotBeforeUpdate 和 componentDidUpdate。

*componentDidMount*

该生命周期方法会在组件挂载之后执行，也只会执行一次，也就是将组件对应的 DOM 插入 DOM 树中之后调用。它会在浏览器更新视图之前调用，如果在 componentDidMount 中直接调用 `this.setState`，它会触发额外的渲染，会再一次调用 render 函数，但是浏览器中视图的更新只会执行一次。

*使用场景:* 依赖于 DOM 的初始化操作应该放在这里，此外，我们一般在这个生命周期方法中`发送网络请求`、`添加订阅`等。

在函数式组件中，可以使用React的钩子函数 `useEffect()` 来完成 `componentDidMount()` 的功能。针对不同的需求，可以使用不同的函数来替代 `componentDidMount()`。

*使用hooks代替：*

如果需要在组件挂载时执行一次某些操作，可以在 `useEffect()` 的回调函数中加入空数组作为第二个参数，该回调函数仅会在组件挂载时被调用一次，就类似于 `componentDidMount()`：

```js
import { useEffect } from 'react';

function MyComponent(props) {
  useEffect(() => {
    // 挂载时的操作
    console.log('Component is mounted');
  }, []); // 空数组作为第二个参数
  // ...
}
```

**

如果需要在组件挂载和更新时都执行某些操作，可以省略掉第二个参数，这样 `useEffect()` 的回调函数会在每次组件更新时都被调用，就类似于 `componentDidMount()` 和 `componentDidUpdate()` 的结合：

```js
import { useEffect } from 'react';

function MyComponent(props) {
  useEffect(() => {
    // 挂载或更新时的操作
    console.log('Component is mounted or updated');
  });
  // ...
}
```

**

有了 `useEffect()`，我们就可以在函数式组件中获得和使用 `componentDidMount()` 相同的能力，以做到更好的组件控制和管理。

*getSnapshotBeforeUpdate*

此生命周期函数在最近一次渲染提交至 DOM 树之前执行，此时 DOM 树还未改变，我们可以在这里获取 DOM 改变前的信息，例如：更新前 DOM 的滚动位置。

它接收两个参数，分别是：prevProps、prevState，上一个状态的 props 和上一个状态的 state。它的返回值将会传递给 componentDidUpdate 生命周期钩子的第三个参数。

*使用场景：* 需要`获取更新前 DOM 的信息`时。例如：需要以特殊方式处理滚动位置的聊天线程等。

*componentDidUpdate*

在组件更新后立即调用，首次渲染不会调用该方法。它的执行时机和 componentDidMount 一致，只是 componentDidMount 在首次渲染时调用，而 componentDidUpdate 在后续的组件更新时调用。可以在这个生命周期中直接调用 `this.setState`，但是必须包裹在一个条件语句中，否则会导致死循环。

componentDidUpdate 接收三个参数，分别是 prevProps、prevState、snapshot，即：前一个状态的 props，前一个状态的 state、getSnapshotBeforeUpdate 的返回值。

如果组件实现了 getSnapshotBeforeUpdate 生命周期函数，则 getSnapshotBeforeUpdate 的返回值将作为 componentDidUpdate 的第三个参数。

**使用场景：**

在这个生命周期方法中，可以`对 DOM 进行操作`或者进行`网络请求`。

**componentWillUnmount**

这个生命周期函数会在组件卸载以及销毁之前调用。

*使用场景：* 通常用来执行组件的`清理操作`，例如：清除 timer、取消网络请求、清除订阅等。
# 笔记来源

[React 生命周期详解 - 掘金 (juejin.cn)](https://juejin.cn/post/7096137407409422344)

[【react】 手把手学习react - state 及组件的生命周期 - 掘金 (juejin.cn)](https://juejin.cn/post/7111693389921255455)
