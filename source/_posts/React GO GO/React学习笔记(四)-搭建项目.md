---
title: React学习笔记(四)-搭建项目
date: 2023-06-19 14:22
tags: [recat]
categories: recat
---

> 前面我已经把基础的东西学了，但还是缺点啥，自己得试着搭建一个react项目试试，实践出真知。

## 创建项目
我使用的是vite4.3+react18+zustand+antd创建的一个后台管理模板，主要也是为了巩固所学内容。

- vite创建react项目命令：`yarn create vite`,然后给项目起个名，选择react，选择TypeScript

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6569517e15448c1b6f5b5c9f0174ed3~tplv-k3u1fbpfcp-watermark.image?)

- 安装依赖：`yarn add`
- 运行：`yarn dev`,项目就启动起来了
## Husky+eslint+ prettier规范代码
具体可看我另一篇文章：[Husky+eslint+ prettier规范代码](https://juejin.cn/post/7233581502889443365)
## 相关配置
### 路径配置和vite兼容旧浏览器
vite兼容旧浏览器:安装插件 `yarn add @vitejs/plugin-legacy -D`
在vite.config.ts中
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteEslint from 'vite-plugin-eslint'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
export default defineConfig({
  plugins: [
    react(),
    viteEslint({
      failOnError: false
    }),
    /** 兼容传统浏览器*/
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
})
```
### 添加.env配置文件
根目录下添加.env.production
```ts
VITE_APP_ENV = 'production'
VITE_BASE_URL = '/'
VITE_API_URL = '/'
```
根目录下添加.env.development

```js
VITE_APP_ENV = 'development'
VITE_BASE_URL = '/'
VITE_API_URL = '/'
```
## 安装需要的插件和依赖
### recat路由
- 安装react路由:`yarn add react-router-dom@latest`
在src下新建router/lazyLoad.tsx

```ts
import { Suspense } from 'react'

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}
export default lazyLoad
```
在router/index.tsx

```ts
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import lazyLoad from './lazyLoad'
import Layout from '@/layouts/index'
import IsloginStatus from '@/components/auth/loginStatus'
import Login from '@/views/login'

const Home = lazy(() => import('@/views/home'))
const About = lazy(() => import('@/views/aboutMy/about'))
const Study = lazy(() => import('@/views/aboutMy/study'))
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <IsloginStatus>
        <Layout />
      </IsloginStatus>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: '/home',
        element: lazyLoad(Home)
      },
      {
        path: '/about',
        children: [
          {
            index: true,
            element: <Navigate to="/about/study" replace />
          },
          {
            path: 'study',
            element: lazyLoad(Study)
          },
          {
            path: 'aboutMy',
            element: lazyLoad(About)
          }
        ]
      }
    ]
  }
]

export default createBrowserRouter(routes, {
  basename: '/'
})

```
### zustand
- 安装zustand:`zustand一款简洁好用的状态管理库` `yarn add zustand`
1.  在 src 目录下新建 stores 文件夹，添加 counter.ts 文件：

```ts
import { create } from 'zustand'

interface CounterState {
  counter: number
  delcounter: number
  increase: (by: number) => void
  decrease: (by: number) => void
}

const useCounterStore = create<CounterState>()((set) => ({
  counter: 0,
  delcounter: 10,
  increase: (by) => set((state) => ({ counter: state.counter + by })),
  decrease: (by) => set((state) => ({ delcounter: state.delcounter - by }))
}))

export default useCounterStore

```
src/home/index.tsx，在home组件中使用

```js
import useCounterStore from '@/store/counter'
import styles from './index.module.scss'
const Home = () => {
  const counter = useCounterStore((state) => state.counter)
  const delcounter = useCounterStore((state) => state.delcounter)
  const increase = useCounterStore((state) => state.increase)
  const decrease = useCounterStore((state) => state.decrease)
  return (
    <div className={styles.home_content}>
      <div>zustand状态管理小练习</div>
      <button onClick={() => increase(1)}>增加 counter:{counter}</button>
      <button onClick={() => decrease(1)}>减少 counter:{delcounter}</button>
    </div>
  )
}

