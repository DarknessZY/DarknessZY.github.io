---
title: React学习笔记(二)
date: 2023-06-06 14:24
tags: [recat]
categories: recat
---
<!-- <meta name="referrer" content="no-referrer" /> -->

# 前言

> 书接上文，React继续学习并记录笔记。本文有好多是问chatGPT得到的，chatGPT回答结合着例子，感觉更加通俗易懂些。

## 学习步骤

*   react hooks
*   组件间的传值
*   组件内常用的使用方式（类比vue，v-if，v-for试试例子）

## react hooks

### **什么是react hooks**

我去问了问chatGPT，回答如下：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34da3027f4f9455091486b9b0cabeaad~tplv-k3u1fbpfcp-watermark.image?)

### **react hooks解决了什么问题**

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc3b40969b0e4ebe911168439d38238c~tplv-k3u1fbpfcp-watermark.image?)
大概就是这三点，网上的回答也大同小异：

*   让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref ，也能做数据缓存。
*   解决逻辑复用难的问题
*   放弃面向对象编程，拥抱函数式编程

### **什么是自定义hooks**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef1cb12e0e241babe962e58bdea3abd~tplv-k3u1fbpfcp-watermark.image?)

### **常用的React hooks**

#### useState

useState 可以使函数组件像类组件一样拥有 state，函数组件通过 useState 可以让组件重新渲染，更新视图。

```js
const [ ①state , ②dispatchAction ] = useState(③initData)
```

① state，目的提供给 UI ，作为渲染视图的数据源。

② dispatchAction 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。

③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

```js
import { useState } from "react"

interface myInterface{
    name:string;
}

const DemoState = (props:myInterface) => {
    console.log(props)
    /* number为此时state读取值 ，setNumber为派发更新的函数 */
    let [number, setNumber] = useState(0) /* 0为初始值 */
    return (<div>
        {/* 这里展示的又是最新的值，因为在整个事件处理结束之后再重新渲染组件，此时state已经更新好的 */}
        <span>{ number }</span>  
        <button onClick={ ()=> {
        setNumber(number+1)
      console.log(number) /* 由于 useState 是异步的，点击时state还没有更新好，所以 console.log 同步输出的是上一次更新后的值，并不是最新的值。  */
    } } ></button>
    </div>)
}

export default DemoState

```

#### useRef

useRef 可以用来获取元素，缓存状态，接受一个状态 initState 作为初始值，返回一个 ref 对象, 这个对象上有一个 current 属性就是 ref 对象需要获取的内容。

```js
const ref = React.useRef(initState)
console.log(ref.current)
```

`useRef常用用法`：

*   useRef 获取 DOM 元素，在 React Native 中虽然没有 DOM 元素，但是也能够获取组件的节点信息,如下：

```js
const DemoUseRef = ()=>{
  const dom= useRef(null)
  const handerSubmit = ()=>{
    /*  <div >表单组件</div>  dom 节点 */
    console.log(dom.current)
  }
  return <div>
    {/* ref 标记当前dom节点 */}
    <div ref={dom} >表单组件</div>
    <button onClick={()=>handerSubmit()} >提交</button> 
  </div>
}

```

*   可以利用 useRef 返回的 ref 对象来保存状态，只要当前组件不被销毁，那么状态就会一直存在。具体如下：

1.  定义一个ref变量

```javascript
const myRef = useRef(null);
```

2.  使用myRef保存状态

```javascript
const [myState, setMyState] = useState(0);
useEffect(() => {
  myRef.current = myState;
}, [myState]);
```

上面的代码中，我们定义了一个名为myRef的ref变量，并在useEffect钩子函数中将myState保存到myRef中。这里要注意的是，因为myRef.current是一个可变的变量，所以当myState变化时，我们需要使用数组的解构赋值和useState钩子来更新myState的值。

3.  读取保存的状态

```javascript
console.log(myRef.current);
```

在组件的任何部分，我们都可以使用myRef.current来读取已经保存的状态。

最后需要说明的是，useRef保存的状态在每次重新渲染时都会持续存在，这意味着它可以在不同的渲染之间长期存储数据，而不像useState只会在当前的渲染周期中有效。所以如果需要保存状态并且不想在render时失去这个状态，可以用useRef钩子。

