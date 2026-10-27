import { projects } from '../data/projects.js'
import { landingPages } from '../data/landing-pages.js'
import { recommendations } from '../data/recommendations.js'

let lang = 'pt'
try {
  if (window.localStorage.getItem('lang') === 'en') lang = 'en'
} catch (error) {
  // sem storage (modo privado): começa em português
}

export const getLang = () => lang

// Escolhe pt/en de um valor { pt, en } (ou repassa strings simples).
export const pickText = (value) => (value && typeof value === 'object' ? (lang === 'en' && value.en ? value.en : value.pt || value.en) : value)

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Pares de texto/atributos nas duas línguas: applyLang() troca no lugar,
// sem re-render — os listeners das animações continuam valendo.
const t = (pt, en) => `data-i18n-pt="${esc(pt)}" data-i18n-en="${esc(en)}"`
const aria = (pt, en) => `data-aria-pt="${esc(pt)}" data-aria-en="${esc(en)}"`
const alt = (pt, en) => `data-alt-pt="${esc(pt)}" data-alt-en="${esc(en)}`
const title = (pt, en) => `data-title-pt="${esc(pt)}" data-title-en="${esc(en)}"`

export function applyLang() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
  document.title =
    lang === 'en'
      ? 'Antonio Sena — Back-end Java Developer'
      : 'Antonio Sena — Desenvolvedor Back-end Java'

  document.querySelectorAll('[data-i18n-pt]').forEach((element) => {
    element.textContent = lang === 'en' ? element.dataset.i18nEn : element.dataset.i18nPt
  })
  document.querySelectorAll('[data-aria-pt]').forEach((element) => {
    element.setAttribute('aria-label', lang === 'en' ? element.dataset.ariaEn : element.dataset.ariaPt)
  })
  document.querySelectorAll('[data-alt-pt]').forEach((element) => {
    element.setAttribute('alt', lang === 'en' ? element.dataset.altEn : element.dataset.altPt)
  })
  document.querySelectorAll('[data-title-pt]').forEach((element) => {
    element.setAttribute('title', lang === 'en' ? element.dataset.titleEn : element.dataset.titlePt)
  })
}

function toggleLang() {
  lang = lang === 'pt' ? 'en' : 'pt'
  try {
    window.localStorage.setItem('lang', lang)
  } catch (error) {
    // sem storage: o estado vale só nesta sessão
  }
  applyLang()
}

const NAV_LINKS = [
  { label: { pt: 'Sobre', en: 'About' }, href: '#sobre' },
  { label: { pt: 'Projetos', en: 'Projects' }, href: '#projetos' },
  { label: { pt: 'Designs', en: 'Designs' }, href: '#landing' },
  { label: { pt: 'Indicações', en: 'Recommendations' }, href: '#indicacoes' },
  { label: { pt: 'Contato', en: 'Contact' }, href: '#contato' }
]

const RESUME = {
  pdf: encodeURI('/docs/Currículo Antonio Sena.pdf'),
  docx: encodeURI('/docs/Currículo Antonio Sena.docx')
}

const ARISTOTLE_QUOTE = {
  pt: 'Porque aprendemos a fazer as coisas fazendo-as: é construindo que nos tornamos construtores, e tocando lira que nos tornamos citaristas.',
  en: 'For we learn a craft by doing the things we do: it is by building that we become builders, and by playing the lyre that we become lyre-players.'
}
const ARISTOTLE_AUTHOR = { pt: 'Aristóteles, Ética a Nicômaco', en: 'Aristotle, Nicomachean Ethics' }

const SKILLS = [
  'Java',
  'Spring Boot',
  'Laravel',
  'PostgreSQL',
  'MySQL',
  'Docker',
  'REST API',
  'Arquitetura de Software',
  'Design de Sistemas'
]

