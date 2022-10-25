---
title: vite 搭建vue3项目（二）
date: 2022-10-25 18:52
categories: 项目搭建
tag: [vite,vue3,pinia] 
---

# 1.login页面和功能就不多哔哔了

# 2.主体布局

![dd7860edba87d1d65d1c03b81f01f4c6.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51e77c74aeb743b5a9e159607d1eb0e6~tplv-k3u1fbpfcp-watermark.image?)
layout->index.vue

  


```
<template>
   <el-container>
        <el-aside>
            <Menu />
        </el-aside>
        <el-container>
            <el-header>
            </el-header>
            <el-main>
            //mian开发中
                <!-- <router-view v-slot="{ Component, route }">
                    <transition appear name="fade-transform" mode="out-in">
                        <keep-alive :include="cacheRouter">
                            <component :is="Component" :key="route.path"></component>
                        </keep-alive>
                    </transition>
                </router-view> -->
            </el-main>
            <el-footer>
                <Footer />
            </el-footer>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import Footer from "./footer/index.vue";
import Menu from "./Menu/index.vue";
</script>

<style lang="scss" scoped>
    @import "./index.scss";
</style>
```

# 3.vite中的批量自动化导入：import.meta.globEager

如果想在vite中批量导入某些文件，实现项目的模块化，vite提供的import.meta.globEager函数就很好用

比如用在路由模块化：

1、需求：不想把路由文件全部放在一个文件里面，找的时候要拖动很麻烦，就想着把每一个模块的路由按功能分成单个的文件

2、思路：在routers文件夹内新增一个modules文件夹：里面放不同功能的routers文件，然后在vue引入的路由入口处批量导入模块化的routers

3、实现：

![87e7997f3c15921b398a37d928ac3a32.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9d6edc09e5e4e8fbb012d6155e3a5d1~tplv-k3u1fbpfcp-watermark.image?)

在router文件内批量引入modules内模块化的文件并处理：

```
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// * 导入所有router
//const metaRouters = import.meta.globEager("./modules/*.ts");
//最新vite应该是弃用了上面的，用下面的
const metaRouters:any = import.meta.glob('./modules/*.ts', { eager: true })
// * 处理路由表
export const routerArray: RouteRecordRaw[] = [];
Object.keys(metaRouters).forEach(item => {
    Object.keys(metaRouters[item]).forEach((key: any) => {
    //	routerArray.push(...metaRouters[item][key]);
    routerArray.push(metaRouters[item][key]);
    });
});

/**
 * @description 路由配置简介
 * @param path ==> 路由路径
 * @param name ==> 路由名称
 * @param redirect ==> 路由重定向
 * @param component ==> 路由组件
 * @param meta ==> 路由元信息
 * @param meta.requireAuth ==> 是否需要权限验证
 * @param meta.keepAlive ==> 是否需要缓存该路由
 * @param meta.title ==> 路由标题
 * @param meta.key	==> 路由key,用来匹配按钮权限
 * */
const routes: RouteRecordRaw[] = [
  ...routerArray,
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    strict: false,
    // 切换页面，滚动到最顶部
    scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
```

**注意 再使用时出现import.meta.globEager("./modules/*.ts");报错说什么弃用了，**

**去源码看标注：已弃用，使用这个什么代替**

**@deprecated Use `import.meta.glob('*', { eager: true })` instead**

# 4.侧边栏的开发和header里的侧边栏折叠(底部栏就不多bb)

## **侧边栏的开发**
主要是分为两部分，一部分是logo，一部分是路由菜单

logo是图片加文字，文字根据侧边栏折叠是否展示

**路由菜单**

```
    <el-scrollbar>
            <el-menu
                :default-active="activeMenu"
                :router="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                :unique-opened="true"
                background-color="#191a20"
                text-color="#bdbdc0"
                active-text-color="#fff"
            >
              //菜单项
                <SubItem :menuList="menuList" />
            </el-menu>
        </el-scrollbar>
```

首先需要获取菜单列表，一般是调用接口根据登录的这个用户的权限获取列表接口，暂时用得请求的json模拟后台接口数据，把菜单数据存到pinia中

```
onMounted(async () => {
    // 获取菜单列表
    loading.value = true;
    try {
        const res = await getMenuList();
        if (!res.data) return;
        // 把路由菜单处理成一维数组（存储到 pinia 中）
        const dynamicRouter = handleRouter(res.data);
        authStore.setAuthRouter(dynamicRouter);
        menuStore.setMenuList(res.data);
    } finally {
        loading.value = false;
    }
});
```

