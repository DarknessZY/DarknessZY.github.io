---
title: Vue2源码学习笔记（二）——编译模板原理
date: 2023-08-10 17:52
categories: vue2源码学习
tag: [vue] 
---
# 前言
> Vue 2的模板编译原理具体可以分为以下几步：  
>
> 1. 模板解析：Vue的编译器会将模板字符串解析成抽象语法树（AST），这个AST表示了模板的结构和内容。  
>   
> 2. 静态分析：编译器会对AST进行静态分析，检测模板中的指令、表达式和属性等，并生成相应的代码。  
>   
> 3. 优化处理：编译器会对模板进行优化处理，包括静态节点的标记、静态属性的提取和静态文本的优化等。这些优化可以减少运行时的开销，提高渲染性能。  
>   
> 4. 代码生成：根据AST生成可执行的渲染函数。渲染函数是一个JavaScript函数，它接收数据作为参数，并返回一个虚拟DOM节点。  
>   
> 5. 渲染函数执行：在组件实例化或数据更新时，会调用渲染函数来生成虚拟DOM节点。渲染函数会根据数据的变化，生成新的虚拟DOM节点，并与旧的虚拟DOM节点进行比较，找出差异并更新实际的DOM。  

通过模板编译，Vue将模板转换为可执行的渲染函数，这样在组件实例化和数据更新时，可以快速生成和更新虚拟DOM节点，从而实现高效的视图更新。编译过程中的优化处理可以减少不必要的计算和操作，提高渲染性能。同时，模板编译也提供了更简洁、易读和可维护的模板语法，使开发者能够更方便地编写和维护Vue组件的模板。

简单的例子看看图一乐吧：
```js
// 假设有一个名为parseTemplate的函数，用于将模板解析成AST
function parseTemplate(template) {
  // 解析模板，生成AST
  // 省略具体实现
  return ast;
}

// 假设有一个名为optimize的函数，用于优化AST
function optimize(ast) {
  // 优化AST
  // 省略具体实现
  return optimizedAst;
}

// 假设有一个名为generateCode的函数，用于根据AST生成代码
function generateCode(ast) {
  // 根据AST生成代码
  // 省略具体实现
  return code;
}

// 假设有一个名为compileTemplate的函数，用于编译模板
function compileTemplate(template) {
  // 解析模板，生成AST
  const ast = parseTemplate(template);

  // 优化AST
  const optimizedAst = optimize(ast);

  // 根据AST生成代码
  const code = generateCode(optimizedAst);

  // 返回生成的代码
  return code;
}

// 示例使用
const template = `
  <div>
    <h1>{{ title }}</h1>
    <p v-if="showMessage">{{ message }}</p>
    <button @click="handleClick">Click me</button>
  </div>
`;

const compiledCode = compileTemplate(template);
console.log(compiledCode);
```
接下来我们看看具体室怎么实现的吧。
## 1.模板编译入口
上篇响应式原理中就说过中initMixin不仅仅会对初始化状态，还会在这个时候调用`$mount`方法进行挂载，vue也是在这个地方对模版进行编译的。
```js
// src/init.js

import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 这里的this代表调用_init方法的对象(实例对象)
    //  this.$options就是用户new Vue的时候传入的属性
    vm.$options = options;
    // 初始化状态
    initState(vm);

    // 如果有el属性 进行模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  // 这块代码在源码里面的位置其实是放在entry-runtime-with-compiler.js里面
  // 代表的是Vue源码里面包含了compile编译功能 这个和runtime-only版本需要区分开
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    // 如果不存在render属性
    if (!options.render) {
      // 如果存在template属性
      let template = options.template;

      if (!template && el) {
        // 如果不存在render和template 但是存在el属性 直接将模板赋值到el所在的外层html结构（就是el本身 并不是父元素）
        template = el.outerHTML;
      }

      // 最终需要把tempalte模板转化成render函数
      if (template) {
        const render = compileToFunctions(template);
        options.render = render;
      }
    }
  };
}
```
首先需要对模板进行转化，**其中核心方法就是compileToFunctions。**

```js
// src/compiler/index.js

import { parse } from "./parse";
import { generate } from "./codegen";
export function compileToFunctions(template) {
  // 我们需要把html字符串变成render函数
  // 1.把html代码转成ast语法树  ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  // 很多库都运用到了ast 比如 webpack babel eslint等等
  let ast = parse(template);
  // 2.优化静态节点
     if (options.optimize !== false) {
       optimize(ast, options);
     }

  // 3.通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast);
  //   使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}

```

## 2.模板解析
解析Html并生成ast

-   首先需要各种规则匹配的正则表达式（开始标签，结束标签，花括号等）

-   createASTElement：将某一节点转为AST对象的函数

-   handleStartTag: 处理开始标签的函数

-   handleEndTag：处理结尾标签的函数

-   handleChars：处理文本节点的函数

-   parse：转AST的入口函数

