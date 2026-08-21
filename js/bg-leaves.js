(() => {
  const ENABLE_LEAVES = true
  const DESKTOP_COUNT = 14
  const MOBILE_COUNT = 7
  const MAX_COUNT = 24
  const MIN_COUNT = 5
  const RADIUS_REPEL = 120
  const GRAVITY = 0.05
  const WIND_BASE = 0.07

  let canvas = null
  let ctx = null
  let dpr = 1
  let width = 0
  let height = 0
  let raf = 0
  let running = false
  let initialized = false
  let last = 0
  let resizeTimer = 0
  let pointer = { x: -9999, y: -9999, active: false }

  const isMobile = () => (
    window.matchMedia('(pointer: coarse)').matches ||
    /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
    window.innerWidth < 900
  )
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const clamp = (v, lim) => v > lim ? lim : (v < -lim ? -lim : v)

  const getQuality = () => {
    const mobile = isMobile()
    return {
      mobile,
      fps: mobile ? 18 : 30,
      dpr: mobile ? 1 : Math.max(1, Math.min(1.25, window.devicePixelRatio || 1)),
      count: mobile ? MOBILE_COUNT : DESKTOP_COUNT,
      pointerForce: !mobile
    }
  }

  const COLORS = [
    'rgba(180, 40, 48, 0.30)',
    'rgba(140, 22, 30, 0.30)',
    'rgba(196, 138, 58, 0.30)'
  ]

  const leaves = []

  const removeOld = () => {
    const old = document.getElementById('bg-leaves')
    if (old) old.remove()
  }

  const createCanvas = () => {
    removeOld()
    canvas = document.createElement('canvas')
    canvas.id = 'bg-leaves'
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.pointerEvents = 'none'
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    resize(true)
  }

  const resize = (force = false) => {
    if (!canvas || !ctx) return
    const nextWidth = Math.floor(window.innerWidth)
    const nextHeight = Math.floor(window.innerHeight)

    if (!force && Math.abs(nextWidth - width) < 24 && Math.abs(nextHeight - height) < 80) return

    width = nextWidth
    height = nextHeight
    const quality = getQuality()
    dpr = quality.dpr
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // 横竖屏或设备级别切换时，只调整数量，不重复堆叠实例。
    syncLeafCount()
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => resize(false), 180)
  }

  const rand = (min, max) => Math.random() * (max - min) + min

  const makeLeaf = () => {
    const quality = getQuality()
    const size = rand(quality.mobile ? 9 : 10, quality.mobile ? 16 : 20)
    return {
      x: rand(0, Math.max(1, width)),
      y: rand(-40, Math.max(1, height * 0.2)),
      vx: rand(-WIND_BASE, WIND_BASE),
      vy: rand(0.15, quality.mobile ? 0.32 : 0.40),
      size,
      angle: rand(0, Math.PI * 2),
      angVel: rand(-0.018, 0.018),
      color: COLORS[Math.floor(rand(0, COLORS.length))]
    }
  }

  const getTargetCount = () => {
    const quality = getQuality()
    const configured = typeof window.LEAVES_COUNT === 'number' ? window.LEAVES_COUNT : quality.count
    const cap = quality.mobile ? MOBILE_COUNT : MAX_COUNT
    return Math.max(MIN_COUNT, Math.min(cap, configured))
  }

  const syncLeafCount = () => {
    const target = getTargetCount()
    while (leaves.length > target) leaves.pop()
    while (leaves.length < target) leaves.push(makeLeaf())
  }

  const drawLeaf = p => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.angle)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.moveTo(0, -p.size * 0.5)
    ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size * 0.5)
    ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  const applyPointerForce = p => {
    if (!pointer.active || !getQuality().pointerForce) return
    const dx = p.x - pointer.x
    const dy = p.y - pointer.y
    const d2 = dx * dx + dy * dy

    if (d2 < RADIUS_REPEL * RADIUS_REPEL) {
      const dist = Math.max(8, Math.sqrt(d2))
      const repel = (1 - dist / RADIUS_REPEL) * 0.55
      p.vx += (dx / dist) * repel
      p.vy += (dy / dist) * repel
    }
  }

  const step = now => {
    if (!running || !ctx) return

    const quality = getQuality()
    const minDelta = 1000 / quality.fps
    if (last && now - last < minDelta) {
      raf = requestAnimationFrame(step)
      return
    }
    last = now

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < leaves.length; i++) {
      const p = leaves[i]
      applyPointerForce(p)
      p.vy += GRAVITY * 0.02
      p.vx += Math.sin(p.y * 0.004) * WIND_BASE * 0.02
      p.vx = clamp(p.vx, quality.mobile ? 0.65 : 0.8)
      p.vy = clamp(p.vy, quality.mobile ? 0.8 : 1.0)
      p.x += p.vx
      p.y += p.vy
      p.angle += p.angVel

      if (p.y > height + 30) {
        leaves[i] = makeLeaf()
        leaves[i].y = -20
      }
      if (p.x < -30) p.x = width + 30
      if (p.x > width + 30) p.x = -30

      drawLeaf(p)
    }

    raf = requestAnimationFrame(step)
  }

  const onMouseMove = e => {
    if (!getQuality().pointerForce) return
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.active = true
  }

  const onMouseLeave = () => {
    pointer.x = -9999
    pointer.y = -9999
    pointer.active = false
  }

  const onVisibility = () => {
    running = !document.hidden && !prefersReduced()
    if (running && !raf) raf = requestAnimationFrame(step)
  }

  const destroy = () => {
    running = false
    initialized = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    clearTimeout(resizeTimer)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseleave', onMouseLeave)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    removeOld()
    canvas = null
    ctx = null
    leaves.length = 0
  }

  const init = () => {
    if (!ENABLE_LEAVES || prefersReduced()) {
      destroy()
      return
    }

    if (initialized && document.getElementById('bg-leaves')) return

    destroy()
    initialized = true
    createCanvas()
    syncLeafCount()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    running = true
    raf = requestAnimationFrame(step)
  }

  document.addEventListener('DOMContentLoaded', init, { once: true })
  window.addEventListener('load', init, { once: true })
  document.addEventListener('pjax:success', init)
  document.addEventListener('pjax:send', destroy)

  window.bgLeaves = { init, destroy }
})()
