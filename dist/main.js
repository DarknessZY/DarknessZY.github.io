!function(){"use strict";var i;function o(e,t){e=e.replace(/<%-sUrl%>/g,encodeURIComponent(t.sUrl)).replace(/<%-sTitle%>/g,encodeURIComponent(t.sTitle)).replace(/<%-sDesc%>/g,encodeURIComponent(t.sDesc)).replace(/<%-sPic%>/g,encodeURIComponent(t.sPic));window.open(e)}function t(){$(".wx-share-modal").removeClass("in ready"),$("#share-mask").hide()}function n(e,t){"weibo"===e?o("http://service.weibo.com/share/share.php?url=<%-sUrl%>&title=<%-sTitle%>&pic=<%-sPic%>",t):"qq"===e?o("http://connect.qq.com/widget/shareqq/index.html?url=<%-sUrl%>&title=<%-sTitle%>&source=<%-sDesc%>",t):"douban"===e?o("https://www.douban.com/share/service?image=<%-sPic%>&href=<%-sUrl%>&name=<%-sTitle%>&text=<%-sDesc%>",t):"qzone"===e?o("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<%-sUrl%>&title=<%-sTitle%>&pics=<%-sPic%>&summary=<%-sDesc%>",t):"facebook"===e?o("https://www.facebook.com/sharer/sharer.php?u=<%-sUrl%>",t):"twitter"===e?o("https://twitter.com/intent/tweet?text=<%-sTitle%>&url=<%-sUrl%>",t):"google"===e?o("https://plus.google.com/share?url=<%-sUrl%>",t):"weixin"===e&&($(".wx-share-modal").addClass("in ready"),$("#share-mask").show())}!function(o){let s=o(".search-form-wrap"),t=!1;o(".nav-item-search").on("click",()=>{var e;t||(t=!0,s.addClass("on"),e=function(){o(".local-search-input").focus()},setTimeout(function(){t=!1,e&&e()},200))}),o(document).on("mouseup",e=>{const t=o(".local-search");t.is(e.target)||0!==t.has(e.target).length||s.removeClass("on")}),o(".local-search").length&&o.getScript("/js/search.js",function(){searchFunc("/search.xml","local-search-input","local-search-result")}),o(".share-outer").on("click",()=>o(".share-wrap").fadeToggle()),o("img.lazy").lazyload({effect:"fadeIn"}),o("#gallery").justifiedGallery({rowHeight:200,margins:5}),o(document).ready(function(t){t(".anchor").on("click",function(e){e.preventDefault(),t("main").animate({scrollTop:t(".cover").height()},"smooth")})}),(()=>{const e=o("#totop");e.hide(),o(".content").on("scroll",()=>{o(".content").scrollTop()>1e3?o(e).stop().fadeTo(200,.6):o(e).stop().fadeTo(200,0)}),o(e).on("click",()=>(o(".content").animate({scrollTop:0},1e3),!1))})(),o(".article-entry").each(function(e){o(this).find("img").each(function(){if(o(this).parent().is("a"))return;const{alt:e}=this;e&&o(this).after('<span class="caption">'+e+"</span>")})});const e=o(".content"),r=o(".sidebar");o(".navbar-toggle").on("click",()=>{o(".content,.sidebar").addClass("anim"),e.toggleClass("on"),r.toggleClass("on")}),o("#reward-btn").on("click",()=>{o("#reward").fadeIn(150),o("#mask").fadeIn(150)}),o("#reward .close, #mask").on("click",()=>{o("#mask").fadeOut(100),o("#reward").fadeOut(100)}),1==sessionStorage.getItem("darkmode")?(o("body").addClass("darkmode"),o("#todark i").removeClass("ri-moon-line").addClass("ri-sun-line")):(o("body").removeClass("darkmode"),o("#todark i").removeClass("ri-sun-line").addClass("ri-moon-line")),o("#todark").on("click",()=>{1==sessionStorage.getItem("darkmode")?(o("body").removeClass("darkmode"),o("#todark i").removeClass("ri-sun-line").addClass("ri-moon-line"),sessionStorage.removeItem("darkmode")):(o("body").addClass("darkmode"),o("#todark i").removeClass("ri-moon-line").addClass("ri-sun-line"),sessionStorage.setItem("darkmode",1))});console.log("%c%s%c%s%c%s","background-color: #49b1f5; color: #fff; padding: 8px; font-size: 14px;","主题不错？⭐star 支持一下 ->","background-color: #ffbca2; padding: 8px; font-size: 14px;","https://github.com/Shen-Yu/hexo-theme-ayer","background-color: #eaf8ff;","\n\n     _ __   _______ _____    \n    / \\ \\ \\ / / ____|  _  \\  \n   / _ \\ \\ V /|  _| | |_) |  \n  / ___ \\ | | | |___|  _ <   \n /_/   \\_\\ _| |_____|_| \\__\\ \n")}(jQuery),i={id:"JGjrOr2rebvP6q2a",ck:"JGjrOr2rebvP6q2a"},function(e){var t=window,o=document,s=i,r="".concat("https:"===o.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=o.createElement("script"),a=o.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=r,n.id="LA_COLLECT",s.d=n;var c=function(){t.LA.ids.push(s)};t.LA?t.LA.ids&&c():(t.LA=i,t.LA.ids=[],c()),a.parentNode.insertBefore(n,a)}();(()=>{let e=document.querySelectorAll(".share-sns");if(!e||0===e.length)return;let o=window.location.href,s=document.querySelector("title").innerHTML,r=document.querySelectorAll(".article-entry img").length?document.querySelector(".article-entry img").getAttribute("src"):"";""===r||/^(http:|https:)?\/\//.test(r)||(r=window.location.origin+r),e.forEach(t=>{t.onclick=e=>{n(t.getAttribute("data-type"),{sUrl:o,sPic:r,sTitle:s,sDesc:s})}}),document.querySelector("#mask").onclick=t,document.querySelector(".modal-close").onclick=t})()}();