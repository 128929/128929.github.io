document.addEventListener('DOMContentLoaded', () => {
  // 检查页面中是否存在APlayer容器
  const aplayerContainer = document.getElementById('aplayer');
  if (aplayerContainer && typeof APlayer !== 'undefined') {
    // 初始化APlayer
    const ap = new APlayer({
      container: aplayerContainer,
      audio: [{
        name: 'Butterfly',
        artist: 'Smile.DK',
        url: '/audio/butterfly.mp3',
        cover: '/custom/images/butterfly-cover.svg'
      }]
    });
  }

  // 首页补充“强化学习与机器人运动控制”知识沉淀文章。
  // 当前仓库保存的是静态生成后的页面，因此这里通过前端注入方式
  // 保证文章能够立即出现在首页和“最新文章”区域，不依赖重新执行 Hexo generate。
  const addReinforcementArticle = () => {
    const articleHref = '/posts/reinforcement-learning-robot-control/';
    const articleTitle = '强化学习与机器人运动控制：从传统控制到四足机器人 Sim2Real';
    const articleSummary = '从 PID、MPC、WBC 到强化学习、奖励函数、域随机化、课程学习与 Sim2Real，系统整理机器人运动控制技术路线与工程理解。';

    const recentList = document.querySelector('#recent-posts .recent-post-items');
    if (recentList && !document.querySelector(`#recent-posts a.article-title[href="${articleHref}"]`)) {
      const item = document.createElement('div');
      item.className = 'recent-post-item';
      item.innerHTML = `
        <div class="post_cover left">
          <a href="${articleHref}" title="${articleTitle}">
            <img class="post-bg" src="/img/loading.gif" data-lazy-src="/img/butterfly-icon.png" onerror="this.onerror=null;this.src='/img/404.jpg'" alt="强化学习与机器人运动控制">
          </a>
        </div>
        <div class="recent-post-info">
          <a class="article-title" href="${articleHref}" title="${articleTitle}">${articleTitle}</a>
          <div class="article-meta-wrap">
            <span class="post-meta-date"><i class="far fa-calendar-alt"></i><span class="article-meta-label">发表于</span><time datetime="2026-08-24T00:00:00.000Z" title="发表于 2026-08-24">2026-08-24</time></span>
            <span class="article-meta"><span class="article-meta-separator">|</span><i class="fas fa-inbox"></i><span class="article-meta__categories">机器人 · 强化学习</span></span>
          </div>
          <div class="content">${articleSummary}</div>
        </div>
      `;
      recentList.prepend(item);
    }

    const asideRecent = document.querySelector('.card-recent-post .aside-list');
    if (asideRecent && !document.querySelector(`.card-recent-post a.title[href="${articleHref}"]`)) {
      const asideItem = document.createElement('div');
      asideItem.className = 'aside-list-item';
      asideItem.innerHTML = `
        <a class="thumbnail" href="${articleHref}" title="${articleTitle}">
          <img src="/img/loading.gif" data-lazy-src="/img/butterfly-icon.png" onerror="this.onerror=null;this.src='/img/404.jpg'" alt="强化学习与机器人运动控制"/>
        </a>
        <div class="content">
          <a class="title" href="${articleHref}" title="${articleTitle}">${articleTitle}</a>
          <time datetime="2026-08-24T00:00:00.000Z" title="发表于 2026-08-24">2026-08-24</time>
        </div>
      `;
      asideRecent.prepend(asideItem);
    }

    // 重新统计首页当前实际展示的文章数量，避免静态页面中的旧数量继续显示。
    const homeCount = document.querySelectorAll('#recent-posts .recent-post-item').length;
    document.querySelectorAll('.site-data a[href="/archives/"] .length-num').forEach(el => {
      if (homeCount > 0) el.textContent = String(homeCount);
    });
  };

  // 给“分类”页增加一个独立的机器人可视化工具分类。
  // 由于当前网站是已经生成好的静态页面，这里采用前端补充方式，
  // 避免为了一个工具分类重新生成整套 Hexo 输出。
  const addRobotVisualizationCategory = () => {
    const categoryHref = '/categories/robot-visualization-tools/';
    const categoryName = '机器人可视化 / URDF 工具';
    const categoryList = document.querySelector('.category-lists .category-list');

    if (categoryList && !categoryList.querySelector(`a[href="${categoryHref}"]`)) {
      const item = document.createElement('li');
      item.className = 'category-list-item';
      item.innerHTML = `
        <a class="category-list-link" href="${categoryHref}">${categoryName}</a>
        <span class="category-list-count">3</span>
      `;
      categoryList.prepend(item);
    }

    // 侧栏分类区也补充同一个入口，便于从文章页快速访问。
    const asideCategoryList = document.querySelector('#aside-cat-list');
    if (asideCategoryList && !asideCategoryList.querySelector(`a[href="${categoryHref}"]`)) {
      const asideItem = document.createElement('li');
      asideItem.className = 'card-category-list-item';
      asideItem.innerHTML = `
        <a class="card-category-list-link" href="${categoryHref}">
          <span class="card-category-list-name">${categoryName}</span>
          <span class="card-category-list-count">3</span>
        </a>
      `;
      asideCategoryList.prepend(asideItem);
    }

    // 新增一个手工分类后，将静态生成页面中旧的分类数量同步 +1。
    document.querySelectorAll('.site-data a[href="/categories/"] .length-num').forEach(el => {
      const current = Number(el.textContent || 0);
      if (current > 0 && current < 6) el.textContent = '6';
    });
  };

  // js/custom.js 同样会在 DOMContentLoaded 时整理首页文章，延后一个事件循环执行，
  // 确保本篇新文章最终位于首页最前面。
  setTimeout(addReinforcementArticle, 0);
  setTimeout(addReinforcementArticle, 300);
  setTimeout(addRobotVisualizationCategory, 0);
  setTimeout(addRobotVisualizationCategory, 300);
});