#### useEffect

React的useEffect钩子用于在React组件渲染完成后执行一些副作用操作，比如访问API、更新DOM等。它的作用类似于类组件中的生命周期函数。
useEffect具有三种执行方式：

**初始化渲染**

初始渲染在初始渲染时，useEffect会在组件挂载之后立即执行回调函数。如果指定了依赖项，React会检查每个依赖项是否发生变化，如果有，则重新执行回调函数。
三种依赖项：
-    1.`不传值`  `现象`: useEffect 会在第一次渲染以及每次更新渲染后都执行。
-    2.`空数组作为依赖`  `现象`:useEffect 会在第一次渲染后执行一次。
-    3.`基本类型作为依赖` `现象:`  useEffect 会在第一次渲染以及每次更新渲染后都执行。
  
具体可看：[React useEffect 两个参数你用对了吗 - 掘金 (juejin.cn)](https://juejin.cn/post/7083308347331444750#heading-9)

**更新渲染**

在组件更新时，useEffect会在所有更新完毕后执行回调函数。如果指定了依赖项，React会检查每个依赖项是否发生变化，如果有，则重新执行回调函数。


**卸载组件**

在组件卸载时，useEffect会执行清除副作用操作的回调函数。这种情况下不需要指定依赖项。

useEffect钩子接收两个参数，第一个参数是一个函数，这个函数包含需要执行的副作用操作，例如在钩子中访问API或者更新DOM。第二个参数是一个数组，它用来指定useEffect什么情况下需要重新运行。如果不需要重新运行，可以将数组参数留空。

**例子**

下面是一些useEffect的用例：

1.  访问API并更新状态

```javascript
import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get("https://api.example.com/data");
      setData(result.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}

export default App;
```

上面的代码中，我们在useEffect钩子中发起了一个axios的get请求，并将获取到的数据设置到data状态中。需要注意的是，由于我们在useEffect钩子函数中调用了async函数，所以我们需要在函数前面加上async关键字。

2.  监听props的变化并更新状态

```javascript
import React, { useState, useEffect } from "react";

function App(props) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setCounter(props.value);
  }, [props.value]);

  const handleClick = () => setCounter(counter + 1);

  return (
    <div>
      <p>{counter}</p>
      <button onClick={handleClick}>Increase</button>
    </div>
  );
}

export default App;
```

上面的代码中，我们使用了useEffect钩子和useState钩子，以响应props的变化并更新状态。钩子中的函数会在props.value改变时触发，它将props.value的值设置到counter变量中。

总的来说，useEffect是React中非常重要的一个钩子，它可以让我们更加容易地进行组件的副作用操作，并且可以防止我们在组件渲染完成前执行操作。

#### useMemo

React的useMemo钩子用于缓存函数的计算结果，以减少不必要的计算和渲染。它的作用范围更广，可以缓存任何复杂的计算结果。

useMemo接收两个参数，第一个参数是一个函数，这个函数包含需要执行的计算操作，例如根据props和状态计算出一个值或者过滤一些数据。第二个参数是一个数组，它用来指定这个函数依赖的数据，只有当依赖数据发生变化时才会重新计算缓存结果。如果依赖数据没有变化，则直接返回上一次计算的缓存结果。

下面是一些useMemo的用例：

1.  根据props和状态计算出一个值

```javascript
import React, { useMemo, useState } from "react";

function App(props) {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    console.log("Compute Result");
    return count * props.value;
  }, [count, props.value]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Value: {props.value}</p>
      <p>Result: {result}</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
    </div>
  );
}

export default App;
```

上面的代码中，我们使用了useMemo钩子来缓存计算结果，这个计算结果基于state变量count和props中的值计算而来。由于这个计算结果只依赖于count和props.value，所以只有count或props.value变化时，useMemo才会重新计算这个计算结果。同时，由于这个计算结果被缓存起来了，所以即使我们反复点击Increase Count按钮，计算结果也不会重新计算和渲染。

2.  从数组中过滤出存在某个字符的项

```javascript
import React, { useState, useMemo } from "react";

function App() {
  const [list, setList] = useState(["apple", "banana", "mango", "peach"]);
  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    console.log("Filter List");
    return list.filter((item) => item.includes(search));
  }, [list, search]);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <input value={search} onChange={handleChange} />
      <ul>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

上面的代码中，我们使用了useMemo钩子来缓存计算结果，这个计算结果被过滤离数组list中包含搜索关键词的项。由于这个计算结果只依赖于list和search变量，所以只有这两个变量发生变化时，useMemo才会重新计算。同样，由于这个过滤结果被缓存起来了，即使我们在搜索框中不断输入文字或者反复添加删除项，useMemo也只会在依赖变化时重新计算。

#### useLayoutEffect

React的useLayoutEffect钩子与useEffect类似，都是用于执行副作用操作，但是useLayoutEffect会在浏览器绘制之前执行，可以保证副作用操作对页面布局的影响被计算在内。

useLayoutEffect的使用方法和useEffect一样，都是接收一个函数和一个依赖数组。useLayoutEffect钩子的使用场景与useEffect相似，当需要在组件挂载或更新后立即执行一个副作用操作，以确保副作用操作对页面布局有影响时，可以使用useLayoutEffect。

下面是一个useLayoutEffect的用例：

```javascript
import { useState, useLayoutEffect, useRef } from "react";

function App() {
  const [width, setWidth] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
  }, []);

  return (
    <div>
      <h1 ref={ref}>Hello, World!</h1>
      <p>The width of the h1 element is {width}px.</p>
    </div>
  );
}