然后需要有默认激活菜单的index和菜单是否折叠 获取pinia里存着的菜单数据

```
//默认激活菜单的 index，当前路由对象的路径
const activeMenu = computed((): string => route.path);
//菜单是否折叠
const isCollapse = computed((): boolean => menuStore.isCollapse);
//菜单数据
const menuList = computed((): Menu.MenuOptions[] => menuStore.menuList);
```

```
// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref<number>(0);
const listeningWindow = () => {
    window.onresize = () => {
        return (() => {
            screenWidth.value = document.body.clientWidth;
            if (isCollapse.value === false && screenWidth.value < 1200) menuStore.setCollapse();
            if (isCollapse.value === true && screenWidth.value > 1200) menuStore.setCollapse();
        })();
    };
};
listeningWindow();
```

菜单项就是遍历菜单数据展示路由菜单信息（子组件需要defineProps<{ menuList: Menu.MenuOptions[] }>();）

```
<template v-for="subItem in menuList" :key="subItem.path">
        <el-sub-menu v-if="subItem.children && subItem.children.length > 0" :index="subItem.path">
            <template #title>
                <el-icon>
                    <component :is="subItem.icon"></component>
                </el-icon>
                <span>{{ subItem.title }}</span>
            </template>
            <SubItem :menuList="subItem.children" />
        </el-sub-menu>
        <el-menu-item v-else :index="subItem.path">
            <el-icon>
                <component :is="subItem.icon"></component>
            </el-icon>
            <template v-if="!subItem.isLink" #title>
                <span>{{ subItem.title }}</span>
            </template>
            <template v-else #title>
                <a class="menu-href" :href="subItem.isLink" target="_blank">{{ subItem.title }}</a>
            </template>
        </el-menu-item>
    </template>
<script setup lang="ts">
defineProps<{ menuList: Menu.MenuOptions[] }>();
</script>
```
## header里的侧边栏折叠开发
监控屏幕宽度或点击叠判断是否折叠

```
//菜单是否折叠
const isCollapse = computed((): boolean => menuStore.isCollapse);
//菜单数据
const menuList = computed((): Menu.MenuOptions[] => menuStore.menuList);
// 监听窗口大小变化，合并 aside
const screenWidth = ref<number>(0);
const listeningWindow = () => {
    window.onresize = () => {
        return (() => {
            screenWidth.value = document.body.clientWidth;
            if (isCollapse.value === false && screenWidth.value < 1200) menuStore.setCollapse();
            if (isCollapse.value === true && screenWidth.value > 1200) menuStore.setCollapse();
        })();
    };
};
```

# 5.vue-router 利用 $route 的 matched 属性实现面包屑效果

**matched 顾名思义 就是 匹配，假如我们目前的路由是/a/aa-01，那么此时 this.$route.matched匹配到的会是一个数组，包含 '/'，'/a'，'/a/aa-01'，这三个path的路由信息。然后我们可以直接利用路由信息渲染我们的面包屑导航。**

布局需要使用到el-breadcrumb ，和transition-group

```
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb" mode="out-in">
            <el-breadcrumb-item :to="{ path: HOME_URL }" key="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ path: item.path }">
                {{ item.meta.title }}
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { HOME_URL } from "@/config/config";
const route = useRoute();

const matched = computed(() => route.matched.filter(item =>item.meta && item.meta.title && item.meta.title !== "首页"));
</script>
```

TransitionGroup# 是一个内置组件，用于对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果。这样每次选择侧边栏的路由时，面包屑导航这边就感觉比较平滑的展示

# 6.后台管理系统顶部使用el-tag或el-tab实现浏览路由历史实现 （标签栏管理）

1.默认有首页，不能关闭

主要就是在tabs.ts的state的tabsMenuList写死,剩下的路由历史就是往这里面tabsMenuList添加数据，剩下的就在actions里面处理了，完成增加，移除，选择，路由历史的操作具体在下面

```
    state: (): TabsState => ({
        tabsMenuValue: HOME_URL,
        tabsMenuList: [{ title: "首页", path: HOME_URL, icon: "home-filled", close: false }]
    }),
```

2.点击侧边栏上路由菜单，判断有无存在，没有就添加同时定位到上面(也就是设置tabsMenuValue)，有就定位到上面

在actions里写

```
// Add Tabs
        async addTabs(tabItem: TabsOptions) {
            // not add tabs black list
            if (TABS_BLACK_LIST.includes(tabItem.path)) return;
            const tabInfo: TabsOptions = {
                title: tabItem.title,
                path: tabItem.path,
                close: tabItem.close
            };
            if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
                this.tabsMenuList.push(tabInfo);
            }
            this.setTabsMenuValue(tabItem.path);
        },
```

