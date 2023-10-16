---
title: 《Vue.js的设计与实现》阅读笔记（二）
date: 2023-10-14 16:36
tags: [图书笔记]
categories: 图书笔记
---

# 前言 

> 数接上文继续看《Vue.js的设计与实现》，第四章 响应系统的作用与实现部分内容笔记，老实说还有些地方不太通透，需要回头完善下

## 第四章 响应系统的作用与实现

### 1.响应式数据与副作用函数

副作用函数：函数的执行会直接或间接影响其他函数的执行


```
const obj = {text:'hello world'}
function effect() {
	//effect 函数的执行会读取 obj.text
document.body.innerText = obj.text
}
```

### 2.响应式数据的基本实现

*如何实现响应式数据集？*

如果我们能拦截一个对象的读取和设置操作，就能实现响应式，ES2015之前通过Object.defineProperty函数实现，这也是vue2.js采用的方式，在ES2015+中，我们可以使用代理对象Proxy来实现


```javaScript
// 存储副作用函数的桶
const bucket = new set()
// 原始数据
const obj = {text:'hello world'}
// 对原始数据代理
const obj = new Proxy(data,{
	get(target,key){
		// 将副作用函数effect添加到存储副作用函数的桶里
		bucket.add(effect)
		// 返回属性值
		return target[key]
	}
	set(target,key,newval) {
		// 设置属性值
		target[key] = newVal
		// 把副作用函数从桶里取出并执行
		bucket,forEach(fn=>fn())
		// 返回true代表设置操作成功
		retrun true	
	}
}
```


```javaScript
function effect() {
	document.body.innerText = obj.text
}
// 执行副作用函数，触发读取
effect()
// 1秒后修改响应式数据
setTimeout(()=>{
	obj.text = 'hello vue3'
},1000)
```

如上通过拦截一个对象的读取和设置操作，可以实现一个简单的响应式数据。

并有上面例子，一个响应式系统的工作流程：

当读取操作发生时，将副作用函数收集到‘桶’中;

当设置操作发生时，从‘桶’中取出副作用函数并执行

### 3.实现一个相对完善的响应式系统

首先，你可以使用 WeakMap 来创建一个存储响应式数据的桶。WeakMap 是一个键值对的集合，其中键是对象，值是任意类型的数据。由于 WeakMap 的键是弱引用，不会对对象的垃圾回收产生影响，适合用于存储响应式数据。

然后，你可以使用 Map 来构建一个依赖收集系统，用于追踪依赖关系。在 Vue 3 中，响应式数据变化时需要通知相关的依赖进行更新，而 Map 可以帮助我们记录依赖关系，并在数据变化时触发更新。

*如何使用 WeakMap 和 Map 来实现一个简单的响应系统？*

```js
// 创建一个全局的响应式数据桶
const reactiveMap = new WeakMap();

// 创建一个全局的依赖收集的 Map
const depMap = new Map();

// 通过该函数包装对象并实现响应化
function reactive(obj) {
  if (reactiveMap.has(obj)) {
    return reactiveMap.get(obj);
  }

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新
      trigger(target, key);
      return result;
    },
  });

  reactiveMap.set(obj, proxy);
  return proxy;
}

// 收集依赖
function track(target, key) {
  const depKey = getDepKey(target, key);
  if (depMap.has(depKey)) {
    const deps = depMap.get(depKey);
    if (!deps.has(activeEffect)) {
      deps.add(activeEffect);
    }
  } else {
    const deps = new Set([activeEffect]);
    depMap.set(depKey, deps);
  }
}

// 触发更新
function trigger(target, key) {
  const depKey = getDepKey(target, key);
  const deps = depMap.get(depKey);
  if (deps) {
    deps.forEach(effect => {
      effect();
    });
  }
}

// 获取依赖键
function getDepKey(target, key) {
  return `${target}-${key}`;
}

// 在此处定义一个全局变量，它将被用于存储当前的依赖
let activeEffect = null;

// 在你需要追踪依赖关系的代码块中，使用 effect 函数包裹
function effect(fn) {
  activeEffect = fn;
  fn(); // 第一次执行以收集依赖
  activeEffect = null;
}

// 示例实现

const state = reactive({ count: 0 });

effect(() => {
  console.log(`Count: ${state.count}`);
});

state.count++; // 触发更新并打印 "Count: 1"
```