export default App;
```

上面的代码中，我们使用了useLayoutEffect钩子来获取h1元素的宽度，并将它保存到width状态变量中。由于useLayoutEffect钩子在DOM更新之前执行，在这个例子中，我们可以保证获取的宽度值是最新的，同时，由于我们使用useLayoutEffect钩子来获取宽度值，所以这个宽度值的更新不会导致额外的页面渲染。

#### useContext

React的useContext钩子用于获取React上下文的值。上下文可以理解为一个全局对象，其中保存了在组件树中被共享的数据。使用useContext可以使得在组件树的任何一个组件中都能够访问到上下文的值。

useContext接收一个上下文对象作为参数，并返回这个上下文对象的当前值。上下文对象在创建时由React.createContext函数创建。

下面是一个useContext的用例：

```javascript
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Parent />
    </ThemeContext.Provider>
  );
}

function Parent() {
  return <Child />;
}

function Child() {
  const theme = useContext(ThemeContext);

  return <div>Current theme is {theme}</div>;
}

export default App;
```

上面的代码中，我们创建了一个名为ThemeContext的上下文，它的默认值为"light"。在App组件中，我们使用ThemeContext.Provider提供了一个新的值"dark"，并将这个值传递给了Child组件。在Child组件中，我们使用了useContext钩子来获取当前的主题值，并将这个值显示在页面上。

需要注意的是，由于useContext只能在函数组件中使用，所以需要将上下文对象和Provider组件都放在函数组件外面或者使用React.memo包裹组件。另外，需要通过Context.Provider提供一个新值，以便在组件层次中下传下去。

#### useReducer

React的useReducer钩子用于管理和更新应用程序的状态，可与Redux架构相比。与useState（类似）不同之处在于，useState钩子通常用于管理状态值。useReducer则被视为管理复杂状态和操作的更好解决方案。

useReducer接收两个参数：一个是reducer函数，一个是初始状态值。reducer函数的作用是在更新状态之前处理一个操作（或动作），并且需要返回一个新的状态值。所得到的状态值将被作为useReducer钩子的返回值，同时，还将被传递到应用程序中的其他组件中。

下面是一个useReducer的用例：

```js
  import { useReducer } from "react";

    const initialState = {
        count: 0
    };

    function reducer(state, action) {
        switch (action.type) {
            case "increment":
                return { count: state.count + 1 };
            case "reset":
                return { count: initialState.count };
            default:
                throw new Error("Invalid action type");
        }
    }

    function App() {
        const [state, dispatch] = useReducer(reducer, initialState);

        return (
            <div>
                <p>Count: {state.count}</p>
                <button onClick={() => dispatch({ type: "increment" })}>Click to increment count: {state.count}</button>
                <button onClick={() => dispatch({ type: "reset" })}>Reset count</button>
            </div>
        );
    }

    export default App;

