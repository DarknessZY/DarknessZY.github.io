---
title: element-plus表格合并（例如前两列合并）
date: 2023-07-19 15:45
tags: [项目搭建,element]
categories: 项目搭建
---
<!-- <meta name="referrer" content="no-referrer" /> -->
# 前言

> 做了一个后台管理日清的列表，不上线，只发布到测试环境，只供开发人员自己看的，方便了解啥时候结束联调，测试，上线等，其中有一个表格合并的功能做一下记录
## 核心代码
```js
<template>
  <div>
    <el-table :data="dataList" :span-method="objectSpanMethod">
      <el-table-column label="日期" prop="createTime"></el-table-column>
      <el-table-column label="业务线" prop="projectType"></el-table-column>
      <!-- 其他列定义 -->
    </el-table>
  </div>
</template>
```
```ts
const  objectSpanMethod =({ row, column, rowIndex, columnIndex })=> {
const dataList = [.....] //具体的表格数据
//columnIndex列,前两列
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0 || (rowIndex > 0 && row[column.property] !==dataList[rowIndex - 1][column.property])) {
          let rowspan = 1;
          let colspan = 1;
          let i = 1;
          while (
            rowIndex + i < dataList.length &&
            row[column.property] === dataList[rowIndex + i][column.property]
          ) {
            rowspan++;
            i++;
          }
          return { rowspan, colspan };
        } else if (row[column.property] === dataList[rowIndex - 1][column.property]) {
          return { rowspan: 0, colspan: 0 };
        }
}
```
## 具体思路逻辑

1.  首先，我们检查当前列 `columnIndex` 是否为 0 或者 1，以确定我们只对前两列进行合并操作。

1.  对于第一行（`rowIndex === 0`），我们返回 `{ rowspan: 1, colspan: 1 }`，表示不进行合并。

1.  对于其他行（`rowIndex > 0`），我们根据合并逻辑进行判断。

    -   首先，我们检查当前单元格的值 `row[column.property]`（例如，对于 “日期” 列，我们通过 `column.property` 访问 `createTime` 属性）是否与上一行的值相同，以及当前列是否为 “日期” 或者与上一行的 “业务线” 相同。如果满足这些条件，说明需要进行合并，我们返回 `{ rowspan: 0, colspan: 0 }`，表示该单元格不需要合并。
    -   如果不满足上述条件，我们开始计算正确的合并范围。我们初始化 `rowspan` 为 1，`colspan` 为 1，并使用变量 `i` 设置初始值为 1。
    -   接下来，我们使用一个循环，来寻找连续相同数据的范围。在循环中，我们依次检查当前行之后的每一行，判断它们的值是否与当前行相同，并且在 “日期” 列或者与当前行的 “业务线” 相同时。如果满足这些条件，我们将 `rowspan` 值增加 1，并递增 `i`。
    -   最后，我们返回计算出的 `{ rowspan, colspan }` 值，表示正确的合并范围。

通过这些逻辑，我们可以准确地合并相同数据的行，并保持表格的正确展示。

## 效果图

![17772e34eae0873ab9b82504c5657df_mosaic.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1afcad0bcd8541a3856a5a023608a345~tplv-k3u1fbpfcp-watermark.image?)

