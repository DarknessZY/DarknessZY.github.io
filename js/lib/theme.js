/* ============================================
   明暗主题切换
   默认黑夜；切换结果写入 localStorage，下次访问保持
   用事件委托绑在 document 上，避免 Vue 重渲染丢事件
   ============================================ */
(function () {
    var DEFAULT_THEME = "dark";
    var root = document.documentElement;

    function apply(theme, persist) {
        root.setAttribute("data-theme", theme);
        var link = document.getElementById("dark-style");
        // 浅色模式直接停用黑夜样式表，还原主题原本的浅色配色
        if (link) link.disabled = theme === "light";
        if (persist) {
            try {
                localStorage.setItem("theme", theme);
            } catch (e) {}
        }
        document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
    }

    var saved = DEFAULT_THEME;
    try {
        saved = localStorage.getItem("theme") || DEFAULT_THEME;
    } catch (e) {}
    apply(saved, false);

    // 事件委托：点击落在切换按钮（含子元素）上即触发，Vue 重建节点也不丢
    document.addEventListener("click", function (e) {
        var target = e.target.closest ? e.target.closest("[data-theme-toggle]") : null;
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        apply(next, true);
    });
})();
