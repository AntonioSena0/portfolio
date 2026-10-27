import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createHeroIntro } from './particles.js'
import { recommendations } from '../data/recommendations.js'
import { pickText } from './ui.js'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations(lenis) {
  initCursor()
  initHero()
  initReveals()
  initTilt()
  initAnchors(lenis)
  initToTop(lenis)
  initLandingRail()
  initRecommendationModal(lenis)
  initResumeModal(lenis)
}

// Carrossel horizontal dos designs: rolagem com snap, setas e teclado.
function initLandingRail() {
  const rail = document.querySelector('.landing-rail')
  if (!rail) return

  const nav = document.querySelector('.landing-nav')
  const prev = nav ? nav.querySelector('[data-dir="-1"]') : null
  const next = nav ? nav.querySelector('[data-dir="1"]') : null

  const step = () => {
    const card = rail.querySelector('.landing-card')
    if (!card) return rail.clientWidth * 0.8
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 16
    return card.offsetWidth + gap
  }

  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 1
    if (prev) prev.disabled = rail.scrollLeft <= 1
    if (next) next.disabled = rail.scrollLeft >= max
  }

  const move = (dir) => {
    rail.scrollBy({ left: dir * step(), behavior: 'smooth' })
  }

  if (prev) prev.addEventListener('click', () => move(-1))
  if (next) next.addEventListener('click', () => move(1))

  rail.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
  })

  rail.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  window.addEventListener('load', update)
  update()
}

// Overlay genérico: fundo escuro, painel com animação, fecha por ✕, clique
// fora e Esc — com a rolagem da página travada enquanto está aberto.
function createOverlay(modal, lenis) {
  const panel = modal.querySelector('.modal-panel')
  const backdrop = modal.querySelector('.modal-backdrop')

  const open = () => {
    modal.hidden = false
    document.body.classList.add('is-locked')
    if (lenis) lenis.stop()

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    gsap.fromTo(
      panel,
      { opacity: 0, y: 26, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
    )
  }

  const close = () => {
    if (modal.hidden) return

    gsap.to(panel, {
      opacity: 0,
      y: 14,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        modal.hidden = true
        document.body.classList.remove('is-locked')
        if (lenis) lenis.start()
      }
    })
    gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' })
  }

  modal.querySelectorAll('[data-modal-close]').forEach((element) => {
    element.addEventListener('click', close)
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })

  return { open, close }
}

function initRecommendationModal(lenis) {
  const modal = document.getElementById('recommendation-modal')
  if (!modal) return

  const nameEl = modal.querySelector('.modal-name')
  const roleEl = modal.querySelector('.modal-role')
  const dateEl = modal.querySelector('.modal-date')
  const textEl = modal.querySelector('.modal-text')

  const overlay = createOverlay(modal, lenis)

  document.querySelectorAll('.recommendation-more').forEach((button) => {
    button.addEventListener('click', () => {
      const item = recommendations[Number(button.dataset.index)]
      if (!item) return

      nameEl.textContent = item.name
      roleEl.textContent = pickText(item.role) || ''
      roleEl.hidden = !item.role
      dateEl.textContent = pickText(item.date)
      textEl.textContent = pickText(item.message)

      overlay.open()
    })
  })
}

// “Ver PDF” nunca abre aba do navegador: o visor de PDF traz ferramentas de
// edição. O arquivo é exibido aqui, dentro do overlay, só de leitura — com a
// altura do iframe ajustada à página (carta, 612×792) para sair em tamanho cheio.
function initResumeModal(lenis) {
  const modal = document.getElementById('resume-modal')
  if (!modal) return

  const overlay = createOverlay(modal, lenis)
  const frame = modal.querySelector('.resume-modal-frame iframe')

  const fitFrame = () => {
    if (!frame) return
    const width = frame.clientWidth
    if (width) frame.style.height = `${Math.round((width * 792) / 612)}px`
  }

  window.addEventListener('resize', fitFrame)

  document.querySelectorAll('[data-open-resume]').forEach((button) => {
    button.addEventListener('click', () => {
      overlay.open()
      fitFrame()
    })
  })
}