```

上面的代码中，我们使用了useReducer钩子来创建一个与状态相关的reduce函数。该reduce函数管理一个名为“count”的状态计数器。在组件中，我们显示此计数器状态的当前值，并将两个按钮连接到dispatch方法。第一个按钮将用于increment操作，第二个用于reset计数器。

需要注意的是，在dispatch方法中，我们使用action对象来通知reducer函数要执行什么样的操作。这个对象是一个简单的JavaScript对象，包含一个字符串类型的属性，表示操作类型（在本例中，我们使用“increment”和“reset”作为操作类型字符串）。

总之，useReducer是一种更好的状态管理解决方案，可以轻松地管理复杂的组件状态。

#### useImperativeHandle

useImperativeHandle 可以配合 forwardRef 自定义暴露给父组件的实例值。使得父组件能够通过ref获取到子组件的实例，并且调用这些自定义的API。通常用于实现一些跨组件的通讯，或者是对某些组件逻辑的封装，可以将它看成是将一些子组件的方法暴露给父组件来调用。

useImperativeHandle接收两个参数：一个Ref（引用）对象和一个返回一个对象的函数。返回的对象表示要暴露给父组件的API接口。父组件可以通过ref来调用这些自定义的方法。

下面是一个useImperativeHandle的用例：

```javascript
import { forwardRef, useImperativeHandle, useState } from "react";

const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    increment() {
      setCount(count + 1);
    },
    reset() {
      setCount(0);
    },
  }));

  return <div>Count: {count}</div>;
});

function App() {
  const childRef = useRef();

  function handleIncrement() {
    childRef.current.increment();
  }

  function handleReset() {
    childRef.current.reset();
  }

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;
```

上面的代码中，我们创建了一个名为Child的组件，它包含了一个名为“count”的状态计数器，并将它通过useImperativeHandle钩子暴露给了父组件。然后，我们使用forwardRef钩子将Child组件的ref引用传递给了App组件。在App组件中，我们使用ref来调用Child组件中的increment和reset方法。通过useImperativeHandle，我们可以在父组件中调用Child组件的自定义方法，实现了跨组件的通讯。

需要注意的是，如果你正在使用useImperativeHandle来暴露方法，则必须将子组件包装在forwardRef中，以便可以在父组件中使用ref引用。

### 实现一个自定义的React的自定义Hooks

可以采用以下步骤来创建一个自定义Hooks:

1.  创建一个以"use"开头的函数，这是React在命名约定中使用的方法，以通知其他程序员此函数是一个Hook；
2.  在函数中编写一些逻辑，可以使用现有的Hooks，如useState、useEffect;
3.  根据需要返回一些有用的值。

以下是一个简单的示例，它使用useState和useEffect自定义了一个计时器hooks：

```javascript
import { useState, useEffect } from "react";

function useTimer(initialTime) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return time;
}

export default useTimer;
```

上面的代码中，我们定义了一个名为useTimer的自定义Hooks，并使用useState和useEffect在内部实现了一个计时器的逻辑，以输出时间。这个自定义Hooks可以用于任何需要计时器的组件中，并使得代码的重复度更低。

使用自定义Hooks非常简单，只需要导入并使用即可。例如：

```javascript
import useTimer from "./useTimer";

function App() {
  const time = useTimer(0);

  return (
    <div>
      <p>Current Time: {time} seconds</p>
    </div>
  );
}

export default App;
```

在上面这个例子中，我们导入了自定义Hooks useTimer，并在App组件中调用了它。最终，我们成功地使用自定义Hooks来达到了逻辑复用的效果。

总之，自定义Hooks是非常有用的，可以让我们在函数组件之间共享逻辑，并且使得我们的代码更加简洁易懂。当多个组件需要相同的逻辑时，它可以提高代码的重用性和可维护性。

## 组件间的传值

### 父子组件传值

#### 父传子

在React中，父组件可以向子组件传递数据（props）以及函数作为回调来处理事件。在函数式组件中，可以通过参数的形式来接收父组件传递的props。

例如，父组件可以这样传递数据和函数：

```js
  function ParentComponent() {
      const data = { name: 'John', age: 30 };
      const handleClick = () => console.log('Button clicked');

      return (
        <ChildComponent data={data} onClick={handleClick} />
      );
    }