```js
// src/compiler/parse.js

// 以下为源码的正则  对正则表达式不清楚的同学可以参考小编之前写的文章(前端进阶高薪必看 - 正则篇);
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

let root, currentParent; //代表根节点 和当前父节点
// 栈结构 来表示开始和结束标签
let stack = [];
// 标识元素和文本type
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;
// 生成ast方法
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null,
  };
}

// 对开始标签进行处理
function handleStartTag({ tagName, attrs }) {
  let element = createASTElement(tagName, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element);
}

// 对结束标签进行处理
function handleEndTag(tagName) {
  // 栈结构 []
  // 比如 <div><span></span></div> 当遇到第一个结束标签</span>时 会匹配到栈顶<span>元素对应的ast 并取出来
  let element = stack.pop();
  // 当前父元素就是栈顶的上一个元素 在这里就类似div
  currentParent = stack[stack.length - 1];
  // 建立parent和children关系
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element);
  }
}

// 对文本进行处理
function handleChars(text) {
  // 去掉空格
  text = text.replace(/\s/g, "");
  if (text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text,
    });
  }
}

// 解析标签生成ast核心
export function parse(html) {
  while (html) {
    // 查找<
    let textEnd = html.indexOf("<");
    // 如果<在第一个 那么证明接下来就是一个标签 不管是开始还是结束标签
    if (textEnd === 0) {
      // 如果开始标签解析有结果
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        // 把解析好的标签名和属性解析生成ast
        handleStartTag(startTagMatch);
        continue;
      }

      // 匹配结束标签</
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        handleEndTag(endTagMatch[1]);
        continue;
      }
    }

    let text;
    // 形如 hello<div></div>
    if (textEnd >= 0) {
      // 获取文本
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      handleChars(text);
    }
  }

  // 匹配开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      //匹配到了开始标签 就截取掉
      advance(start[0].length);

      // 开始匹配属性
      // end代表结束符号>  如果不是匹配到了结束标签
      // attr 表示匹配的属性
      let end, attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        attr = {
          name: attr[1],
          value: attr[3] || attr[4] || attr[5], //这里是因为正则捕获支持双引号 单引号 和无引号的属性值
        };
        match.attrs.push(attr);
      }
      if (end) {
        //   代表一个标签匹配到结束的>了 代表开始标签解析完毕
        advance(1);
        return match;
      }
    }
  }
  //截取html字符串 每次匹配到了就往前继续匹配
  function advance(n) {
    html = html.substring(n);
  }
  //   返回生成的ast
  return root;
}
```
## 3.静态分析和优化处理

```js
 function optimize(ast,option) {
  // 遍历AST的所有节点
  traverse(ast, {
    // 对于每个元素节点
    ElementNode(node) {
      // 检查节点是否有静态属性
      if (hasStaticAttributes(node)) {
        // 标记节点为静态节点
        node.static = true;
      }
    },
    // 对于每个文本节点
    TextNode(node) {
      // 检查节点是否为静态文本
      if (isStaticText(node)) {
        // 标记节点为静态节点
        node.static = true;
      }
    }
  });

  return ast;
}

// 辅助函数：检查节点是否有静态属性
function hasStaticAttributes(node) {
  // 检查节点的属性是否都是静态的
  return node.attributes.every(attr => attr.static);
}

// 辅助函数：检查节点是否为静态文本
function isStaticText(node) {
  // 检查文本节点的内容是否是静态的
  return !/\{\{.*\}\}/.test(node.content);
}

// 辅助函数：遍历AST的所有节点
function traverse(ast, visitor) {
  function traverseNode(node) {
    // 调用对应节点类型的处理函数
    const handler = visitor[node.type];
    if (handler) {
      handler(node);
    }

    // 递归遍历子节点
    if (node.children) {
      node.children.forEach(traverseNode);
    }
  }

  traverseNode(ast);
}

// 示例使用
const ast = {
  type: 'ElementNode',
  tag: 'div',
  attributes: [
    { name: 'class', value: 'container', static: true },
    { name: 'id', value: 'app', static: true }
  ],
  children: [
    {
      type: 'TextNode',
      content: 'Hello, world!',
      static: true
    }
  ]
};

const optimizedAst = optimize(ast);
console.log(optimizedAst);
```
## 4.代码生成（将AST转换成render函数格式的数据）

```js
// src/compiler/gen.js

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配花括号 {{  }} 捕获花括号里面的内容

function gen(node) {
    if (node.type === 1) {
        // 元素节点处理
        return generate(node)
    } else {
        // 文本节点处理
        const text = node.text

        // 检测是否有花括号{{}}
        if (!defaultTagRE.test(text)) {
            // 没有的话直接返回 _v，创建文本节点
            return `_v(${JSON.stringify(text)})`
        }


        // 每次赋值完要重置defaultTagRE.lastIndex
        // 因为正则规则加上全局g的话，lastIndex会逐步递增，具体可以百度查一查正则的全局g情况下的test方法执行后的lastIndex
        let lastIndex = (defaultTagRE.lastIndex = 0);
        const tokens = []
        let match, index

        while ((match = defaultTagRE.exec(text))) {
            // 文本里只要还存在{{}}就会一直正则匹配
            index = match.index
            if (index > lastIndex) {
                // 截取{{xxx}}中的文本xxx
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }

            tokens.push(`_s(${match[1].trim()})`)


            // 推进lastIndex
            lastIndex = index + match[0].length

        }

        // 匹配完{{}}了，但是还有剩余的文本，那就还是push进去
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        // return _v函数创建文本节点
        return `_v(${tokens.join('+')})`
    }

}


// 生成render函数格式的code的函数
function generate(el) {
    const children = getChildren(el)
    const code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : "undefined"
        }${children ? `,${children}` : ""})`;;
    return code
}

// 处理attrs的函数
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]

        if (attr.name === 'style') {
            const obj = {}

            attr.value.split(';').forEach(item => {
                const [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, str.length)}}`
}

// 获取子节点，进行gen的递归
function getChildren(el) {
    const children = el.children
    if (children && children.length) {
        return `${children.map(c => gen(c)).join(',')}`
    }
}

module.exports = {
    generate
}
```
## 5.思维导图
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b825b31e0be4d74b8a7e368ffa573f2~tplv-k3u1fbpfcp-watermark.image?)
## 参考文章
[手写Vue2.0源码（二）-模板编译原理｜技术点评 - 掘金 (juejin.cn)](https://juejin.cn/post/6936024530016010276#heading-6)