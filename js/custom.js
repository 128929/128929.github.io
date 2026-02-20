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
    header.style.backgroundImage = "url('/img/placeholder.jpg')";
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
