(() => {
  const ENABLE_FOG = true
  const FOG_OPACITY = 0.16
  const PARALLAX = 18
  const SPEED = 0.18
  const FPS_LIMIT = 45
  const DISABLE_ON_MOBILE = true
  const BLEND_MODE = 'screen'

  const BLUE = [170, 190, 255, 0.10]
  const WINE = [91, 13, 19, 0.06]

  let canvas = null
  let ctx = null
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  let rafId = 0
  let running = false
  let lastFrame = 0
  let tex = null
  let pat = null
  let width = 0
  let height = 0
  let t = 0
  let mx = 0
  let my = 0
  let tx = 0
  let ty = 0

  const isMobile = () => DISABLE_ON_MOBILE && (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) || window.innerWidth < 768)

  const lerp = (a, b, n) => a + (b - a) * n

  const createCanvas = () => {
    const old = document.getElementById('bg-fog')
    if (old) old.remove()
    const c = document.createElement('canvas')
    c.id = 'bg-fog'
    c.style.opacity = String(FOG_OPACITY)
    c.style.mixBlendMode = window.matchMedia('(prefers-contrast: more)').matches ? 'normal' : BLEND_MODE
    document.body.appendChild(c)
    canvas = c
    ctx = c.getContext('2d')
    resize()
  }

  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    buildTexture()
  }

  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(Math.floor(Date.now() % 233280))

  const buildTexture = () => {
    const size = 512
    const grid = 64
    const off = document.createElement('canvas')
    off.width = size
    off.height = size
    const octx = off.getContext('2d')
    const img = octx.createImageData(size, size)
    const vals = new Array(grid * grid)
    for (let i = 0; i < vals.length; i++) vals[i] = rnd() * 1
    for (let y = 0; y < size; y++) {
      const gy = y / size * (grid - 1)
      const y0 = Math.floor(gy)
      const y1 = Math.min(y0 + 1, grid - 1)
      const fy = gy - y0
      for (let x = 0; x < size; x++) {
        const gx = x / size * (grid - 1)
        const x0 = Math.floor(gx)
        const x1 = Math.min(x0 + 1, grid - 1)
        const fx = gx - x0
        const v00 = vals[y0 * grid + x0]
        const v10 = vals[y0 * grid + x1]
        const v01 = vals[y1 * grid + x0]
        const v11 = vals[y1 * grid + x1]
        const v0 = v00 + (v10 - v00) * fx
        const v1 = v01 + (v11 - v01) * fx
        const v = v0 + (v1 - v0) * fy
        const i = (y * size + x) * 4
        const g = Math.floor(v * 255)
        img.data[i] = g
        img.data[i + 1] = g
        img.data[i + 2] = g
        img.data[i + 3] = 255
      }
    }
    octx.putImageData(img, 0, 0)
    tex = off
    pat = ctx.createPattern(tex, 'repeat')
  }

  const tint = (color) => {
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
  }

  const draw = (now) => {
    if (!running) return
    const minDelta = 1000 / FPS_LIMIT
    if (lastFrame && now - lastFrame < minDelta) {
      rafId = requestAnimationFrame(draw)
      return
    }
    lastFrame = now
    t += SPEED
    tx = lerp(tx, mx, 0.08)
    ty = lerp(ty, my, 0.08)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(tx, ty)
    ctx.translate(t * 6, t * 4)
    ctx.fillStyle = pat
    ctx.fillRect(-width, -height, width * 3, height * 3)
    tint(BLUE)
    ctx.restore()
    ctx.save()
    ctx.translate(-tx * 0.6, -ty * 0.6)
    ctx.translate(-t * 5, -t * 3)
    ctx.fillStyle = pat
    ctx.fillRect(-width, -height, width * 3, height * 3)
    tint(WINE)
    ctx.restore()
    rafId = requestAnimationFrame(draw)
  }

  const onMouseMove = e => {
    const x = e.clientX - width / 2
    const y = e.clientY - height / 2
    const m = Math.max(1, PARALLAX)
    mx = Math.max(-m, Math.min(m, (x / width) * m))
    my = Math.max(-m, Math.min(m, (y / height) * m))
  }

  const onVisibility = () => {
    if (document.hidden) running = false
    else running = true
  }

  const destroy = () => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
    const old = document.getElementById('bg-fog')
    if (old) old.remove()
  }

  const init = () => {
    if (!ENABLE_FOG) return
    destroy()
    createCanvas()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    running = !isMobile()
    try { if (window.DEBUG === true || localStorage.getItem('DEBUG') === 'true') console.log('[fog] mounted') } catch (e) {}
    if (!running) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      t += SPEED
      ctx.save()
      ctx.translate(t * 6, t * 4)
      ctx.fillStyle = pat
      ctx.fillRect(-width, -height, width * 3, height * 3)
      tint(BLUE)
      ctx.restore()
      return
    }
    rafId = requestAnimationFrame(draw)
  }

  document.addEventListener('DOMContentLoaded', init)
  window.addEventListener('load', init)
  document.addEventListener('pjax:success', init)
  window.bgFog = { init, destroy }
})()
