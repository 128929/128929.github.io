(() => {
  const ENABLE_FOG = true
  const FOG_OPACITY = 0.14
  const BLEND_MODE = 'screen'

  const BLUE = [170, 190, 255, 0.09]
  const WINE = [91, 13, 19, 0.05]

  let canvas = null
  let ctx = null
  let dpr = 1
  let rafId = 0
  let running = false
  let initialized = false
  let lastFrame = 0
  let resizeTimer = 0
  let tex = null
  let pat = null
  let width = 0
  let height = 0
  let t = 0
  let mx = 0
  let my = 0
  let tx = 0
  let ty = 0

  // 粗指针/窄屏判定：手机不关闭效果，只降低画质与帧率。
  const isMobile = () => (
    window.matchMedia('(pointer: coarse)').matches ||
    /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) ||
    window.innerWidth < 768
  )

  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lerp = (a, b, n) => a + (b - a) * n

  const getQuality = () => {
    const mobile = isMobile()
    return {
      mobile,
      fps: mobile ? 14 : 30,
      dpr: mobile ? 1 : Math.max(1, Math.min(1.25, window.devicePixelRatio || 1)),
      textureSize: mobile ? 128 : 256,
      grid: mobile ? 16 : 32,
      speed: mobile ? 0.08 : 0.14,
      parallax: mobile ? 0 : 14,
      secondLayer: !mobile
    }
  }

  const createCanvas = () => {
    const old = document.getElementById('bg-fog')
    if (old) old.remove()

    const c = document.createElement('canvas')
    c.id = 'bg-fog'
    c.setAttribute('aria-hidden', 'true')
    c.style.opacity = String(FOG_OPACITY)
    c.style.mixBlendMode = window.matchMedia('(prefers-contrast: more)').matches ? 'normal' : BLEND_MODE
    c.style.pointerEvents = 'none'
    document.body.appendChild(c)
    canvas = c
    ctx = c.getContext('2d', { alpha: true, desynchronized: true })
    resize(true)
  }

  const resize = (force = false) => {
    if (!canvas || !ctx) return
    const nextWidth = Math.floor(window.innerWidth)
    const nextHeight = Math.floor(window.innerHeight)

    // 手机浏览器地址栏变化会连续触发 resize；小幅变化不重建 Canvas。
    if (!force && Math.abs(nextWidth - width) < 24 && Math.abs(nextHeight - height) < 80) return

    width = nextWidth
    height = nextHeight
    const quality = getQuality()
    dpr = quality.dpr
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    // 桌面/手机画质级别切换时才重建纹理，普通 resize 复用纹理。
    const requiredSize = quality.textureSize
    if (!tex || tex.width !== requiredSize) buildTexture(requiredSize, quality.grid)
    pat = ctx.createPattern(tex, 'repeat')
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => resize(false), 180)
  }

  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(137)

  const buildTexture = (size, grid) => {
    const off = document.createElement('canvas')
    off.width = size
    off.height = size
    const octx = off.getContext('2d')
    const img = octx.createImageData(size, size)
    const vals = new Float32Array(grid * grid)

    for (let i = 0; i < vals.length; i++) vals[i] = rnd()

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
  }

  const tint = color => {
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
  }

  const draw = now => {
    if (!running || !ctx || !canvas) return

    const quality = getQuality()
    const minDelta = 1000 / quality.fps
    if (lastFrame && now - lastFrame < minDelta) {
      rafId = requestAnimationFrame(draw)
      return
    }

    lastFrame = now
    t += quality.speed
    tx = lerp(tx, mx, 0.08)
    ty = lerp(ty, my, 0.08)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    // 第一层雾始终保留，手机也能看到动态背景。
    ctx.save()
    ctx.translate(tx + t * 5, ty + t * 3)
    ctx.fillStyle = pat
    ctx.fillRect(-width, -height, width * 3, height * 3)
    tint(BLUE)
    ctx.restore()

    // 第二层只在桌面开启，手机减少一半大面积像素填充。
    if (quality.secondLayer) {
      ctx.save()
      ctx.translate(-tx * 0.6 - t * 4, -ty * 0.6 - t * 2)
      ctx.fillStyle = pat
      ctx.fillRect(-width, -height, width * 3, height * 3)
      tint(WINE)
      ctx.restore()
    }

    rafId = requestAnimationFrame(draw)
  }

  const onMouseMove = e => {
    const quality = getQuality()
    if (!quality.parallax) return
    const x = e.clientX - width / 2
    const y = e.clientY - height / 2
    mx = Math.max(-quality.parallax, Math.min(quality.parallax, (x / Math.max(1, width)) * quality.parallax))
    my = Math.max(-quality.parallax, Math.min(quality.parallax, (y / Math.max(1, height)) * quality.parallax))
  }

  const onVisibility = () => {
    running = !document.hidden && !prefersReduced()
    if (running && !rafId) rafId = requestAnimationFrame(draw)
  }

  const destroy = () => {
    running = false
    initialized = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
    clearTimeout(resizeTimer)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    const old = document.getElementById('bg-fog')
    if (old) old.remove()
    canvas = null
    ctx = null
  }

  const init = () => {
    if (!ENABLE_FOG || prefersReduced()) {
      destroy()
      return
    }

    // DOMContentLoaded 与 load 都可能触发，已有实例时不重复初始化。
    if (initialized && document.getElementById('bg-fog')) return

    destroy()
    initialized = true
    createCanvas()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    running = true
    rafId = requestAnimationFrame(draw)
  }

  document.addEventListener('DOMContentLoaded', init, { once: true })
  window.addEventListener('load', init, { once: true })
  document.addEventListener('pjax:success', init)
  document.addEventListener('pjax:send', destroy)
  window.bgFog = { init, destroy }
})()
