import { projects } from '../data/projects.js'

const NAV_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' }
]

const ARISTOTLE_QUOTE = 'Porque aprendemos a fazer as coisas fazendo-as: é construindo que nos tornamos construtores, e tocando lira que nos tornamos citaristas.'
const ARISTOTLE_AUTHOR = 'Aristóteles, Ética a Nicômaco'

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
          ${NAV_LINKS.map(link => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
        </ul>
      </div>
    </nav>

    <main id="top">
      ${heroSection()}
      ${aboutSection()}
      ${projectsSection()}
      ${contactSection()}
      ${quoteSection()}
    </main>

    <footer class="footer">
      <p>&copy; ${new Date().getFullYear()} Antonio Sena</p>
    </footer>

    <button id="to-top" class="to-top glass" type="button" aria-label="Voltar ao topo">
      <span aria-hidden="true">&uarr;</span>
    </button>
  `
}

function heroSection() {
  return `
    <section class="hero">
      <canvas class="hero-canvas" aria-hidden="true"></canvas>

      <div class="hero-main">
        <div class="hero-intro">
          <h1 class="hero-name">Antonio Sena</h1>
          <p class="hero-role">Desenvolvedor Back-end</p>
        </div>
      </div>

      <div class="hero-copy">
        <p class="hero-desc">
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
        <h2>Sobre</h2>
      </header>

      <div class="about">
        <div class="about-text">
          <p class="lead">
            Desenvolvo back-end em Java com Spring Boot. Também trabalho com
            Laravel e JavaScript quando o projeto pede.
          </p>
          <p>
            Estou no curso de Desenvolvimento de Sistemas na ETEC da Zona Leste.
            Meu interesse vai além de fazer o código rodar: quero entender por que
            uma decisão de projeto é tomada, o que ela custa e quando deixa de valer
            a pena.
          </p>
          <p>
            Arquitetura de software e design de sistemas são áreas que estudo
            continuamente. Não me considero especialista nelas — estou aprendendo,
            e uso cada projeto como forma de praticar esses conceitos.
          </p>
        </div>

        <aside class="about-card glass">
          <img class="about-photo" src="/media/portrait-crop.jpg" alt="Retrato de Antonio Sena" loading="lazy">
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
        <h2>Projetos</h2>
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
          <p class="project-desc">${project.description}</p>
          <ul class="project-tags">
            ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
          </ul>
        </div>
        <span class="project-arrow" aria-hidden="true">&nearr;</span>
      </a>
    </li>
  `
}

function contactSection() {
  return `
    <section id="contato" class="section">
      <header class="section-head">
        <span class="section-num">03</span>
        <h2>Contato</h2>
      </header>

      <ul class="contact-list">
        <li class="contact-static">
          <span class="contact-label">E-mail</span>
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
        <p>&ldquo;${ARISTOTLE_QUOTE}&rdquo;</p>
        <cite>${ARISTOTLE_AUTHOR}</cite>
      </blockquote>
    </section>
  `
}