```

而在子组件中，可以使用props来接收这些参数：

```js
 function ChildComponent(props) {
      const { data, onClick } = props;

      return (
        <div>
          <p>Name: {data.name}</p>
          <p>Age: {data.age}</p>
          <button onClick={onClick}>Click me</button>
        </div>
      );
    }
```

在子组件中使用`props.xxx`即可获取父组件传递的数据或函数。这样，在子组件中就可以使用这些数据和函数来展示内容或处理事件了。

#### 子传父

在React中，在函数式组件中子组件向父组件传递数据的方式是通过回调函数，父组件将一个函数作为props传递给子组件，然后子组件在需要向父组件传递数据时，调用该函数并传递参数即可。具体实现方法如下：

父组件：

```jsx
import React, { useState } from 'react';
import Child from './Child';

function Parent() {
  const [message, setMessage] = useState('');

  function handleMessage(message) {
    setMessage(message);
  }

  return (
    <div>
      <h2>Parent Component</h2>
      <Child onMessage={handleMessage} />
      <p>Message from child: {message}</p>
    </div>
  );
}

export default Parent;
```

子组件：

```jsx
import React, { useState } from 'react';

function Child(props) {
  const [inputValue, setInputValue] = useState('');

  function handleInput(event) {
    setInputValue(event.target.value);
  }

  function sendMessage() {
    props.onMessage(inputValue);
  }

  return (
    <div>
      <h3>Child Component</h3>
      <input type="text" value={inputValue} onChange={handleInput} />
      <button onClick={sendMessage}>Send message to parent</button>
    </div>
  );
}

export default Child;
```

在上述代码中，父组件通过`onMessage`属性向子组件传递一个函数`handleMessage`，子组件触发`sendMessage`函数来传递参数`inputValue`给父组件。子组件通过调用`props.onMessage(inputValue)`来触发父组件中的回调函数`handleMessage`，实现了子组件向父组件传递数据的功能。

### 兄弟组件传值

在 React 中，兄弟组件之间的传值通常需要借助父组件作为中间层，通过向父组件传递数据再由父组件传递给另一个兄弟组件实现。同时，我们可以使用 `context API`、`Redux` 等方案进行数据管理。

总体思路：将状态共享，提升到最近的公共父组件中，由父组件管理状态

*   提升公共状态
*   提供操作共享状态的方法

```js
import React, { useState } from 'react';

function Parent() {
  const [message, setMessage] = useState('Hello, World!');

  function handleMessageChange(message) {
    setMessage(message);
  }

  return (
    <div>
      <Child1 onMessageChange={handleMessageChange} />
      <Child2 message={message} />
    </div>
  );
}

function Child1(props) {
  function handleChange(e) {
    props.onMessageChange(e.target.value);
  }

  return (
    <div>
      <input type="text" onChange={handleChange} />
    </div>
  );
}

function Child2(props) {
  return (
    <div>
      <p>{props.message}</p>
    </div>
  );
}
```

我们定义了一个名为 `Parent` 的组件作为中间层，分别传递给了 `Child1` 和 `Child2` 两个组件。`Child1` 的输入框可以让用户输入任意文本，并将文本内容通过 `props.onMessageChange` 传递给父组件 `Parent` 中的 `handleMessageChange` 方法进行处理。父组件 `Parent` 的 `handleMessageChange` 方法通过设置 `message` 的状态来记录下输入框中的文本。最后，将 `message` 状态通过 `props` 传递给 `Child2` 组件进行渲染。

需要注意的是，在实际开发中，如果组件之间关系比较紧密，或者组件之间需要频繁地传递数据，则建议考虑使用 `context API`、`Redux` 等方案进行数据管理，这样可以使代码更加简洁和易于维护。

总之，在 React 中，兄弟组件之间的传值需要通过父组件作为中间层来实现。可以通过 `props`、`context API`、`Redux` 等方式实现数据的传递和管理。

### 祖孙组件传值

Context 跨组件传递数据 【类似vue的 provide / inject】

1、首先，在父组件中创建一个 **Contex对象：**

```js
import React from 'react';
const MyContext = React.createContext();
```

2、然后，在需要共享数据的组件的父组件中，通过 **Provider** **提供数据：**

```js
import React from 'react';
import MyContext from './MyContext';

