/**
 * 文章图片懒加载
 * - after_post_render: 给 Markdown 渲染出的 <img> 加 loading="lazy" + decoding="async" + fetchpriority="low"
 * - 不影响 ParticleX preview.js 的点击预览（仅改加载时机，不改 src/click）
 * - 不影响首屏 loading.gif（那是 layout.ejs 里的，不在 post 渲染流程内）
 */
"use strict";

hexo.extend.filter.register("after_post_render", function (data) {
    if (!data.content) return data;

    // 跳过已经是 lazy 的，避免重复加；跳过 GIF（避免首屏动画被延后）
    data.content = data.content.replace(
        /<img(?![^>]*\sloading=)([^>]*)>/gi,
        function (match, attrs) {
            // 不给 gif 加 lazy（很多是动画，首屏就要看）
            if (/\.(gif)(\?|$)/i.test(attrs)) return match;
            return "<img" + attrs + ' loading="lazy" decoding="async" fetchpriority="low">';
        }
    );
    return data;
});