3.关闭当前页，自动跳到上一个tag页面

在actions里写

```
    // Remove Tabs
        async removeTabs(tabPath: string) {
            let tabsMenuValue = this.tabsMenuValue;
            const tabsMenuList = this.tabsMenuList;
            if (tabsMenuValue === tabPath) {
                tabsMenuList.forEach((item, index) => {
                    if (item.path !== tabPath) return;
                    const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
                    if (!nextTab) return;
                    tabsMenuValue = nextTab.path;
                    router.push(nextTab.path);
                });
            }
            this.tabsMenuValue = tabsMenuValue;
            this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
        },
```

4.选中标签 跳转到标签对应的路由

```
    // Change Tabs
        async changeTabs(tabItem: TabPaneProps) {
            this.tabsMenuList.forEach(item => {
                if (item.title === tabItem.label) router.push(item.path);
            });
        },
```

```
    <div class="tabs-box">
        <div class="tabs-menu">
            <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="removeTab">
                <el-tab-pane
                    v-for="item in tabsMenuList"
                    :key="item.path"
                    :path="item.path"
                    :label="item.title"
                    :name="item.path"
                    :closable="item.close"
                >
                    <template #label>
                        <el-icon class="tabs-icon" v-if="item.icon">
                            <component :is="item.icon"></component>
                        </el-icon>
                        {{ item.title }}
                    </template>
                </el-tab-pane>
            </el-tabs>
            //<MoreButton />
        </div>
    </div>
```

页面上具体使用的el-tabs实现

总结：

在store->modules->tabs.ts

```
import { defineStore } from "pinia";
import { TabPaneProps } from "element-plus";
import { TabsState } from "../interface";
import { HOME_URL, TABS_BLACK_LIST } from "@/config/config";
import piniaPersistConfig from "@/config/piniaPersist";
import router from "@/router/index";

// TabsStore
export const TabsStore = defineStore({
    id: "TabsState",
    state: (): TabsState => ({
        tabsMenuValue: HOME_URL,
        tabsMenuList: [{ title: "首页", path: HOME_URL, icon: "home-filled", close: false }]
    }),
    getters: {},
    actions: {
        // Add Tabs
        async addTabs(tabItem: TabsOptions) {
            // not add tabs black list
            if (TABS_BLACK_LIST.includes(tabItem.path)) return;
            const tabInfo: TabsOptions = {
                title: tabItem.title,
                path: tabItem.path,
                close: tabItem.close
            };
            if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
                this.tabsMenuList.push(tabInfo);
            }
            this.setTabsMenuValue(tabItem.path);
        },
        // Remove Tabs
        async removeTabs(tabPath: string) {
            let tabsMenuValue = this.tabsMenuValue;
            const tabsMenuList = this.tabsMenuList;
            if (tabsMenuValue === tabPath) {
                tabsMenuList.forEach((item, index) => {
                    if (item.path !== tabPath) return;
                    const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
                    if (!nextTab) return;
                    tabsMenuValue = nextTab.path;
                    router.push(nextTab.path);
                });
            }
            this.tabsMenuValue = tabsMenuValue;
            this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
        },
        // Change Tabs
        async changeTabs(tabItem: TabPaneProps) {
            this.tabsMenuList.forEach(item => {
                if (item.title === tabItem.label) router.push(item.path);
            });
        },
        // Set TabsMenuValue
        async setTabsMenuValue(tabsMenuValue: string) {
            this.tabsMenuValue = tabsMenuValue;
        },
        // Set TabsMenuList
        async setTabsMenuList(tabsMenuList: TabsOptions[]) {
            this.tabsMenuList = tabsMenuList;
        },
        // Close MultipleTab
        async closeMultipleTab(tabsMenuValue?: string) {
            this.tabsMenuList = this.tabsMenuList.filter(item => {
                return item.path === tabsMenuValue || item.path === HOME_URL;
            });
        },
        // Go Home
        async goHome() {
            router.push(HOME_URL);
            this.tabsMenuValue = HOME_URL;
        }
    },
    persist: piniaPersistConfig("TabsState")
});
```
# 最终效果图：

![46972a97567f3ff7c445d12b442ef7b1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db741d21a0a24e188a55a28b00466f4d~tplv-k3u1fbpfcp-watermark.image?)

# gitHub地址：
[vue3学习完成的后管模板](https://github.com/DarknessZY/zhangyao-management/tree/master)