export function renderApp() {
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = `
    <nav class="nav">
      <div class="nav-inner glass">
        <a href="#top" class="nav-mark">Antonio Sena</a>
        <ul class="nav-links">
          ${NAV_LINKS.map(
            (link) => `<li><a href="${link.href}" ${t(link.label.pt, link.label.en)}>${link.label.pt}</a></li>`
          ).join('')}
        </ul>
        <button class="nav-lang" type="button" data-lang-toggle ${aria('Mudar para inglês', 'Switch to Portuguese')} ${t('EN', 'PT')}>EN</button>
      </div>
    </nav>

    <main id="top">
      ${heroSection()}
      ${aboutSection()}
      ${projectsSection()}
      ${landingSection()}
      ${recommendationsSection()}
      ${contactSection()}
      ${quoteSection()}
    </main>

    <footer class="footer">
      <p>&copy; ${new Date().getFullYear()} Antonio Sena</p>
    </footer>

    <button id="to-top" class="to-top glass" type="button" ${aria('Voltar ao topo', 'Back to top')}>
      <span aria-hidden="true">&uarr;</span>
    </button>

    <div class="modal" id="recommendation-modal" hidden>
      <div class="modal-backdrop" data-modal-close></div>
      <div class="modal-panel glass" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="modal-name">
        <button class="modal-close" type="button" ${aria('Fechar', 'Close')} data-modal-close>&times;</button>
        <cite class="modal-name" id="modal-name"></cite>
        <p class="recommendation-role modal-role"></p>
        <p class="recommendation-date modal-date"></p>
        <blockquote class="modal-quote">
          <p class="modal-text"></p>
        </blockquote>
      </div>
    </div>

    <div class="modal resume-modal" id="resume-modal" hidden>
      <div class="modal-backdrop" data-modal-close></div>
      <div class="modal-panel modal-panel--doc glass" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="resume-modal-name">
        <button class="modal-close" type="button" ${aria('Fechar', 'Close')} data-modal-close>&times;</button>
        <cite class="modal-name" id="resume-modal-name" ${t('Currículo Antonio Sena', 'Antonio Sena — Résumé')}>Currículo Antonio Sena</cite>
        <p class="modal-role" ${t(
          'Somente leitura — sem ferramentas de edição. Para levar o arquivo, use Baixar PDF.',
          'Read-only — no editing tools. To take the file with you, use Download PDF.'
        )}>Somente leitura — sem ferramentas de edição. Para levar o arquivo, use Baixar PDF.</p>
        <div class="resume-modal-frame">
          <iframe src="${RESUME.pdf}#toolbar=0&navpanes=0" ${title('Currículo de Antonio Sena', "Antonio Sena's résumé")} loading="lazy"></iframe>
        </div>
      </div>
    </div>
  `

  const langButton = app.querySelector('[data-lang-toggle]')
  if (langButton) langButton.addEventListener('click', toggleLang)

  applyLang()
}

function heroSection() {
  return `
    <section class="hero">
      <canvas class="hero-canvas" aria-hidden="true"></canvas>

      <div class="hero-main">
        <div class="hero-intro">
          <h1 class="hero-name">Antonio Sena</h1>
          <p class="hero-role" ${t('Desenvolvedor Back-end', 'Back-end Developer')}>Desenvolvedor Back-end</p>
        </div>
      </div>

      <div class="hero-copy">
        <p class="hero-desc" ${t(
          'Java, Spring Boot e Docker. Estudante de Desenvolvimento de Sistemas na ETEC da Zona Leste, com interesse em arquitetura de software e design de sistemas.',
          'Java, Spring Boot and Docker. Systems Development student at ETEC da Zona Leste, interested in software architecture and system design.'
        )}>
          Java, Spring Boot e Docker. Estudante de Desenvolvimento de Sistemas
          na ETEC da Zona Leste, com interesse em arquitetura de software e
          design de sistemas.
        </p>
        <ul class="hero-stack">
          <li>Java</li>
          <li>Spring</li>
          <li>Docker</li>
        </ul>
      </div>

      <div class="scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <i></i>
      </div>
    </section>
  `
}

