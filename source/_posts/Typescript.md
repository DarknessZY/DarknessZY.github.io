---
title: TS基础
date: 2022-09-22 18:12
categories: Web前端学习
tag: [TypeScript,js] 
---

### 一、基础类型

1.布尔类型

```
let bool: boolean;
bool = false;
bool = 123; // Error：不能将类型“number”分配给类型“boolean”。
```

2.数值类型

```
let num：number = 123
```

3.字符串类型

```
let str: string;
str = 'bac';
str = `数值是${num}`;
```

4.数组类型

```
let arr1: number[];
arr1 = [1, 2, 3];

let arr2: Array<number>;
arr2 = [1, 2, 3];

let arr3: (string | number)[];
arr3 = [1, '2', 3];
```

5.元组类型

```
let tuple: [string, number, boolean];
tuple = ['a', 1, false]; // 必须按照上面的顺序和类型
tuple = ['a', false, false]; // Error：不能将类型“boolean”分配给类型“number”。
tuple = ['a', 1, false, 12]; // Error：不能将类型“[string, number, false, number]”分配给类型“[string, number, boolean]”。
```

6.枚举类型

```
enum Roles {
  SUPER_ADMIN, // 0
  ADMIN, // 1
  USER // 2
}
console.log(Roles.SUPER_ADMIN); // 0
console.log(Roles[Roles.SUPER_ADMIN]); // SUPER_ADMIN
```

7.any类型

```
let value: any;
value = 'abc'
value =2
value = [1,2,3]
let arr: any[] = [1,'a']
```

8.void类型

```
const consoleText = (text: string): void => { // 不返回内容
  console.log(text);
};
let v: void;
v = undefined;
v = null; // tsconfig的strict需要关掉
```

9.null和undefined

null 和 undefined 是其他类型的子类型

10.never类型

表示永远不存在的类型，抛错or死循环，返回值就是 never 类型。

```
const errorFunc = (message: string): never => {
  throw new Error(message);
};
const infiniteFunc = (): never => {
  while(true) {}
};
// let neverVariable: never
let neverVariable = (() => {
  while(true) {}
})();
```

11.对象类型

```
function getObject(obj: object): void {
  console.log(obj);
}
getObject({ name: 'dylan' });
getObject(123); // Error：类型“number”的参数不能赋给类型“object”的参数。
```

12.类型断言

值 as 类型

或 <类型>值

### 二、Symbol

Symbol值是独一无二的

```
const s1 = Symbol(); // Symbol()
const s2 = Symbol(); // Symbol()
s1 === s2; // false
```

目前来说工作上遇到的少

### 三、接口

我们可以使用接口来进行限制，使数据更加清晰直观

```
interface NameInfo {
  firstName?: string;//?代表可选参数，没?不传这个值会报错
  readonly lastName: string; //只读属性，不能更改NameInfo.lastName的值
}
const getFullName = ({ firstName, lastName }: NameInfo): string => {
  return `${firstName} ${lastName}`;
};
getFullName({
  firstName: 'haha',
  lastName: 'Lv'
});
```

多传入参数时使用类型断言或者索引签名

```
interface Vegetable {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetable) => {
  return `A ${color ? (color + ' ') : ''}${type}`;
};
getVegetables({ type: 'tomato', size: 2 }); // Error：类型“{ type: string; size: number; }”的参数不能赋给类型“Vegetable”的参数。
```

```
//类型断言
getVegetables({ type: 'tomato', size: 2 } as Vegetable);

//索引签名
interface Vegetable {
  color?: string;
  type: string;
  [prop: string]: any; // 索引签名
}
getVegetables({ type: 'tomato', size: 2 });
```

定义函数结构

```
// 等同于类型别名：type AddFunc = (num1: number, num2: number) => number;
interface AddFunc {
  (num1: number, num2: number): number
}
const add: AddFunc = (n1, n2) => n1 + n2;
```

索引类型

```
interface RoleDic {
  [id: number]: string;//id这个索引只能为数值类型
}  
```

接口的继承

```
interface Vegetables {
  color: string;
}
interface Tomato extends Vegetables {
  radius: number;
}
const tomato: Tomato = {
  radius: 1,
  color: 'red'
};
```

### 四、泛型 T

为什么要用泛型？ 可以在函数调用时自由化传入的值和返回的值

使用范型约束函数类型：与之前不同的地方在于多了 T 这个泛型参数，可以理解为这个函数：传入了 T（某个类型）作为 value 的类型，返回由 T组成的数组

```
//<T> 表示声明一个表示类型的变量，Value: T 表示声明参数是 T 类型的，后面的 : T 表示返回值也是 T 类型的
const getArray = <T>(value: T, times: number = 5): T[] => {
  return new Array(times).fill(value)
} //如果使用any[]参数也可以任意传，但是也丢失了类型检测的功能

//第一个T为string，那么value: T也该为string
getArray<string>('abc').map(item => item.length); // [3, 3, 3, 3, 3]
```

使用两个范型变量

```
// 参数1是T类型，参数2是U类型，返回类型是元组类型 T,U组成的数组
const getArray = <T, U>(param1: T, param2: U, times: number): [T, U][] => {
  return new Array(times).fill([param1, param2]);
};
// 也可以明确泛型调用，不明确的话，TS会自动推导泛型类型：getArray<number, string>(1, 'a', 3);
getArray(1, 'a', 3); // [[1, 'a'], [1, 'a'], [1, 'a']]
```

<br/>

### 五、交叉类型

交叉类型就是取多个类型的并集，使用 & 符号定义。

```
const mergeFunc = <T, U>(arg1: T, arr2: U): T & U => {
  let res = {} as T & U; // 使用类型断言来告诉TS这里是（T和U）的交叉类型
  res = Object.assign(arg1, arr2);
  return res;
};
mergeFunc({ a: 'a' }, { b: 'b' });
```