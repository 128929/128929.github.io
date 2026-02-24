// 自定义JavaScript功能

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 添加页脚心跳效果
  const footer = document.getElementById('footer');
  if (footer) {
    const copyright = footer.querySelector('.copyright');
    if (copyright) {
      const text = copyright.innerHTML;
      const newText = text.replace('❤️', '<span id="animate">❤️</span>');
      copyright.innerHTML = newText;
    }
  }

  // 添加文章阅读时间估计
  const postInfo = document.querySelector('.post-info');
  if (postInfo) {
    const articleContent = document.getElementById('article-container');
    if (articleContent) {
      const wordCount = articleContent.innerText.trim().replace(/\s+/g, ' ').split(' ').length;
      const readingTime = Math.ceil(wordCount / 400); // 假设阅读速度为每分钟400字
      
      const timeInfo = document.createElement('div');
      timeInfo.className = 'post-meta-item';
      timeInfo.innerHTML = `<i class="fas fa-clock"></i> <span>${readingTime} 分钟</span>`;
      
      postInfo.appendChild(timeInfo);
    }
  }

  // 添加返回顶部平滑滚动
  const backToTop = document.getElementById('go-up');
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 添加代码块复制成功提示
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    const originalTitle = button.getAttribute('title') || '复制';
    button.addEventListener('click', function() {
      button.setAttribute('title', '复制成功！');
      setTimeout(() => {
        button.setAttribute('title', originalTitle);
      }, 1500);
    });
  });

  // 添加图片点击放大效果（如果没有使用fancybox）
  const images = document.querySelectorAll('#article-container img:not(.no-lightbox)');
  images.forEach(img => {
    if (!img.parentNode.classList.contains('fancybox')) {
      img.addEventListener('click', function() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.cursor = 'zoom-out';

        const imgClone = document.createElement('img');
        imgClone.src = img.src;
        imgClone.style.maxWidth = '90%';
        imgClone.style.maxHeight = '90%';
        imgClone.style.objectFit = 'contain';

        overlay.appendChild(imgClone);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function() {
          document.body.removeChild(overlay);
        });
      });
    }
  });

  const missingCovers = document.querySelectorAll('img[data-lazy-src="/img/butterfly-cover.jpg"]');
  missingCovers.forEach(img => {
    img.setAttribute('data-lazy-src', '/img/placeholder.jpg');
  });

  const header = document.getElementById('page-header');
  if (
    header && /butterfly-top\.jpg/.test(header.style.backgroundImage) &&
    typeof window.GLOBAL_CONFIG_SITE !== 'undefined' &&
    window.GLOBAL_CONFIG_SITE.pageType === 'home'
  ) {
    header.style.backgroundImage = "url('/img/autumn-forest.png')";
  }

  const html = document.documentElement;
  html.classList.remove('hide-aside');
  try { localStorage.removeItem('aside-status'); } catch (e) {}
  const removeHrefs = ['/posts/f0d8e1c0/','/posts/d85c4342/','/posts/68534d0c/','/posts/4a17b156/','/posts/5c2fafc7/','/2025/08/23/第一篇文章/','/2025/08/23/hello-world/'];
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (removeHrefs.some(h => href.includes(h))) {
      const item = a.closest('.recent-post-item, .article-item, .post-item, li, .card, .block');
      if (item) item.remove();
    }
  });
  const homeItems = document.querySelectorAll('#recent-posts .recent-post-item');
  const countEl = document.querySelector('#sidebar .site-data a[href="/archives/"] .length-num');
  if (countEl) countEl.textContent = String(homeItems.length);

  const recentList = document.querySelector('#recent-posts .recent-post-items');
  if (recentList && !document.querySelector('a.article-title[href="/posts/openclaw-feishu/"]')) {
    const item = document.createElement('div');
    item.className = 'recent-post-item';
    item.innerHTML = `
      <div class="post_cover left">
        <a href="/posts/openclaw-feishu/" title="在 Linux 上从零搭建 OpenClaw + 飞书机器人，并跑通代理（Clash/Mihomo）：完整教程与踩坑修复">
          <img class="post-bg" src="/img/loading.gif" data-lazy-src="/img/butterfly-icon.png" onerror="this.onerror=null;this.src='/img/404.jpg'" alt="OpenClaw + 飞书教程">
        </a>
      </div>
      <div class="recent-post-info">
        <a class="article-title" href="/posts/openclaw-feishu/" title="在 Linux 上从零搭建 OpenClaw + 飞书机器人，并跑通代理（Clash/Mihomo）：完整教程与踩坑修复">在 Linux 上从零搭建 OpenClaw + 飞书机器人，并跑通代理（Clash/Mihomo）：完整教程与踩坑修复</a>
        <div class="article-meta-wrap">
          <span class="post-meta-date"><i class="far fa-calendar-alt"></i><span class="article-meta-label">发表于</span><time datetime="2026-02-20T00:00:00.000Z" title="发表于 2026-02-20 00:00:00">2026-02-20</time></span>
          <span class="article-meta"><span class="article-meta-separator">|</span><i class="fas fa-inbox"></i><a class="article-meta__categories" href="/categories/%E6%95%99%E7%A8%8B/">教程</a></span>
        </div>
        <div class="content">完整教程：Node/nvm、OpenClaw、飞书插件安装与修复、Gateway 启停、代理配置（Clash/Mihomo）、Wayland 权限与一键验收脚本。</div>
      </div>
    `;
    recentList.prepend(item);
  }

  const asideRecent = document.querySelector('.card-recent-post .aside-list');
  if (asideRecent && !document.querySelector('.card-recent-post .aside-list a.title[href="/posts/openclaw-feishu/"]')) {
    const asideItem = document.createElement('div');
    asideItem.className = 'aside-list-item';
    asideItem.innerHTML = `
      <a class="thumbnail" href="/posts/openclaw-feishu/" title="OpenClaw + 飞书教程">
        <img src="/img/loading.gif" data-lazy-src="/img/butterfly-icon.png" onerror="this.onerror=null;this.src='/img/404.jpg'" alt="OpenClaw + 飞书教程"/>
      </a>
      <div class="content">
        <a class="title" href="/posts/openclaw-feishu/" title="在 Linux 上从零搭建 OpenClaw + 飞书机器人，并跑通代理（Clash/Mihomo）：完整教程与踩坑修复">在 Linux 上从零搭建 OpenClaw + 飞书机器人，并跑通代理（Clash/Mihomo）：完整教程与踩坑修复</a>
        <time datetime="2026-02-20T00:00:00.000Z" title="发表于 2026-02-20 00:00:00">2026-02-20</time>
      </div>
    `;
    asideRecent.prepend(asideItem);
  }
  const countEl2 = document.querySelector('#sidebar .site-data a[href="/archives/"] .length-num');
  const homeItems2 = document.querySelectorAll('#recent-posts .recent-post-item');
  if (countEl2) countEl2.textContent = String(homeItems2.length);
  function initTocFollow(){
    var content=document.getElementById('article-text-body');
    var links=[].slice.call(document.querySelectorAll('#card-toc .toc-content .toc a.toc-link'))
    if(!content||!links.length)return false
    links.forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault()
        var id=decodeURIComponent((a.getAttribute('href')||'').replace('#',''))
        var target=document.getElementById(id)
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'})
      })
    })
    var headingEls=[].slice.call(document.querySelectorAll('#article-text-body h2'))
    var linkMap={}
    links.forEach(function(a){
      var id=(a.getAttribute('href')||'').replace('#','')
      linkMap[id]=a
    })
    var active=null
    var setActive=function(a){
      if(active===a)return
      links.forEach(function(x){x.classList.remove('active')})
      if(a){a.classList.add('active');active=a}
    }
    var io=new IntersectionObserver(function(entries){
      var topEntry=null
      for(var i=0;i<entries.length;i++){
        var en=entries[i]
        if(en.isIntersecting&&(topEntry===null||en.boundingClientRect.top<topEntry.boundingClientRect.top)){
          topEntry=en
        }
      }
      if(topEntry){
        var id=topEntry.target.id
        var a=linkMap[id]
        setActive(a||null)
      }
    },{root:null,rootMargin:'0px 0px -70% 0px',threshold:0})
    headingEls.forEach(function(h){io.observe(h)})
    var tocPercent=document.querySelector('#card-toc .toc-percentage')
    var recentPercent=document.querySelector('.card-recent-post .recent-percentage')
    var updatePercent=function(){
      var docH=document.documentElement.scrollHeight-window.innerHeight
      var t=window.scrollY
      var pct=docH>0?Math.min(100,Math.max(0,Math.round(t/docH*100))):0
      if(tocPercent)tocPercent.textContent=pct+'%'
      if(recentPercent)recentPercent.textContent=pct+'%'
    }
    window.addEventListener('scroll',updatePercent,{passive:true})
    updatePercent()
    return true
  }
  (function waitInit(){ if(!initTocFollow()) setTimeout(waitInit,100); })()

  // 阅读进度条，仅在文章页启用
  try {
    if (window.GLOBAL_CONFIG_SITE && window.GLOBAL_CONFIG_SITE.pageType === 'post') {
      if (!document.getElementById('read-progress')) {
        var rp = document.createElement('div')
        rp.id = 'read-progress'
        rp.innerHTML = '<div class="bar"></div><div class="pct"></div>'
        document.body.appendChild(rp)
      }
      var bar = document.querySelector('#read-progress .bar')
      var pctEl = document.querySelector('#read-progress .pct')
      var update = function() {
        var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        var t = window.scrollY || document.documentElement.scrollTop
        var pct = max ? Math.min(100, Math.max(0, Math.round(t / max * 100))) : 0
        if (bar) bar.style.width = pct + '%'
        if (pctEl) pctEl.textContent = pct + '%'
      }
      update()
      window.addEventListener('scroll', (window.btf && btf.throttle ? btf.throttle(update, 100) : update), { passive: true })
      window.addEventListener('resize', (window.btf && btf.debounce ? btf.debounce(update, 100) : update))

      var reInitToc = function () {
        var tocRoot = document.querySelector('#card-toc .toc-content .toc')
        var hasLinks = tocRoot && tocRoot.querySelectorAll('.toc-link').length > 0
        var hasArticle = document.getElementById('article-container')
        if (!hasArticle) return
        if (typeof window.initTocObserver === 'function') {
          window.initTocObserver({ container: '#article-container', tocSelector: '#card-toc .toc-content .toc' })
        } else {
          var links = [].slice.call(document.querySelectorAll('#card-toc .toc-content .toc .toc-link'))
          if (!links.length) return
          var headings = [].slice.call(document.querySelectorAll('#article-container h1,h2,h3,h4,h5,h6'))
          if (!headings.length) return
          var map = {}
          links.forEach(function (a) { var id = (a.getAttribute('href') || '').replace('#', ''); map[id] = a })
          var active = null
          var setActive = function (a) { if (active === a) return; links.forEach(function (x) { x.classList.remove('active') }); if (a) { a.classList.add('active'); active = a } }
          var io = new IntersectionObserver(function (entries) {
            var topEntry = null
            for (var i = 0; i < entries.length; i++) { var en = entries[i]; if (en.isIntersecting && (!topEntry || en.boundingClientRect.top < topEntry.boundingClientRect.top)) topEntry = en }
            if (topEntry) { var id = topEntry.target.id; var a = map[id]; setActive(a || null) }
          }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 })
          headings.forEach(function (h) { if (h.id) io.observe(h) })
          tocRoot.addEventListener('click', function (e) {
            var a = e.target.closest('.toc-link'); if (!a) return; e.preventDefault(); var id = decodeURIComponent((a.getAttribute('href') || '').replace('#', '')); var t = document.getElementById(id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }
      }
      reInitToc()

      var target = document.getElementById('article-container')
      if (target) {
        var moHandler = function () { reInitToc(); update() }
        var mo = new MutationObserver((window.btf && btf.debounce) ? btf.debounce(moHandler, 200) : moHandler)
        mo.observe(target, { childList: true, subtree: true })
      }
  document.addEventListener('article:rendered', function () { reInitToc(); update() })
    // 计算并注入 sticky 偏移，保证“目录 + 下面第一块卡片”不重叠
    ;(function computeStickyOffsets(){
      var isPost = (location.pathname.indexOf('/posts/') !== -1) || !!document.getElementById('article-container')
      if (!isPost) return
      var aside = document.getElementById('aside-content')
      var toc = document.getElementById('card-toc')
      if (!aside || !toc) return
      var top = 96
      aside.style.setProperty('--aside-sticky-top', top + 'px')
      function setOffsets(){
        var h = 0
        var headline = toc.querySelector('.item-headline')
        if (headline) h += headline.getBoundingClientRect().height
        h += 24
        aside.style.setProperty('--toc-sticky-offset', h + 'px')
      }
      setOffsets()
      var mo2 = new MutationObserver((window.btf && btf.debounce) ? btf.debounce(setOffsets, 200) : setOffsets)
      mo2.observe(toc, { childList: true, subtree: true })
      document.addEventListener('article:rendered', setOffsets)
    })()
    }
  } catch (e) {}
});