function ParentComponent() {
  const sharedData = 'Hello, world!';

  return (
    <MyContext.Provider value={sharedData}>
      <ChildComponent />
    </MyContext.Provider>
  );
}
```

3、最后，在需要访问共享数据的组件中，可以使用 **useContext** **获取数据：**

```js
import React, { useContext } from 'react';
import MyContext from './MyContext';

function ChildComponent() {
  const value = useContext(MyContext);

  return <div>{value}</div>;
}

```

## 组件内常用的使用方式（类比vue，v-if，v-for试试例子）

### 类比v-if，react里的实现dom元素的切换显示隐藏

在React中，你可以使用state来控制组件的显示和隐藏。下面是一个简单的代码示例来切换一个div元素的显示和隐藏：

```js
import React, { useState } from 'react';

function App() {
  const [show, setShow] = useState(false);

  function toggleDiv() {
    setShow(!show);
  }

  return (
    <div>
      <button onClick={toggleDiv}>Toggle Div</button>
      {show && <div>Some content to show</div>}
    </div>
  );
}

export default App;
```

初始状态设置为不显示元素。当按钮被点击时，`toggleDiv`函数会被调用并更新`show`状态，如果`show`为`true`，则显示div元素，否则隐藏div元素。在JSX中使用`{}`，可以将变量嵌入到标签中。如果`show`为`false`，则`{show && <div>Some content to show</div>}`的内容会被忽略。

### 类比v-if-else，react里的实现多个dom元素之间的显示隐藏

React中，并没有 `v-else` 指令，但可以通过JavaScript中的条件运算符 `ternary operator` （三元运算符）来实现类似的效果。

例如，假设有一个条件为 `showComponent` 的状态，当为 `true` 时渲染 `Component1`，否则渲染 `Component2`，可以这样编写：

```js
{ showComponent ? <Component1 /> : <Component2 /> }
```


上述代码中，`{}` 表示JSX中的JS表达式，其中使用三目运算符检查 `showComponent` 的状态，根据结果渲染相应的组件。

在React中也可以使用 `if-else` 语句来实现条件渲染，例如：

```js
let component;

if (showComponent) {
  component = <Component1 />;
} else {
  component = <Component2 />;
}

return (
  <div>
    {component}
  </div>
);
```

以上代码中，根据 `showComponent` 的状态来分配 `component` 的值，然后在JSX中渲染该组件。

### 类比v-for，实现列表遍历展示

在React中，你可以使用`map()`方法来遍历列表，并将列表项渲染到页面上。

```js
    import React from 'react';

    function App() {
      const list = ['item1', 'item2', 'item3'];

      return (
        <div>
          <h1>My List</h1>
          <ul>
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    export default App;
```

在这个示例中，`list`变量是一个包含三个字符串的数组。使用`map()`方法遍历数组，并为每个项创建一个`<li>`元素，并在元素中显示该项的值。`key`属性是必须的，并且必须是每个列表项的唯一标识符。在此示例中，使用`index`作为`key`属性，但更好的做法是使用每个项的唯一标识符。

# 笔记来源
[React useEffect 两个参数你用对了吗 - 掘金 (juejin.cn)](https://juejin.cn/post/7083308347331444750#heading-9)

[Vite+React+TS基础学习，看这里就够了！（上） - 掘金 (juejin.cn)](https://juejin.cn/post/7235279096312463421#heading-35)

[十分钟搭建一个 Vite+React+TS+ESLint+Prettier+Husky+Commitlint 项目 - 掘金 (juejin.cn)](https://juejin.cn/post/7123612981895626760#heading-5)