function aboutSection() {
  return `
    <section id="sobre" class="section">
      <header class="section-head">
        <span class="section-num">01</span>
        <h2 ${t('Sobre', 'About')}>Sobre</h2>
      </header>

      <div class="about">
        <div class="about-text">
          <p class="lead" ${t(
            'Desenvolvo back-end em Java com Spring Boot. Também trabalho com Laravel e JavaScript quando o projeto pede.',
            'I build back ends in Java with Spring Boot. I also work with Laravel and JavaScript when the project calls for it.'
          )}>
            Desenvolvo back-end em Java com Spring Boot. Também trabalho com
            Laravel e JavaScript quando o projeto pede.
          </p>
          <p ${t(
            'Estou no curso de Desenvolvimento de Sistemas na ETEC da Zona Leste. Meu interesse vai além de fazer o código rodar: quero entender por que uma decisão de projeto é tomada, o que ela custa e quando deixa de valer a pena.',
            'I am taking the Systems Development course at ETEC da Zona Leste. My interest goes beyond making code run: I want to understand why a design decision is made, what it costs and when it stops being worth it.'
          )}>
            Estou no curso de Desenvolvimento de Sistemas na ETEC da Zona Leste.
            Meu interesse vai além de fazer o código rodar: quero entender por que
            uma decisão de projeto é tomada, o que ela custa e quando deixa de valer
            a pena.
          </p>
          <p ${t(
            'Arquitetura de software e design de sistemas são áreas que estudo continuamente. Não me considero especialista nelas — estou aprendendo, e uso cada projeto como forma de praticar esses conceitos.',
            'Software architecture and system design are fields I study continuously. I do not consider myself an expert in them — I am learning, and I use every project as a way to practice these concepts.'
          )}>
            Arquitetura de software e design de sistemas são áreas que estudo
            continuamente. Não me considero especialista nelas — estou aprendendo,
            e uso cada projeto como forma de praticar esses conceitos.
          </p>

          <div class="about-actions">
            <button class="btn" type="button" data-open-resume ${t('Ver PDF', 'View PDF')}>Ver PDF</button>
            <a class="btn btn-ghost" href="${RESUME.pdf}" download ${t('Baixar PDF', 'Download PDF')}>Baixar PDF</a>
            <a class="btn btn-ghost" href="${RESUME.docx}" download ${t('Baixar DOCX', 'Download DOCX')}>Baixar DOCX</a>
          </div>
        </div>

        <aside class="about-card glass">
          <img class="about-photo" src="/media/portrait-crop.jpg" ${alt('Retrato de Antonio Sena', 'Portrait of Antonio Sena')} alt="Retrato de Antonio Sena" loading="lazy">
          <h3>Stack</h3>
          <ul class="skill-list">
            ${SKILLS.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
          <div class="about-meta">
            <span>ETEC Zona Leste</span>
            <span>São Paulo, BR</span>
          </div>
        </aside>
      </div>
    </section>
  `
}

function projectsSection() {
  return `
    <section id="projetos" class="section">
      <header class="section-head">
        <span class="section-num">02</span>
        <h2 ${t('Projetos', 'Projects')}>Projetos</h2>
      </header>

      <ul class="project-list">
        ${projects.map(renderProject).join('')}
      </ul>
    </section>
  `
}

function renderProject(project, index) {
  return `
    <li class="project glass">
      <a class="project-link" href="${project.url}" target="_blank" rel="noopener noreferrer">
        <span class="project-index">${String(index + 1).padStart(2, '0')}</span>
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc" ${t(project.description.pt, project.description.en)}>${project.description.pt}</p>
          <ul class="project-tags">
            ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
          </ul>
        </div>
        <span class="project-arrow" aria-hidden="true">&nearr;</span>
      </a>
    </li>
  `
}

function landingSection() {
  return `
    <section id="landing" class="section">
      <header class="section-head">
        <span class="section-num">03</span>
        <h2>Designs</h2>
      </header>

      <p class="section-lead" ${t(
        'Oito páginas que já desenvolvi, em HTML, CSS e JS puros. Cada uma tem um clima, uma estrutura de seções e um gesto de movimento próprio. As capturas são da primeira dobra, com o movimento congelado.',
        'Eight pages I have built, in plain HTML, CSS and JS. Each one has its own mood, section structure and motion gesture. The captures are of the first fold, with the motion frozen.'
      )}>
        Oito páginas que já desenvolvi, em HTML, CSS e JS puros. Cada uma tem um clima,
        uma estrutura de seções e um gesto de movimento próprio. As capturas são da
        primeira dobra, com o movimento congelado.
      </p>

      <div class="landing-rail-wrap">
        <ul class="landing-rail" tabindex="0" ${aria('Designs desenvolvidos', 'Designs portfolio')} aria-label="Designs desenvolvidos">
          ${landingPages.map(renderLandingPage).join('')}
        </ul>

        <div class="landing-nav">
          <button class="landing-arrow" type="button" data-dir="-1" ${aria('Design anterior', 'Previous design')}>&larr;</button>
          <button class="landing-arrow" type="button" data-dir="1" ${aria('Próximo design', 'Next design')}>&rarr;</button>
        </div>
      </div>
    </section>
  `
}

