/**
 * 目录监听与高亮组件
 * @function initTocObserver
 * @param {Object} opts
 * @param {string} opts.container 文章内容容器选择器，例如 '#article-container'
 * @param {string} opts.tocSelector 目录列表选择器，例如 '#card-toc .toc-content .toc'
 * @param {number} [opts.offset=80] 顶部偏移，用于计算当前章节
 */
(function () {
  function initTocObserver(opts) {
    var containerSel = opts && opts.container || '#article-container'
    var tocSel = opts && opts.tocSelector || '#card-toc .toc-content .toc'
    var offset = (opts && opts.offset) || 80

    var container = document.querySelector(containerSel)
    var toc = document.querySelector(tocSel)
    if (!container || !toc) return

    var headings = container.querySelectorAll('h1,h2,h3,h4,h5,h6')
    var links = toc.querySelectorAll('.toc-link')
    if (!headings.length || !links.length) return

    var idToIndex = {}
    headings.forEach(function (h, i) {
      if (!h.id) return
      idToIndex['#' + encodeURI(h.id)] = i
    })

    function clearActive() {
      toc.querySelectorAll('.active').forEach(function (el) { el.classList.remove('active') })
      toc.querySelectorAll('[aria-current="true"]').forEach(function (el) { el.removeAttribute('aria-current') })
    }

    function setActiveByIndex(idx) {
      if (idx == null || idx < 0 || idx >= links.length) return
      var link = links[idx]
      link.classList.add('active')
      link.setAttribute('aria-current', 'true')
      var parent = link.parentNode
      while (parent && !parent.matches('.toc')) {
        if (parent.matches('li')) parent.classList.add('active')
        parent = parent.parentNode
      }
      var hash = link.getAttribute('href') || ''
      if (typeof btf !== 'undefined' && btf.updateAnchor) btf.updateAnchor(hash)
      autoScrollToc(link)
    }

    function autoScrollToc(activeLink) {
      var list = toc.parentElement
      if (!list) return
      var itemTop = activeLink.offsetTop
      var itemH = activeLink.offsetHeight
      var viewH = list.clientHeight
      var target = itemTop - (viewH - itemH) / 2
      list.scrollTop = target
    }

    // 点击目录平滑滚动
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('.toc-link')
      if (!a) return
      e.preventDefault()
      var id = decodeURI(a.getAttribute('href')).replace('#', '')
      var h = id && document.getElementById(id)
      if (!h) return
      var top = (typeof btf !== 'undefined' && btf.getEleTop) ? btf.getEleTop(h) : h.offsetTop
      if (typeof btf !== 'undefined' && btf.scrollToDest) btf.scrollToDest(top, 300)
      else window.scrollTo({ top: top, behavior: 'smooth' })
    })

    var usingObserver = false

    // 首选 IntersectionObserver 监听当前最顶部标题
    if ('IntersectionObserver' in window) {
      usingObserver = true
      var observer = new IntersectionObserver(function (entries) {
        // 取进入视口并最靠上的标题
        var topEntry = null
        for (var i = 0; i < entries.length; i++) {
          var en = entries[i]
          if (en.isIntersecting) {
            if (!topEntry || en.boundingClientRect.top < topEntry.boundingClientRect.top) {
              topEntry = en
            }
          }
        }
        if (!topEntry) return
        var id = '#' + encodeURI(topEntry.target.id)
        var idx = idToIndex[id]
        clearActive()
        setActiveByIndex(idx)
      }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 1] })

      headings.forEach(function (h) { if (h.id) observer.observe(h) })
    }

    // 降级：scroll + throttle 计算当前章节
    if (!usingObserver) {
      var detectIndex = -1
      var onScroll = (typeof btf !== 'undefined' && btf.throttle) ? btf.throttle(function () {
        var top = window.scrollY || document.documentElement.scrollTop
        var currentIdx = -1
        for (var i = 0; i < headings.length; i++) {
          var h = headings[i]
          var hTop = (typeof btf !== 'undefined' && btf.getEleTop) ? btf.getEleTop(h) : h.offsetTop
          if (top > hTop - offset) {
            currentIdx = i
          } else {
            break
          }
        }
        if (currentIdx === detectIndex) return
        detectIndex = currentIdx
        clearActive()
        setActiveByIndex(currentIdx)
      }, 100) : function () {}

      window.addEventListener('scroll', onScroll, { passive: true })
    }
  }

  window.initTocObserver = initTocObserver
})()

