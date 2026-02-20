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
  if (header && /butterfly-top\.jpg/.test(header.style.backgroundImage)) {
    header.style.backgroundImage = "url('/img/placeholder.jpg')";
  }

  const html = document.documentElement;
  html.classList.remove('hide-aside');
  try { localStorage.removeItem('aside-status'); } catch (e) {}
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
