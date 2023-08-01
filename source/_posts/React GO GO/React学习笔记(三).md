---
title: React学习笔记(三)
date: 2023-06-13 14:22
tags: [recat]
categories: recat
---
<meta name="referrer" content="no-referrer" />

## 学习步骤

*   react-事件处理
*   受控组件和非受控组件
*   React Router

## react-事件处理

### **注册事件**

React注册事件与DOM的事件语法非常像。语法`on+事件名=｛事件处理程序｝` 比如`onClick={this.handleClick}`。React事件采用**驼峰命名法**，比如`onMouseEnter`, `onClick`。

```js
import React from 'react';

function MyComponent() {
  function handleClick() {
    console.log('Button clicked!');
  }

  return (
    <button onClick={handleClick}>Click me</button>
  );
}

export default MyComponent;

```

### **事件对象**

在React中，事件处理函数的第一个参数是事件对象（event object），它提供了一些关于事件的信息。例如，在一个点击事件处理函数中，事件对象将包含关于点击的位置、按下的键和其他信息。

```js
import React from 'react';

function handleClick(event) {
  console.log(event.target.textContent);
}

function App() {
  return (
    <div>
      <button onClick={handleClick}>Click Me!</button>
    </div>
  );
}

export default App;
```

### **react中this的指向问题**

在React中，函数组件和类组件具有不同的this指向方式。

在函数组件中，this指向`undefined`，因为`函数组件是无状态的`，它们不会在实例化过程中创建this。因此，在函数组件中，你应该使用Hooks API（如useState）管理组件状态，或使用redux（或其他状态管理库）管理全局状态。而在类组件中，this指向类的实例对象。在React类组件中访问props和state时，你必须使用this关键字。否则，你将在当前作用域中引用未定义的变量。

#### `this`丢失的问题（类组件开发时估计会遇到，我现在学时一直用的函数式组件开发，没遇上网上说的`this`丢失的问题，但也做个记录吧）

但如果你是vue开发者，估计遇到`this`丢失的问题，例如：

```js
class Demo extends Component{
    constructor(props){
        super(props)
    }
    handleClick(){
        console.log('this', this)
    }
    render(){
        return (
            <div>
                <button onClick={this.handleClick}>点我</button>
            </div>
        )
    }
}
ReactDOM.render(<Demo/>, document.getElementById('test'))
```

在`react`中，像上面这样写，在执行的时候我们就会找不到`this`的引用。 我们首先要了解，我们在类中定义的`handleClick`和`render`方式是定义在类的原型上了。只有类的实例对象才可以调用，且函数内部的`this`指向实例本身。 在`ReactDOM.render()`执行的时候，会帮我们`new`一个实例对象，并调用`render`方法，所以在`render`方法内部的`this`指向实例自身。但是`<button onClick={this.handleClick}>点我</button>`这里绑定的事件处理函数为`this.handleClick`方法的引用。但是当我们点击的时候，`handleClick`的执行上下文为`Window`，由于`jsx`经`babel`编译后会开启严格模式。所以`this`指向变为`undefined`。

#### 解决方式

**1.在构造函数中使用bind改变this的指向**

```js
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      count: this.state.count + 1
    });
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    );
  }
}
export default App;
```

上面实例中，我们通过将`this.handleClick`绑定到类实例上来保证该方法中的this指向正确。 在render方法中，使用`this.state`和`this.handleClick`访问计数器状态和点击处理程序

**2.使用箭头函数绑定事件**

```js
class Demo extends Component{

    handleClick(){
        console.log('this', this)
    }
    render(){
        return (
            <div>
                <button onClick={(e) => this.handleClick(e)}>点我</button>
            </div>
        )
    }
}
ReactDOM.render(<Demo/>, document.getElementById('test'))
```

`render`函数的`this`指向为实例自身，所以，我们可以直接在绑定的时候使用箭头函数，此时`handleClick`的执行上下文为箭头函数定义时的作用域。

**3.使用箭头函数定义实例方法**

```js
class Demo extends Component{

    // 该方法定义在实例对象，且执行上下文为实例自身
    handleClick = ()=>{
        console.log('this', this)
    }
    render(){
        return (
            <div>
                <button onClick={this.handleClick}>点我</button>
            </div>
        )
    }
}
ReactDOM.render(<Demo/>, document.getElementById('test'))

```

## 受控组件和非受控组件

在React中，表单元素（例如输入框、复选框、下拉框等）可以是“受控”组件或“非受控”组件。

### **受控组件**

受控组件是指受React控制的表单元素，其值通过React state来管理。在受控组件中每次用户输入时，都会更新组件状态并重新渲染组件（或更新虚拟DOM），从而反映表单元素的当前值。要使用受控组件，你需要将表单元素的值绑定到状态（state）并在改变时通过事件监听程序更新该状态。

### **非受控组件**

非受控组件是指值通过DOM节点本身管理的表单元素。在非受控组件中，组件自己掌控着输入框的值。非受控组件的值并不受React控制，所以React不会通过重新渲染来更新值。相反，您必须使用原生JavaScript来获取或设置组件的当前值。因此，在绝大多数情况下，我们都建议使用受控组件。

### **受控组件与非受控组件对比**

我们来看一个使用受控组件，以及一个使用非受控组件的示例：

```js
   import React, { useState } from 'react';

    function App() {
      const [value, setValue] = useState('');

      function handleChange(event) {
        setValue(event.target.value);
      }

      function handleSubmit(event) {
        event.preventDefault();
        console.log('You typed: ', value);
        setValue('');
      }

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" value={value} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    }

    export default App;

```

