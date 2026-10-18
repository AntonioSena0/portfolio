const PHOTO_SRC = '/media/portrait-crop.jpg'

const TIMES = {
  drop: 1.25,
  name: 1.35,
  role: 2.0,
  explode: 3.1,
  converge: 4.35,
  settle: 5.7,
  done: 6.1
}

const EXPLODE_SPAN = TIMES.converge - TIMES.explode
const CONVERGE_SPAN = TIMES.settle - TIMES.converge

const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)
const easeInOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const rand = (min, max) => min + Math.random() * (max - min)

function buildDotSprite(size = 24) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 0.5, 0, Math.PI * 2)
  ctx.fill()
  return canvas
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

export function createHeroIntro(canvas, options = {}) {
  const { onName, onRole, onExplode, onPhoto, onDone } = options
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const sprite = buildDotSprite()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let width = 0
  let height = 0
  let particles = []
  let disperse = 0
  let image = null
  let ready = false
  let startTime = 0
  let rafId = 0

  const fired = new Set()

  function heroBox() {
    const size = Math.min(height * 0.66, width * 0.52, 470)
    return {
      size,
      x: (width - size) / 2,
      y: (height - size) / 2
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function sampleTextPoints() {
    const bounds = canvas.getBoundingClientRect()
    const elements = [document.querySelector('.hero-name'), document.querySelector('.hero-role')]
    const points = []

    for (const element of elements) {
      if (!element) continue

      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      const text = element.textContent.trim()
      if (!text) continue

      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const g = off.getContext('2d', { willReadFrequently: true })

      const fontSize = parseFloat(style.fontSize)
      const letterSpacing = parseFloat(style.letterSpacing) || 0
      g.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`
      g.textBaseline = 'middle'
      g.fillStyle = '#fff'

      const chars = [...text]
      const widths = chars.map((char) => g.measureText(char).width)
      const total = widths.reduce((sum, value) => sum + value, 0) + letterSpacing * (chars.length - 1)

      const centerX = rect.left - bounds.left + rect.width / 2
      const centerY = rect.top - bounds.top + rect.height / 2

      let cursor = centerX - total / 2
      chars.forEach((char, index) => {
        g.fillText(char, cursor, centerY)
        cursor += widths[index] + letterSpacing
      })

      const data = g.getImageData(0, 0, off.width, off.height).data
      const step = Math.max(3, Math.round(fontSize / 24))

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] > 120) points.push({ x, y })
        }
      }
    }

    return points
  }

  function samplePhotoPoints() {
    if (!image) return []

    const box = heroBox()
    const res = Math.max(160, Math.round(box.size))

    const off = document.createElement('canvas')
    off.width = res
    off.height = res
    const g = off.getContext('2d', { willReadFrequently: true })

    const scale = Math.max(res / image.width, res / image.height)
    const drawWidth = image.width * scale
    const drawHeight = image.height * scale
    g.drawImage(image, (res - drawWidth) / 2, (res - drawHeight) / 2, drawWidth, drawHeight)

    const data = g.getImageData(0, 0, res, res).data
    const step = Math.max(4, Math.round(res / 92))
    const points = []
    const half = res / 2

    for (let y = 0; y < res; y += step) {
      for (let x = 0; x < res; x += step) {
        const i = (y * res + x) * 4
        const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
        if (luminance < 0.12) continue

        const nx = (x - half) / half
        const ny = (y - half) / half
        const distance = Math.sqrt(nx * nx + ny * ny)
        if (distance > 1) continue

        const falloff = 1 - Math.max(0, (distance - 0.66) / 0.34) * 0.95
        if (falloff <= 0.05) continue

        const tone = Math.pow(luminance, 1.05)

        points.push({
          x: box.x + (x / res) * box.size,
          y: box.y + (y / res) * box.size,
          alpha: (0.24 + tone * 0.72) * falloff,
          radius: 0.85 + tone * 0.75,
          delay: rand(0, 0.45)
        })
      }
    }

    return points
  }

  function buildParticles() {
    const textPoints = sampleTextPoints()
    const photoPoints = samplePhotoPoints()
    if (!textPoints.length || !photoPoints.length) return false

    const centerX = width / 2
    const centerY = height / 2

    particles = photoPoints.map((point, index) => {
      const origin = textPoints[index % textPoints.length]
      const dx = origin.x - centerX
      const dy = origin.y - centerY
      const distance = Math.hypot(dx, dy) || 1
      const force = rand(120, 280) * (0.4 + Math.min(distance / (width * 0.45), 1))
      const angle = rand(0, Math.PI * 2)

      return {
        tx: origin.x,
        ty: origin.y,
        px: point.x,
        py: point.y,
        vx: (dx / distance) * force + rand(-30, 30),
        vy: (dy / distance) * force - rand(20, 80),
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        radius: point.radius,
        alpha: point.alpha,
        delay: point.delay
      }
    })

    return true
  }

  function fire(key, callback) {
    if (fired.has(key)) return
    fired.add(key)
    if (callback) callback()
  }

  function drawFallingDot(time) {
    const progress = Math.min(1, time / TIMES.drop)
    const eased = 1 - Math.pow(1 - progress, 4)
    const startY = -20
    const endY = height / 2
    const y = startY + (endY - startY) * eased
    const size = 3.4 + eased * 4.4

    ctx.globalAlpha = Math.min(1, progress * 3) * 0.95
    ctx.drawImage(sprite, width / 2 - size, y - size, size * 2, size * 2)
    ctx.globalAlpha = 1
  }

  function drawParticles(time) {
    if (time < TIMES.explode) return

    const explodeAge = Math.min(time - TIMES.explode, EXPLODE_SPAN)
    const convergeAge = Math.max(0, time - TIMES.converge)
    const convergeProgress = Math.min(1, convergeAge / CONVERGE_SPAN)

    for (const particle of particles) {
      let x
      let y
      let alpha
      let radius

      const spread = explodeAge
      const outwardX = particle.tx + particle.vx * spread
      const outwardY = particle.ty + particle.vy * spread + 120 * spread * spread

      if (convergeAge <= 0) {
        const fade = 1 - 0.35 * (explodeAge / EXPLODE_SPAN)
        x = outwardX
        y = outwardY
        alpha = fade
        radius = 1.05
      } else {
        const progress = Math.max(0, Math.min(1, (convergeProgress - particle.delay) / (1 - particle.delay)))
        const eased = easeInOutCubic(progress)
        x = outwardX + (particle.px - outwardX) * eased
        y = outwardY + (particle.py - outwardY) * eased
        radius = 1.05 + (particle.radius - 1.05) * eased
        alpha = (1 - 0.35 * (1 - eased)) * 0.55 + particle.alpha * eased * 0.9
        alpha = Math.min(1, alpha)
      }

      if (disperse > 0) {
        const local = Math.max(0, Math.min(1, (disperse - particle.delay * 0.35) / (1 - particle.delay * 0.35)))
        const spread = local * local * (3 - 2 * local)
        x += particle.dx * spread * 340
        y += particle.dy * spread * 340
        alpha *= 1 - spread
        radius *= 1 - spread * 0.55
      }

      if (alpha <= 0.02) continue

      ctx.globalAlpha = alpha
      ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2)
    }

    ctx.globalAlpha = 1
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height)

    if (time < TIMES.drop) {
      drawFallingDot(time)
      return
    }

    drawParticles(time)
  }

  function loop(now) {
    const time = (now - startTime) / 1000

    if (time >= TIMES.name) fire('name', onName)
    if (time >= TIMES.role) fire('role', onRole)
    if (time >= TIMES.explode) {
      fire('explode', () => {
        if (buildParticles()) {
          if (onExplode) onExplode()
        } else if (onPhoto) {
          onPhoto()
        }
      })
    }
    if (time >= TIMES.settle) fire('photo', onPhoto)
    if (time >= TIMES.done) fire('done', onDone)

    render(time)
    rafId = requestAnimationFrame(loop)
  }

  async function start() {
    image = await loadImage(PHOTO_SRC)
    resize()
    ready = true

    if (reduced) {
      fire('name', onName)
      fire('role', onRole)
      buildParticles()
      fire('photo', onPhoto)
      fire('done', onDone)
      render(99)
      return
    }

    startTime = performance.now()
    rafId = requestAnimationFrame(loop)
  }

  let resizeTimer = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (!ready) return
      resize()
      if (particles.length) buildParticles()
      render(99)
    }, 180)
  })

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start)
  } else {
    start()
  }

  return {
    setDisperse(value) {
      disperse = Math.max(0, Math.min(1, value))
    },
    destroy() {
      cancelAnimationFrame(rafId)
    }
  }
}
