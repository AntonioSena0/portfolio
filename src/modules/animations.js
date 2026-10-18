import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createHeroIntro } from './particles.js'

gsap.registerPlugin(ScrollTrigger)

export function initAnimations(lenis) {
  initCursor()
  initHero()
  initReveals()
  initTilt()
  initAnchors(lenis)
  initToTop(lenis)
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
  const elements = document.querySelectorAll('.section-head, .about-text > p, .about-card, .project, .contact-list li, .quote blockquote')

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
  const cards = document.querySelectorAll('.project, .about-card, .contact-list li')

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
