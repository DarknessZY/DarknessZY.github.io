---
title: vue3常用指令封装使用
date: 2023-04-12 13:52
categories: 项目搭建
tag: [vite,vue3] 
---

# 前言
> 因为需求可能需要频繁发送验证码，文本复制等等的，将这些封装成指令使用是最方便的，自己记个笔记，方便以后要用或者新项目搭建时的时候，c+v大法（手动狗头）
## 节流指令 v-throttle

```js
/*
  需求：防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。

  思路：
    1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
    2、将需要触发的方法绑定在指令上
  
  使用：给 Dom 加上 v-throttle 及回调函数即可
  <button v-throttle="debounceClick">节流提交</button>
  因为用了el.disabled也就是dom元素的disabled的属性，没disabled属性得使用，是不生效得
*/
import type { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
	__handleClick__: () => any;
	disabled: boolean;
}
const throttle: Directive = {
	mounted(el: ElType, binding: DirectiveBinding) {
		if (typeof binding.value !== "function") {
			throw "callback must be a function";
		}
		let timer: NodeJS.Timeout | null = null;
		el.__handleClick__ = function () {
			if (timer) {
				clearTimeout(timer);
			}
			if (!el.disabled) {
				el.disabled = true;
				binding.value();
				timer = setTimeout(() => {
					el.disabled = false;
				}, 1000);
			}
		};
		el.addEventListener("click", el.__handleClick__);
	},
	beforeUnmount(el: ElType) {
		el.removeEventListener("click", el.__handleClick__);
	}
};

export default throttle;

```

## 防抖指令 v-debounce

```js
/**
 * v-debounce
 * 按钮防抖指令，可自行扩展至input
 * 接收参数：function类型
 */
import type { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
	__handleClick__: () => any;
}
const debounce: Directive = {
	mounted(el: ElType, binding: DirectiveBinding) {
		if (typeof binding.value !== "function") {
			throw "callback must be a function";
		}
		let timer: NodeJS.Timeout | null = null;
		el.__handleClick__ = function () {
			if (timer) {
				clearInterval(timer);
			}
			timer = setTimeout(() => {
				binding.value();
			}, 500);
		};
		el.addEventListener("click", el.__handleClick__);
	},
	beforeUnmount(el: ElType) {
		el.removeEventListener("click", el.__handleClick__);
	}
};

export default debounce;

```

## 长按指令 v-longpress

```js
/**
 * v-longpress
 * 长按指令，长按时触发事件
 */
import type { Directive, DirectiveBinding } from "vue";

const directive: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		if (typeof binding.value !== "function") {
			throw "callback must be a function";
		}
		// 定义变量
		let pressTimer: any = null;
		// 创建计时器（ 2秒后执行函数 ）
		const start = (e: any) => {
			if (e.button) {
				if (e.type === "click" && e.button !== 0) {
					return;
				}
			}
			if (pressTimer === null) {
				pressTimer = setTimeout(() => {
					handler(e);
				}, 1000);
			}
		};
		// 取消计时器
		const cancel = () => {
			if (pressTimer !== null) {
				clearTimeout(pressTimer);
				pressTimer = null;
			}
		};
		// 运行函数
		const handler = (e: MouseEvent | TouchEvent) => {
			binding.value(e);
		};
		// 添加事件监听器
		el.addEventListener("mousedown", start);
		el.addEventListener("touchstart", start);
		// 取消计时器
		el.addEventListener("click", cancel);
		el.addEventListener("mouseout", cancel);
		el.addEventListener("touchend", cancel);
		el.addEventListener("touchcancel", cancel);
	}
};

export default directive;

```

## 拖拽指令 v-draggable

```js
/*
	需求：实现一个拖拽指令，可在父元素区域任意拖拽元素。

	思路：
		1、设置需要拖拽的元素为absolute，其父元素为relative。
		2、鼠标按下(onmousedown)时记录目标元素当前的 left 和 top 值。
		3、鼠标移动(onmousemove)时计算每次移动的横向距离和纵向距离的变化值，并改变元素的 left 和 top 值
		4、鼠标松开(onmouseup)时完成一次拖拽

	使用：在 Dom 上加上 v-draggable 即可
	<div class="dialog-model" v-draggable></div>
*/
import type { Directive } from "vue";
interface ElType extends HTMLElement {
	parentNode: any;
}
const draggable: Directive = {
	mounted: function (el: ElType) {
		el.style.cursor = "move";
		el.style.position = "absolute";
		el.onmousedown = function (e) {
			let disX = e.pageX - el.offsetLeft;
			let disY = e.pageY - el.offsetTop;
			document.onmousemove = function (e) {
				let x = e.pageX - disX;
				let y = e.pageY - disY;
				let maxX = el.parentNode.offsetWidth - el.offsetWidth;
				let maxY = el.parentNode.offsetHeight - el.offsetHeight;
				if (x < 0) {
					x = 0;
				} else if (x > maxX) {
					x = maxX;
				}

				if (y < 0) {
					y = 0;
				} else if (y > maxY) {
					y = maxY;
				}
				el.style.left = x + "px";
				el.style.top = y + "px";
			};
			document.onmouseup = function () {
				document.onmousemove = document.onmouseup = null;
			};
		};
	}
};
export default draggable;

```

## 复制指令 v-copy

```js
/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import type { Directive, DirectiveBinding } from "vue";
import  { Toast }  from 'vant';
interface ElType extends HTMLElement {
	copyData: string | number;
	__handleClick__: any;
}
const copy: Directive = {
	mounted(el: ElType, binding: DirectiveBinding) {
		el.copyData = binding.value;
		el.addEventListener("click", handleClick);
	},
	updated(el: ElType, binding: DirectiveBinding) {
		el.copyData = binding.value;
	},
	beforeUnmount(el: ElType) {
		el.removeEventListener("click", el.__handleClick__);
	}
};

function handleClick(this: any) {
	const input = document.createElement("input");
	input.value = this.copyData.toLocaleString();
	document.body.appendChild(input);
	input.select();
	document.execCommand("Copy");
	document.body.removeChild(input);
    Toast({
        type: 'success',
        message: '复制成功',
      })
	
}

export default copy;

```

## 全局注册所有自定义指令
directivesIndex.ts：
```js
import { App } from "vue";
import copy from "./modules/copy";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import longpress from "./modules/longpress";

const directivesList: any = {
	copy,
	draggable,
	debounce,
	throttle,
	longpress
};

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach(key => {
			// 注册所有自定义指令
			app.directive(key, directivesList[key]);
		});
	}
};

export default directives;

```
## 在mian.ts引入并使用

```js
//引入
import directivesIndex from 'directivesIndex.ts的路径'

//使用
app.use(router).use(piniaStore).use(directivesIndex).mount('#app')
```