// 添加网站运行时间统计
function siteTime() {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;
  const today = new Date();
  const startTime = new Date('2025-01-01'); // 网站开始运行日期
  const timeOld = today.getTime() - startTime.getTime();
  const yearsOld = Math.floor(timeOld / years);
  const daysOld = Math.floor((timeOld % years) / days);
  const hoursOld = Math.floor((timeOld % days) / hours);
  const minutesOld = Math.floor((timeOld % hours) / minutes);
  const secondsOld = Math.floor((timeOld % minutes) / seconds);

  const runTimeElement = document.getElementById('site-runtime');
  if (runTimeElement) {
    runTimeElement.innerHTML = `本站已运行 ${yearsOld}年 ${daysOld}天 ${hoursOld}时 ${minutesOld}分 ${secondsOld}秒`;
  }
  
  setTimeout(siteTime, 1000);
}

// 页面加载完成后启动网站运行时间统计
window.addEventListener('load', siteTime);
/* ==== 从这里开始：文章页右侧仅“目录 + 第一张卡片”sticky 的偏移计算与滚动增强 ==== */ 
document.addEventListener('DOMContentLoaded', function () { 
  // 仅文章页运行：URL 含 /posts/ 或存在 #article-container 
  var isPost = (location.pathname.indexOf('/posts/') !== -1) || !!document.getElementById('article-container') 
  if (!isPost) return 

  var aside = document.getElementById('aside-content') 
  var toc = document.getElementById('card-toc') 
  var firstCard = toc ? toc.nextElementSibling : null 
  if (!aside || !toc || !firstCard || !firstCard.classList.contains('card-widget')) return 

  // 在文章页限定样式作用域（避免非文章页受影响） 
  aside.classList.add('sticky-scope') 

  // 基础顶部偏移（可按导航高度调整） 
  var baseTop = 96 
  aside.style.setProperty('--aside-sticky-top', baseTop + 'px') 

  // 计算目录卡片高度并写入 CSS 变量，确保第二块 top = aside-top + 目录高度 
  function computeOffsets() { 
    // 目录卡片整体高度（包含标题与内边距） 
    var h = toc.getBoundingClientRect().height 
    aside.style.setProperty('--toc-height', h + 'px') 
  } 

  computeOffsets() 
  window.addEventListener('resize', throttle(computeOffsets, 100)) 
  document.addEventListener('article:rendered', computeOffsets) 

  // 动态文章解析：目录内容变化时重新计算高度 
  try { 
    var mo = new MutationObserver(debounce(computeOffsets, 150)) 
    mo.observe(toc, { childList: true, subtree: true }) 
  } catch (e) {} 

  // 旧浏览器滚动链 fallback：锁定滚轮在这两块容器内（新浏览器由 overscroll-behavior: contain 生效） 
  ;[toc.querySelector('.toc-content') || toc, firstCard].forEach(function (el) { 
    if (!el) return 
    el.addEventListener('wheel', function (e) { 
      var sc = el.scrollHeight > el.clientHeight 
      if (!sc) return 
      var prev = el.scrollTop 
      el.scrollTop += e.deltaY 
      var atEdge = prev === el.scrollTop || el.scrollTop === 0 || (el.scrollTop + el.clientHeight >= el.scrollHeight) 
      if (!atEdge) e.preventDefault() 
    }, { passive: false }) 
  }) 

  // 简易 throttle / debounce（若主题 utils 不存在） 
  function throttle(fn, wait) { 
    var t, last = 0 
    return function () { 
      var now = Date.now() 
      if (now - last >= wait) { last = now; fn() } 
      else { clearTimeout(t); t = setTimeout(function () { last = Date.now(); fn() }, wait - (now - last)) } 
    } 
  } 
  function debounce(fn, wait) { 
    var t 
    return function () { clearTimeout(t); t = setTimeout(fn, wait) } 
  } 
}) 
/* ==== 到这里结束：文章页右侧仅“目录 + 第一张卡片”sticky 的偏移计算与滚动增强 ==== */ 
/* ==== 从这里开始：动态粒子背景（数量对应文章总数） ==== */
;(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // 防止重复初始化
  if (document.getElementById('particle-canvas-dynamic')) return

  var canvas = document.createElement('canvas')
  canvas.id = 'particle-canvas-dynamic'
  // 样式：固定在底层，不阻挡点击
  canvas.style.cssText = [
    'position:fixed', 'inset:0', 'width:100vw', 'height:100vh',
    'z-index:0', 'pointer-events:none'
  ].join(';')
  document.body.insertBefore(canvas, document.body.firstChild)

  var ctx = canvas.getContext('2d', { alpha: true })
  var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  var w = 0, h = 0, raf = 0
  var ps = []
  var mouse = { x: -9999, y: -9999, active: false }

  // 获取文章数量
  function getPostCount() {
    // 尝试从侧边栏获取
    var el = document.querySelector('.site-data .length-num') || 
             document.querySelector('.site-data a[href*="archives"] .length-num')
    if (el) {
      var num = parseInt(el.innerText.trim(), 10)
      if (!isNaN(num) && num > 0) return num
    }
    // 默认回退值（如果没找到 DOM）
    return 50 
  }

  function isMobile() { return window.innerWidth <= 900 }

  function getConfig() {
    var mobile = isMobile()
    // 获取真实文章数量
    var count = getPostCount()
    
    // 如果文章数量太少（比如小于15），为了避免背景太空，可以设置一个倍数，或者就保持真实数量
    // 用户要求“对应上”，所以这里优先用真实数量。
    // 但为了不让屏幕太黑，如果数量很少，我们会自动增加连线距离和粒子大小
    
    // 动态调整连线距离：粒子越少，连线距离越长，确保能连起来
    // 屏幕面积 / 粒子数 = 每个粒子占据的平均面积
    // 连线距离应该略大于平均间距
    var area = window.innerWidth * window.innerHeight
    var avgArea = area / (count || 1)
    var avgDist = Math.sqrt(avgArea)
    var linkDist = Math.max(150, avgDist * 1.3) // 至少150，或者根据密度自动算

    return {
      count: count,
      speed: mobile ? 0.4 : 0.6,
      radius: mobile ? 2 : 3, // 粒子稍大一点
      linkDist: linkDist,
      mouseDist: mobile ? 180 : 250,
      // 颜色配置
      dot: 'rgba(170, 200, 255, 0.8)',
      line: 'rgba(140, 180, 255, 0.25)',
      mouseLine: 'rgba(170, 210, 255, 0.45)'
    }
  }

  var C = getConfig()

  function rand(min, max) { return Math.random() * (max - min) + min }

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    w = Math.floor(window.innerWidth)
    h = Math.floor(window.innerHeight)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    C = getConfig()
    initParticles(true)
  }

  function initParticles(keep) {
    var target = C.count
    // 总是重置粒子，以确保数量准确
    if (!keep || ps.length !== target) {
      ps = []
      for (var i = 0; i < target; i++) {
        ps.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-C.speed, C.speed),
          vy: rand(-C.speed, C.speed)
        })
      }
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h)

    // 绘制背景微光（可选）
    // var g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h))
    // g.addColorStop(0, 'rgba(30, 50, 90, 0.05)')
    // g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    // ctx.fillStyle = g
    // ctx.fillRect(0, 0, w, h)

    // 绘制连线
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]
      for (var j = i + 1; j < ps.length; j++) {
        var q = ps[j]
        var dx = p.x - q.x
        var dy = p.y - q.y
        var dist2 = dx * dx + dy * dy
        var maxD = C.linkDist
        if (dist2 < maxD * maxD) {
          var alpha = 1 - Math.sqrt(dist2) / maxD
          ctx.strokeStyle = C.line.replace('0.25', String(0.05 + alpha * 0.3))
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.stroke()
        }
      }
    }

    // 鼠标互动
    if (mouse.active) {
      for (var k = 0; k < ps.length; k++) {
        var r = ps[k]
        var dx = r.x - mouse.x
        var dy = r.y - mouse.y
        var dist2 = dx * dx + dy * dy
        var maxD = C.mouseDist
        if (dist2 < maxD * maxD) {
          var alpha = 1 - Math.sqrt(dist2) / maxD
          ctx.strokeStyle = C.mouseLine.replace('0.45', String(0.1 + alpha * 0.5))
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(r.x, r.y)
          ctx.stroke()
        }
      }
    }

    // 绘制粒子
    ctx.fillStyle = C.dot
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i]
      p.x += p.vx
      p.y += p.vy

      // 边界反弹
      if (p.x < 0) { p.x = 0; p.vx *= -1 }
      else if (p.x > w) { p.x = w; p.vx *= -1 }
      if (p.y < 0) { p.y = 0; p.vy *= -1 }
      else if (p.y > h) { p.y = h; p.vy *= -1 }

      ctx.beginPath()
      ctx.arc(p.x, p.y, C.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    raf = requestAnimationFrame(step)
  }

  // 事件监听
  function setMouse(x, y, active) {
    mouse.x = x
    mouse.y = y
    mouse.active = active
  }

  window.addEventListener('mousemove', function (e) { setMouse(e.clientX, e.clientY, true) })
  window.addEventListener('mouseleave', function () { setMouse(-9999, -9999, false) })
  
  // 触摸支持
  window.addEventListener('touchstart', function(e){ 
    if(e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY, true)
  }, {passive: true})
  window.addEventListener('touchmove', function(e){ 
    if(e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY, true)
  }, {passive: true})
  window.addEventListener('touchend', function(){ setMouse(-9999, -9999, false) })

  var timer = 0
  window.addEventListener('resize', function () {
    clearTimeout(timer)
    timer = setTimeout(resize, 200)
  })

  function start() {
    resize()
    cancelAnimationFrame(raf)
    step()
  }

  // 确保 DOM 加载后能获取到文章数量
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    // 稍微延迟以确保侧边栏已渲染
    setTimeout(start, 100)
  }
})()
/* ==== 到这里结束：动态粒子背景 ==== */
/* ==== 从这里开始：强制导航“搜索”跳转 /search/（避免 404） ==== */
document.addEventListener('DOMContentLoaded', function () {
  var navLinks = Array.from(document.querySelectorAll('#nav a, #menus a, nav a'));
  var searchLink = navLinks.find(function (a) {
    return (a.textContent || '').trim() === '搜索';
  });
  if (searchLink) {
    searchLink.setAttribute('href', '/search/');
    searchLink.removeAttribute('onclick');
  }
});
/* ==== 到这里结束：强制导航“搜索”跳转 /search/ ==== */
// 全站加载右侧栏强制展开脚本（DOM 就绪 + PJAX 完成时兜底）
try { if (window.btf && typeof btf.getScript === 'function') btf.getScript('/js/aside-expand.js'); } catch (e) {}
