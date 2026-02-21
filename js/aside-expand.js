;(function(){
  var bound = false
  function expandAll(){
    try {
      var aside = document.getElementById('aside-content')
      if (!aside) return
      ;['is-collapsed','collapsed','hide','hidden','toggle-content'].forEach(function(cls){
        aside.querySelectorAll('.'+cls).forEach(function(el){
          el.classList.remove(cls)
          el.style.display = 'block'
          el.style.height = 'auto'
          el.style.maxHeight = 'none'
          el.style.opacity = '1'
          el.style.visibility = 'visible'
          el.style.overflow = 'visible'
        })
      })
      aside.querySelectorAll('[style*="display:none"], [style*="display: none"]').forEach(function(el){
        el.style.display = 'block'
      })
      aside.querySelectorAll('.toggle-btn, .btn-toggle, .expand, .collapse, .fa-angle-down, .fa-chevron-down').forEach(function(el){
        el.style.display = 'none'
      })
    } catch (e) {}
  }

  function bind(){
    if (bound) return
    bound = true
    document.addEventListener('DOMContentLoaded', expandAll)
    window.addEventListener('pjax:complete', expandAll)
    expandAll()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind)
  else bind()
})()
