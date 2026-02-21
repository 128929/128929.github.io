(() => {
  const ENABLE_LEAVES = true
  const DEFAULT_COUNT = 20
  const MAX_COUNT = 36
  const MIN_COUNT = 8
  const MOBILE_DISABLED = true
  const RADIUS_REPEL = 140
  const GRAVITY = 0.06
  const WIND_BASE = 0.08
  const FPS_LIMIT = 60

  let canvas = null
  let ctx = null
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  let width = 0
  let height = 0
  let raf = 0
  let running = false
  let last = 0
  let pointer = { x: -9999, y: -9999, active: false }

  const isMobile = () => MOBILE_DISABLED && (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) || window.innerWidth < 768)
  const prefersReduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lerp = (a, b, n) => a + (b - a) * n
  const clamp = (v, lim) => v > lim ? lim : (v < -lim ? -lim : v)

  const COLORS = [
    'rgba(180, 40, 48, 0.35)',   // 暗红
    'rgba(140, 22, 30, 0.35)',   // 酒红
    'rgba(196, 138, 58, 0.35)'   // 铜金
  ]

  const leaves = []

  const log = (...args) => {
    try {
      if (window.DEBUG === true || localStorage.getItem('DEBUG') === 'true') console.log(...args)
    } catch (e) {}
  }

  const removeOld = () => {
    const old = document.getElementById('bg-leaves')
    if (old) try { old.remove() } catch (e) {}
  }

  const createCanvas = () => {
    removeOld()
    canvas = document.createElement('canvas')
    canvas.id = 'bg-leaves'
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')
    resize()
  }

  const resize = () => {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    width = Math.floor(window.innerWidth)
    height = Math.floor(window.innerHeight)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const rand = (min, max) => Math.random() * (max - min) + min

  const makeLeaf = () => {
    const size = rand(10, 22)
    const speed = rand(0.15, 0.45)
    const angle = rand(0, Math.PI * 2)
    const angVel = rand(-0.02, 0.02)
    const x = rand(0, width)
    const y = rand(-40, height * 0.2)
    const color = COLORS[Math.floor(rand(0, COLORS.length))]
    return { x, y, vx: rand(-WIND_BASE, WIND_BASE), vy: speed, size, angle, angVel, color }
  }

  const initLeaves = (target) => {
    leaves.length = 0
    for (let i = 0; i < target; i++) leaves.push(makeLeaf())
  }

  const drawLeaf = (p) => {
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

  const applyPointerForce = (p) => {
    if (!pointer.active) return
    const dx = p.x - pointer.x
    const dy = p.y - pointer.y
    const d2 = dx * dx + dy * dy
    const r = RADIUS_REPEL
    if (d2 < r * r) {
      const dist = Math.max(8, Math.sqrt(d2))
      const k = 1 - dist / r
      const repel = k * 0.65
      p.vx += (dx / dist) * repel
      p.vy += (dy / dist) * repel
    }
  }

  const step = (now) => {
    if (!running) return
    const minDelta = 1000 / FPS_LIMIT
    if (last && now - last < minDelta) { raf = requestAnimationFrame(step); return }
    last = now

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < leaves.length; i++) {
      const p = leaves[i]
      applyPointerForce(p)
      p.vy += GRAVITY * 0.02
      p.vx += Math.sin(p.y * 0.004) * WIND_BASE * 0.02
      p.vx = clamp(p.vx, 0.9)
      p.vy = clamp(p.vy, 1.2)
      p.x += p.vx
      p.y += p.vy
      p.angle += p.angVel
      if (p.y > height + 30) { leaves[i] = makeLeaf(); leaves[i].y = -20 }
      if (p.x < -30) p.x = width + 30
      if (p.x > width + 30) p.x = -30
      drawLeaf(p)
    }

    raf = requestAnimationFrame(step)
  }

  const onMouseMove = (e) => {
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.active = true
  }
  const onMouseLeave = () => { pointer.x = -9999; pointer.y = -9999; pointer.active = false }

  const destroy = () => {
    running = false
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseleave', onMouseLeave)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    removeOld()
  }

  const onVisibility = () => { running = !document.hidden }

  const init = () => {
    destroy()
    if (!ENABLE_LEAVES || prefersReduced() || isMobile()) { log('[leaves] disabled'); return }
    createCanvas()
    const desired = Math.max(MIN_COUNT, Math.min(MAX_COUNT, (typeof window.LEAVES_COUNT === 'number' ? window.LEAVES_COUNT : DEFAULT_COUNT)))
    initLeaves(desired)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    running = true
    raf = requestAnimationFrame(step)
    log('[leaves] mounted')
  }

  document.addEventListener('DOMContentLoaded', init)
  window.addEventListener('load', init)
  document.addEventListener('pjax:success', init)
  document.addEventListener('pjax:send', destroy)

  window.bgLeaves = { init, destroy }
})()