在这个示例中，我们定义了一个带有一个文本框和一个提交按钮的表单。文本框的值是一个受控组件，我们绑定它的值到状态变量`value`，每次文本变化时触发`handleChange`事件处理程序，`handleSubmit`处理表单的提交，把表单文本内容打印到控制台，并将状态`value`重置为空字符串。我们还可以通过使用非受控组件来改编相似的表单，但是将输入值传递给事件处理程序需要使用表单节点的引用来实现。如下所示：

```js
  import React, { useRef } from 'react';

    function App() {
      const inputRef = useRef(null);

      function handleSubmit(event) {
        event.preventDefault();
        console.log('You typed: ', inputRef.current.value);
        inputRef.current.value = '';
        inputRef.current.focus();
      }

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" ref={inputRef} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    }

    export default App;

```

在这个示例中，我们定义了一个带有一个文本框和一个提交按钮的表单。文本框是一个非受控组件，通过使用`ref`来获取其当前值。在`handleSubmit`事件处理程序中，我们将使用该方法记录输入值，并清空文本框，并将焦点设置回文本框中。

## React Router

### **什么是React router**

React Router是React的一个第三方库，它提供了一种利用组件 `<Route /> <Link />`等来定义路由的方式。通过React Router，开发者可以方便地实现路由控制，将不同的组件映射到不同的URL路径上，以达到构建单页应用的目的。React Router还提供了一些高级功能，如动态路由匹配、嵌套路由和程序性导航等。

### **安装使用React-Router**

`npm install react-router-dom@6`

如果在 web 上的话，你需要的是 `react-router-dom` 而不是 `react-router` 这个包。[它们的区别](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fremix-run%2Freact-router%2Fissues%2F4648 "https://github.com/remix-run/react-router/issues/4648")是，后者包含了 `react-native` 中需要的一些组件，如果你只需要做网页应用的话，用前者就可以了。

React Router 6 是 React Router 的下一个版本，与 React 18 兼容。它具有许多新功能和改进，包括全新的 Hooks API、对导航声明语法和后台路由的支持等。在 React 18 中使用 React Router 6，需要进行以下步骤：

1.  创建路由：在应用程序中定义路由。应用程序中可能有多种方式定义路由，例如通过 JavaScript 文件，或通过组件内部的以路径名为 key 的对象。

    Javascript 文件：

    ```js
    // routes.js
    import {Routes, Route} from 'react-router-dom';
    import {Home, About} from './pages';

    function AppRoutes() {
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      );
    }

    export default AppRoutes;
    ```

    组件内部：

    ```js
    // App.js
    import {Routes, Route} from 'react-router-dom';

    function App() {
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
        </Routes>
      );
    }

    export default App;
    ```

2.  定义页面组件：在应用程序中定义页面组件，与路由结合使用。

    ```js
    // pages/Home.js
    function Home() {
      return <h1>Home Page</h1>;
    }

    export default Home;

    // pages/About.js
    function About() {
      return <h1>About Page</h1>;
    }

    export default About;
    ```

3.  定义导航：在应用程序中定义导航栏，以便在视图之间导航。

    ```js
    // components/Nav.js
    import {Link} from 'react-router-dom';

    function Nav() {
      return (
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      );
    }

    export default Nav;
    ```

上述代码中，我们首先在 `routes.js` 文件中配置了两个路由，并通过 `element` 属性指定了路由所对应的组件。然后我们在组件中使用 `Routes` 和 `Route` 组件来设置路由，路径为 `/` 的路由对应 `Home` 组件，路径为 `/about` 的路由对应 `About` 组件。

最后我们在 `Nav` 组件中使用 `Link` 组件来完成页面之间的跳转。

需要注意的是，在 React Router 6 中，`<Switch>` 组件不再存在，取代它的是 `<Routes>` 组件，我们可以在 `<Routes>` 中定义多个路由，并在 `<Route>` 中设置 `path` 属性，React Router 6 会自动匹配路径，并渲染相应的组件。

### **React Router**

官网的介绍：

| 组件名         | 作用      | 说明                                          |
| ----------- | ------- | ------------------------------------------- |
| `<Routers>` | 一组路由    | 代替原有`<Switch>`，所有子路由都用基础的Router children来表示 |
| `<Router>`  | 基础路由    | Router是可以嵌套的，解决原有V5中严格模式，后面与V5区别会详细介绍       |
| `<Link>`    | 导航组件    | 在实际页面中跳转使用                                  |
| `<Outlet/>` | 自适应渲染组件 | 根据实际路由url自动选择组件                             |

| hooks名            | 作用                      | 说明                  |
| ----------------- | ----------------------- | ------------------- |
| `useParams`       | 返回当前参数                  | 根据路径读取参数            |
| `useNavigate`     | 返回当前路由                  | 代替原有V5中的 useHistory |
| `useOutlet`       | 返回根据路由生成的element        |                     |
| `useLocation`     | 返回当前的location 对象        |                     |
| `useRoutes`       | 同Routers组件一样，只不过是在js中使用 |                     |
| `useSearchParams` | 用来匹配URL中?后面的搜索参数        |                     |

# 笔记来源

[react笔记（四）—— 事件处理 - 掘金 (juejin.cn)](https://juejin.cn/post/7127277986667036685#heading-7)

[React-Router V6 使用详解(干货) - 掘金 (juejin.cn)](https://juejin.cn/post/7033313711947251743)
