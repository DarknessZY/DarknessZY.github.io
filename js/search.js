var searchFunc=function(e,i,l){"use strict";var n="<button type='button' class='local-search-close' id='local-search-close'></button>";$.ajax({url:e,dataType:"xml",success:function(e){var t=$("entry",e).map(function(){return{title:$("title",this).text(),content:$("content",this).text(),url:$("url",this).text()}}).get();var r=document.getElementById(i);var a=document.getElementById(l);r.addEventListener("input",function(){var v='<ul class="search-result-list">';var h=this.value.trim().toLowerCase().split(/[\s]+/);a.innerHTML="";if(this.value.trim().length<=0){return}t.forEach(function(e){var r=true;if(!e.title||e.title.trim()===""){e.title="Untitled"}var a=e.title.trim().toLowerCase();var i=e.content.trim().replace(/<[^>]+>/g,"").toLowerCase();var t=e.url;var l=-1;var n=-1;var s=-1;if(i!==""){h.forEach(function(e,t){l=a.indexOf(e);n=i.indexOf(e);if(l<0&&n<0){r=false}else{if(n<0){n=0}if(t==0){s=n}}})}else{r=false}if(r){v+="<li><a href='"+t+"' class='search-result-title'>"+a+"</a>";var c=e.content.trim().replace(/<[^>]+>/g,"");if(s>=0){var o=s-20;var u=s+80;if(o<0){o=0}if(o==0){u=100}if(u>c.length){u=c.length}var f=c.substr(o,u);h.forEach(function(e){var t=new RegExp(e,"gi");f=f.replace(t,'<em class="search-keyword">'+e+"</em>")});v+='<p class="search-result">'+f+"...</p>"}v+="</li>"}});v+="</ul>";if(v.indexOf("<li>")===-1){return a.innerHTML=n+'<div class="search-result-empty"><p><i class="fe fe-tired"></i> 没有找到内容，更换下搜索词试试吧~<p></div>'}a.innerHTML=n+v})}});$(document).on("click","#local-search-close",function(){$("#local-search-input").val("");$("#local-search-result").html("")})};