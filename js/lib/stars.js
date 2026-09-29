/* ============================================
   星空背景特效
   全站固定的 canvas 星空层：星辰缓慢漂浮 + 近距离连线
   ============================================ */
(function () {
    var canvas = document.createElement("canvas");
    canvas.id = "stars-canvas";
    canvas.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.insertBefore(canvas, document.body.firstChild);

    var ctx = canvas.getContext("2d");
    var stars = [];
    var width = 0;
    var height = 0;
    var dpr = window.devicePixelRatio || 1;
    var running = true;
    var mouse = { x: -9999, y: -9999 };

    // 主题配色
    var themes = {
        dark: { dot: "rgba(255, 255, 255, 0.85)", line: "rgba(120, 170, 255, 0.28)", count: 130 },
        light: { dot: "rgba(90, 120, 160, 0.35)", line: "rgba(90, 130, 190, 0.12)", count: 60 },
    };
    var current = themes.dark;

    function currentTheme() {
        return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    }

    function applyTheme() {
        current = themes[currentTheme()];
        init();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
        resize();
        // 星星数量按屏幕面积自适应，移动端减半，保证性能
        var area = width * height;
        var base = Math.min(current.count, Math.round(area / 12000));
        var count = window.innerWidth < 768 ? Math.round(base / 2) : base;
        stars = [];
        for (var i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.4,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                o: Math.random() * 0.5 + 0.5,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x += s.vx;
            s.y += s.vy;

            // 越界回绕
            if (s.x < -10) s.x = width + 10;
            if (s.x > width + 10) s.x = -10;
            if (s.y < -10) s.y = height + 10;
            if (s.y > height + 10) s.y = -10;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = current.dot.replace(/[\d.]+\)$/, s.o.toFixed(2) + ")");
            ctx.fill();
        }
    }

    var rafId = null;
    function loop() {
        if (!running) return;
        draw();
        rafId = window.requestAnimationFrame(loop);
    }

    function start() {
        if (!rafId) {
            running = true;
            loop();
        }
    }

    function stop() {
        running = false;
        if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 200);
    });

    // 页面不可见时暂停动画，省电省 CPU
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
    });

    // 主题切换时同步星空配色
    document.addEventListener("themechange", function (e) {
        current = themes[e.detail === "light" ? "light" : "dark"];
        init();
    });

    applyTheme();
    start();
})();