我们使用了 `reactive` 函数来实现对象的响应化，`track` 函数用于收集依赖，`trigger` 函数用于触发更新。我们还使用了 `effect` 函数来包裹需要追踪依赖关系的代码块。

当 `state.count` 发生变化时，`trigger` 函数会触发更新，并执行相关的依赖函数，从而实现响应式的更新机制。

总结来说，使用 WeakMap 结合 Map 可以很好地构建一个相对完善的响应系统，在 Vue 3 中可以更高效地管理响应式数据和依赖关系。

### 4.分支切换与cleanup

分支切换导致冗余副作用函数进行不必要的更新。vue3中为了解决这个问题，我们需要在每次副作用函数执行之前，清除上一次建立的响应联系（笔记有待完善，没太懂这一块的）

### 5.避免无限递归循环

假如在同一个副作用函数中同时读取和设置某个响应式数据的值，会产生什么结果呢？

```js
effectRegister(() => {
    objProxy.count = objProxy.count + 1
})
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83c9ce09dace48ecb11d76a1ed096c6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=734&h=328&s=24906&e=png&b=fff9f9)
浏览器控制台报错了，出现无限递归循环，栈溢出了。

原因很明显了，首先读取objProxy.count，并把副作用函数存储到依赖中，紧接着又修改objProxy.count，把副作用函数取出来执行，其结果就是，副作用函数在自己内部递归调用自己，栈就溢出了。

解决方法：

通过分析可以发现，读取和设置操作都是在同一个副作用函数中进行的，此时无论track收集的副作用函数还是trigger要触发执行的副作用函数，其实都是同一个，也就是当前的 activeEffect。因此，可以增加守卫条件，当 trigger 要触发执行的副作用函数就是当前正在执行的副作用函数（activeEffect）时，则不触发执行。

```js
 function trigger (target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) {
      return
    }

    const deps = depsMap.get(key)
    const depsToRun = new Set(deps)
     deps && deps.forEach((effectFn) => {
      (effectFn !== activeEffect) && depsToRun.add(effectFn)
    })
    depsToRun && depsToRun.forEach(effectFn => effectFn())
  }
```

### 6.调度执行

*什么是可调度*

可调度性是响应式系统非常重要的特性。所谓可调度，指的是当trigger动作触发副作用函数重新执行时，`有能力决定副作用函数执行的时机、次数以及方式`

*调度器*

用户在调用 effectRegister 函数注册副作用函数时，可以传递第二个参数 options。options 中允许指定一个 scheduler 调度函数。

```js
effectRegister(() => {
    console.log(objProxy.count)
}, {
    // 调度器函数，fn是副作用函数
    scheduler (fn) {
        // 控制执行时机
    }
})
```

同时，在 effectRegister 函数中我们需要把 options 挂载到副作用函数上：

```js
function effectRegister (fn, options = {}) {
    const effectFn = () => {
      cleanup(effectFn)
      activeEffect = effectFn
      // 将当前副作用函数压入栈中
      effectStack.push(activeEffect)
      // 执行 fn(),进行依赖收集（track）  
      fn()
      // 执行完毕，弹出  
      effectStack.pop()
      // 让 activeEffect 始终指向栈顶的副作用函数，若effectStack中无值，则activeEffect还原为undefined
      activeEffect = effectStack[effectStack.length -1]
    }

    // 将 options 挂载到effectFn上
    effectFn.options = options
    effectFn.deps = []
    effectFn()
}
```

有了调度函数，我们在 trigger 函数中触发副作用函数重新执行时，就可以直接调用用户传进来的调度函数，从而把控制权交给用户：

```js
function trigger (target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) {
      return
    }

    const deps = depsMap.get(key)
    const depsToRun = new Set(deps)
     deps && deps.forEach((effectFn) => {
      (effectFn !== activeEffect) && depsToRun.add(effectFn)
    })
    depsToRun && depsToRun.forEach(effectFn => {
        // 存在调度器时，则调用调度器，由调度器决定执行 effectFn 的时机
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            effectFn(
            )
        }
    })
}
```

## 个人博客

[耀耀切克闹 (yaoyaoqiekenao.com)](https://yaoyaoqiekenao.com/)

## 其他相关文章

[《Vue.js的设计与实现》阅读笔记（一） - 掘金 (juejin.cn)](https://juejin.cn/post/7281192416077856820)