function initAnchors(lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href')
      if (!href) return

      if (href === '#') {
        event.preventDefault()
        lenis.scrollTo(0, { duration: 1.2 })
        return
      }

      const target = document.querySelector(href)
      if (!target) return

      event.preventDefault()
      lenis.scrollTo(target, { offset: -80, duration: 1.3 })
    })
  })
}

function initCursor() {
  const dot = document.getElementById('cursor')
  const glow = document.getElementById('cursor-glow')
  if (!dot || !glow) return

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const dotPos = { ...pos }

  gsap.set([dot, glow], { xPercent: -50, yPercent: -50 })

  const move = (event) => {
    pos.x = event.clientX
    pos.y = event.clientY
  }

  window.addEventListener('pointermove', move, { passive: true })

  gsap.ticker.add(() => {
    glow.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`

    dotPos.x += (pos.x - dotPos.x) * 0.22
    dotPos.y += (pos.y - dotPos.y) * 0.22
    dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`
  })

  const targets = document.querySelectorAll('a, button, .project')
  targets.forEach((element) => {
    element.addEventListener('pointerenter', () => {
      gsap.to(dot, { scale: 2.6, borderColor: 'rgba(255,255,255,0.9)', duration: 0.35, ease: 'power3.out' })
      gsap.to(glow, { opacity: 0.5, scale: 1.25, duration: 0.5, ease: 'power3.out' })
    })
    element.addEventListener('pointerleave', () => {
      gsap.to(dot, { scale: 1, borderColor: 'rgba(255,255,255,0.55)', duration: 0.35, ease: 'power3.out' })
      gsap.to(glow, { opacity: 0.28, scale: 1, duration: 0.5, ease: 'power3.out' })
    })
  })
}

function initHero() {
  const canvas = document.querySelector('.hero-canvas')
  const introEl = document.querySelector('.hero-intro')
  const hero = document.querySelector('.hero')
  if (!canvas || !introEl || !hero) return

  const reveal = () => {
    hero.classList.add('is-photo', 'is-ready')
    introEl.classList.add('is-name', 'is-role', 'is-gone')
  }

  let intro = null

  try {
    intro = createHeroIntro(canvas, {
      onName: () => introEl.classList.add('is-name'),
      onRole: () => introEl.classList.add('is-role'),
      onExplode: () => introEl.classList.add('is-gone'),
      onPhoto: () => {
        hero.classList.add('is-photo')
        hero.classList.add('is-ready')
      }
    })
  } catch (error) {
    reveal()
  }

  window.setTimeout(() => {
    if (!hero.classList.contains('is-ready')) reveal()
  }, 7000)

  const scroll = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=90%',
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        hero.classList.toggle('is-scrolled', self.progress > 0.05)
        if (intro && intro.setDisperse) intro.setDisperse(self.progress)
      }
    }
  })

  scroll.to('.hero-copy', { yPercent: -16, ease: 'none' }, 0)
}

function initReveals() {
  const elements = document.querySelectorAll('.section-head, .about-text > p, .about-card, .about-actions .btn, .project, .landing-rail-wrap, .recommendation, .contact-list li, .quote blockquote')

  elements.forEach((element) => {
    gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true
      }
    })
  })
}

function initTilt() {
  const cards = document.querySelectorAll('.project, .about-card, .recommendation, .contact-list li')

  cards.forEach((card) => {
    const strength = 7

    const onMove = (event) => {
      const rect = card.getBoundingClientRect()
      const relX = (event.clientX - rect.left) / rect.width
      const relY = (event.clientY - rect.top) / rect.height

      card.style.setProperty('--mx', `${relX * 100}%`)
      card.style.setProperty('--my', `${relY * 100}%`)

      gsap.to(card, {
        rotateY: (relX - 0.5) * strength,
        rotateX: (0.5 - relY) * strength,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
    }

    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
  })
}

function initToTop(lenis) {
  const button = document.getElementById('to-top')
  if (!button) return

  button.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  ScrollTrigger.create({
    start: 300,
    end: 'max',
    onToggle: (self) => {
      gsap.to(button, {
        autoAlpha: self.isActive ? 1 : 0,
        y: self.isActive ? 0 : 16,
        duration: 0.35,
        ease: 'power2.out'
      })
    }
  })
}