function renderLandingPage(page) {
  const metaPt = `${page.climate.pt} · ${page.sections.pt}`
  const metaEn = `${page.climate.en} · ${page.sections.en}`

  return `
    <li class="landing-card glass">
      ${page.redo ? `<span class="landing-badge" ${t(page.redo.pt, page.redo.en)}>${page.redo.pt}</span>` : ''}
      <img class="landing-shot" src="${page.image}" ${alt(`Primeira dobra do design ${page.title}`, `First fold of the design ${page.title}`)} alt="Primeira dobra do design ${page.title}" loading="lazy" width="1200" height="750">
      <div class="landing-body">
        <h3 class="landing-title">${page.title}</h3>
        <p class="landing-meta" ${t(metaPt, metaEn)}>${metaPt}</p>
        <p class="landing-note" ${t(page.movement.pt, page.movement.en)}>${page.movement.pt}</p>
        <ul class="project-tags landing-tags">
          ${page.stack.map(tag => `<li>${tag}</li>`).join('')}
        </ul>
      </div>
    </li>
  `
}

function recommendationsSection() {
  return `
    <section id="indicacoes" class="section">
      <header class="section-head">
        <span class="section-num">04</span>
        <h2 ${t('Indicações', 'Recommendations')}>Indicações</h2>
      </header>

      <ul class="recommendation-list">
        ${recommendations.map(renderRecommendation).join('')}
      </ul>
    </section>
  `
}

function renderRecommendation(item, index) {
  return `
    <li class="recommendation glass">
      <blockquote>
        <p class="recommendation-text" ${t(item.message.pt, item.message.en)}>${item.message.pt}</p>
        <footer class="recommendation-foot">
          <div class="recommendation-who">
            <cite>${item.name}</cite>
            <span class="recommendation-date" ${t(item.date.pt, item.date.en)}>${item.date.pt}</span>
          </div>
          <button class="recommendation-more" type="button" data-index="${index}" ${aria(`Ver indicação completa de ${item.name}`, `Read full recommendation from ${item.name}`)} ${t('Ver mais', 'Read more')}>Ver mais</button>
        </footer>
      </blockquote>
    </li>
  `
}

function contactSection() {
  return `
    <section id="contato" class="section">
      <header class="section-head">
        <span class="section-num">05</span>
        <h2 ${t('Contato', 'Contact')}>Contato</h2>
      </header>

      <ul class="contact-list">
        <li class="contact-static">
          <span class="contact-label" ${t('E-mail', 'Email')}>E-mail</span>
          <span class="contact-value">antonioneto.developer@gmail.com</span>
        </li>
        <li>
          <a class="contact-link" href="https://www.linkedin.com/in/antonio-sena-neto/" target="_blank" rel="noopener noreferrer">
            <span class="contact-label">LinkedIn</span>
            <span class="contact-value">/in/antonio-sena-neto</span>
          </a>
        </li>
        <li>
          <a class="contact-link" href="https://github.com/AntonioSena0" target="_blank" rel="noopener noreferrer">
            <span class="contact-label">GitHub</span>
            <span class="contact-value">@AntonioSena0</span>
          </a>
        </li>
      </ul>
    </section>
  `
}

function quoteSection() {
  return `
    <section class="quote">
      <blockquote class="glass">
        <p ${t(`“${ARISTOTLE_QUOTE.pt}”`, `“${ARISTOTLE_QUOTE.en}”`)}>“${ARISTOTLE_QUOTE.pt}”</p>
        <cite ${t(ARISTOTLE_AUTHOR.pt, ARISTOTLE_AUTHOR.en)}>${ARISTOTLE_AUTHOR.pt}</cite>
      </blockquote>
    </section>
  `
}
