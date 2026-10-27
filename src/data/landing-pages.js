// Designs de landing page: cada um é HTML/CSS/JS puro, sem build
// e sem node_modules — dependência externa é CDN. As capturas são da primeira
// dobra de cada design, com o movimento congelado. Textos exibidos têm pt/en.
export const landingPages = [
  {
    slug: 'cuberto',
    title: 'Cuberto',
    redo: { pt: 'Refiz — interface da internet', en: 'Redone — interface from the web' },
    climate: { pt: 'Claro, editorial', en: 'Light, editorial' },
    sections: { pt: '10 seções', en: '10 sections' },
    movement: { pt: 'Acordeão por scroll, parede que se divide', en: 'Scroll accordion, a wall that splits' },
    when: 'Agência, consultoria, marca pessoal, produto B2B',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Tailwind'],
    image: '/media/landing/cuberto.png'
  },
  {
    slug: 'lusion',
    title: 'Lusion',
    redo: { pt: 'Refiz — interface da internet', en: 'Redone — interface from the web' },
    climate: { pt: 'Escuro, imersivo', en: 'Dark, immersive' },
    sections: { pt: '7 seções', en: '7 sections' },
    movement: { pt: 'Palavra mascarada, clip reveal, parallax com scrub', en: 'Masked word, clip reveal, scrubbed parallax' },
    when: 'Estúdio criativo, 3D, produto premium',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Canvas'],
    image: '/media/landing/lusion.png'
  },
  {
    slug: 'marea',
    title: 'Marea',
    climate: { pt: 'Claro, mineral', en: 'Light, mineral' },
    sections: { pt: '9 seções', en: '9 sections' },
    movement: { pt: 'Galeria horizontal presa, curvas de nível em canvas', en: 'Pinned horizontal gallery, contour lines on canvas' },
    when: 'Arquitetura, paisagismo, ateliê, marca autoral',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Canvas'],
    image: '/media/landing/marea.png'
  },
  {
    slug: 'signal',
    title: 'Signal',
    climate: { pt: 'Claro, técnico', en: 'Light, technical' },
    sections: { pt: '8 seções', en: '8 sections' },
    movement: { pt: 'Cartões que empilham (sticky), gráfico, contadores', en: 'Stacking (sticky) cards, chart, counters' },
    when: 'Produto técnico, infraestrutura, API, B2B',
    stack: ['HTML', 'CSS', 'JS'],
    image: '/media/landing/signal.png'
  },
  {
    slug: 'oficina',
    title: 'Oficina',
    climate: { pt: 'Claro, cartaz', en: 'Light, poster-like' },
    sections: { pt: '9 seções', en: '9 sections' },
    movement: { pt: 'Máscara por clip-path, ticker, hover de preenchimento', en: 'clip-path mask, ticker, fill on hover' },
    when: 'Escola, curso, evento cultural, oficina',
    stack: ['HTML', 'CSS', 'JS'],
    image: '/media/landing/oficina.png'
  },
  {
    slug: 'brasa',
    title: 'Brasa',
    climate: { pt: 'Escuro, quente', en: 'Dark, warm' },
    sections: { pt: '9 seções', en: '9 sections' },
    movement: { pt: 'Campo de brasas em canvas, faixa acelerada pelo scroll, palavra pinada', en: 'Ember field on canvas, strip driven by scroll, pinned word' },
    when: 'Selo, estúdio, bar, marca noturna',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Canvas'],
    image: '/media/landing/brasa.png'
  },
  {
    slug: 'deriva',
    title: 'Deriva',
    climate: { pt: 'Claro, frio', en: 'Light, cold' },
    sections: { pt: '9 seções', en: '9 sections' },
    movement: { pt: 'Dois campos de corrente em canvas, seção pinada, isóbatas que se desenham', en: 'Two current fields on canvas, pinned section, isobaths drawn in' },
    when: 'Ciência, dado aberto, instituto, relatório anual',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Canvas'],
    image: '/media/landing/deriva.png'
  },
  {
    slug: 'peso',
    title: 'Peso',
    climate: { pt: 'Claro, giz', en: 'Light, chalk' },
    sections: { pt: '9 seções', en: '9 sections' },
    movement: { pt: 'Glifo que engorda com o cursor, alfabeto pinado que corre, grade de pontos', en: 'Glyph that fattens with the cursor, pinned scrolling alphabet, dot grid' },
    when: 'Fundidora, estúdio de design, ferramenta, tipografia',
    stack: ['HTML', 'CSS', 'JS', 'GSAP', 'Canvas'],
    image: '/media/landing/peso.png'
  }
]