export default Home
```
效果如下：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddc61eaddbf3426194cf09f235cdba4e~tplv-k3u1fbpfcp-watermark.image?)
### Antd
- 安装Antd:`yarn add antd`

 具体使用就不详述了，还是看官网去吧：[Ant Design - 一套企业级 UI 设计语言和 React 组件库](https://ant.design/index-cn)
### axios
- 安装Axios: `yarn add axios`

在 src 中添加 utils/https.ts 封装一下 axios

```ts
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import lazyLoad from './lazyLoad'
import Layout from '@/layouts/index'
import IsloginStatus from '@/components/auth/loginStatus'
import Login from '@/views/login'

const Home = lazy(() => import('@/views/home'))
const About = lazy(() => import('@/views/aboutMy/about'))
const Study = lazy(() => import('@/views/aboutMy/study'))
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <IsloginStatus>
        <Layout />
      </IsloginStatus>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: '/home',
        element: lazyLoad(Home)
      },
      {
        path: '/about',
        children: [
          {
            index: true,
            element: <Navigate to="/about/study" replace />
          },
          {
            path: 'study',
            element: lazyLoad(Study)
          },
          {
            path: 'aboutMy',
            element: lazyLoad(About)
          }
        ]
      }
    ]
  }
]

export default createBrowserRouter(routes, {
  basename: '/'
})

```
### SWR
SWR 是一个 React Hooks 库，它用于管理组件的数据获取和缓存。使用 SWR 可以方便地进行数据获取和处理，同时也有良好的缓存机制，可以减少对服务器的请求。

如果你正在使用 React，那么可以考虑采用 SWR。SWR 很容易安装和使用，并且可以与其他 React 库和组件配合使用。SWR 还支持多种数据源，包括 RESTful APIs、GraphQL、WebSocket 等。

要使用 SWR，你需要先安装它。可以使用 npm 或者 yarn 进行安装：

```ts
yarn add swr
```
安装完成后，就可以在 React 组件中使用 SWR。例如：
在api/hotNewApi
```ts
import useSWR from 'swr'
import { httpClient } from '@/utils/https'
export const useFetchHotNews = (type: string) => {
  const { data, isValidating, error } = useSWR(
    `/new?type=${type}`,
    (url) => httpClient.get(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  return {
    hotNews: data?.data.list,
    isValidating,
    error
  }
}
```
使用

```js
import { useFetchHotNews } from '@/api/hotNewsApi'
const { hotNews, isValidating, error } = useFetchHotNews('入参')
```

**swr中需要了解的属性`isValidating`**

`isValidating` 是 SWR 中一个非常有用的属性，它表示当前请求是否仍在进行中，即请求是否仍在等待服务器响应。

在使用 SWR 进行数据请求时，SWR 会首先在本地缓存中查找数据，如果缓存不存在或已经过期，则会发送一个新的请求，并标记 `isValidating` 为 `true`，表示请求正在进行中。当响应到达后，SWR 会将 `data` 更新为最新的响应数据，并将 `isValidating` 标记为 `false`，表示请求已经完成。

因此，我们可以利用 `isValidating` 属性来显示一个 loading 状态，告诉用户请求正在进行中，例如：

```jsx
import useSWR from 'swr';

function Profile() {
  const { data, error, isValidating } = useSWR('/api/user', fetch);

  if (error) return <div>Failed to load user data</div>;
  if (!data && isValidating) return <div>Loading...</div>;
  if (!data) return <div>No data available.</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

在这个例子中，我们根据数据、错误和 `isValidating` 来判断组件应该显示的内容。如果数据不存在且请求正在进行中，我们会显示 "Loading..."，否则就是显示错误信息或最终的数据。
## 总结
整完之后的项目源码：
[Recat-vite (github.com)](https://github.com/DarknessZY/Recat-vite.git) 该项目的账号密码随便填，没做校验。

通过一系列的学习，现在能用react完成一些普通的功能，也跟着大佬的文章熟悉了react搭建项目的过程，个人感觉和vue搭建时差不多，果然熟悉了一个框架后，再去了解另一个框架，上手也会快些，类比着学习，也能明确感受到他们的区别，也算成功入门了react，提升了自己。就是目前公司都是vue的项目，可能没真实线上的项目练手了，后面再工作之余也只能去github上找一些好的开源项目练练手了。
# 笔记来源
[react@18 + vite@4 + react-router@6 + zustand + antd@5 + axios + swr 保姆级搭建后台管理系统 - 掘金 (juejin.cn)](https://juejin.cn/post/7237840998985072698#heading-2)
