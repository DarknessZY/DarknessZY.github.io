---
title: Skyline 渲染问题记录以及总结
date: 2026-09-20 17:53
tags: [随笔]
categories: 知识点
---

## Skyline 渲染模式下 scroll-view 高度塌缩

项目在 `app.json` 里全局启用了 **Skyline 渲染**（`"renderer": "skyline"`）。Skyline 和传统 WebView 渲染有个关键差异：

> **Skyline 下 `scroll-view` 不会自动按内容撑开高度，不显式设置高度就会塌缩为 0。** 

正好踩中了这个坑：

-   外层页面 scroll-view 设了 `height:100vh` → 正常显示
-   品牌区的 `.brand-scroll` 设了 `height: 60vh` → 正常显示
-   历史标签的 `.history-tags-wrapper` **没设高度** → 高度变 0，里面的标签和“暂无记录”全被压没了

不是数据问题，是整个容器高度为 0。

## Skyline 渲染模式 超一行无省略号
- 根因：Skyline 渲染下 text-overflow: ellipsis 仅 text 组件支持，view 上无效
- 修复：在使用了 text-overflow: ellipsi的 view 改为 text，wxss 加 display:block
- 项目教训：Skyline 下文本省略/截断必须用 text 组件 + display:block
## Skyline 渲染模式下 （豆腐块/错字）
- 现象：view→text 改造后，个别文字 出现 □ 豆腐块和错位字形，字符串里混入了控制字符/零宽字符/私有区字符这类“脏字符”（WebView 静默忽略脏字符，Skyline text 会画出来）
- 修复：新增 sanitizeDesc()（过滤控制字符/零宽字符/私有区/替换符 + 多余空白 + JS 侧截断 40 字兜底）


```js
const sanitizeDesc = (str, maxLen = 40) => {
  if (!str) return ''
  const cleaned = String(str)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // 控制字符
    .replace(/[\u200B-\u200D\uFEFF\u2028\u2029]/g, '')                     // 零宽字符/分隔符
    .replace(/[\uE000-\uF8FF]/g, '')                                       // 私有区字符（字体无字形→豆腐块）
    .replace(/\uFFFD/g, '')                                                // 替换符
    .replace(/\s+/g, ' ')
    .trim()
  if (maxLen && cleaned.length > maxLen) {
    return cleaned.slice(0, maxLen) + '...'
  }
  return cleaned
}
```