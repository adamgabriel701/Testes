/* =============================================
   READIUM ENGINE
   Motor de Scrollytelling para múltiplos formatos
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

// =============================================
// ESTADO GLOBAL
// =============================================
const State = {
  currentPath: '',
  meta: null,
};

// =============================================
// INICIALIZAÇÃO
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  loadLibrary();
  initAtmosphere();
});

// =============================================
// 1. BIBLIOTECA (LISTA DE CONTEÚDOS)
// =============================================
async function loadLibrary() {
  const libGrid = document.getElementById('libGrid');
  try {
    const res = await fetch('/api/content');
    const folders = await res.json();
    
    // Filtra apenas pastas (ignora arquivos soltos na raiz)
    const dirs = folders.filter(f => !f.includes('.'));

    for (const dir of dirs) {
      const filesRes = await fetch(`/api/content/${dir}`);
      const files = await filesRes.json();
      
      if (files.includes('meta.json')) {
        const metaRes = await fetch(`/content/${dir}/meta.json`);
        const meta = await metaRes.json();
        meta.folder = dir;
        createLibCard(meta, libGrid);
      }
    }
  } catch (err) {
    libGrid.innerHTML = '<p style="color:var(--text-dim); grid-column: 1/-1; text-align:center; font-family:var(--sans);">Erro ao carregar a biblioteca. Verifique se o servidor está rodando.</p>';
  }
}

function createLibCard(meta, container) {
  const card = document.createElement('div');
  card.className = 'lib-card';
  card.onclick = () => openReader(meta.folder);
  
  const hasImage = meta.cover && meta.cover !== '';
  const imgDiv = hasImage 
    ? `<div class="lib-card-img" style="background-image:url('/content/${meta.folder}/${meta.cover}')" data-type="${meta.type}"></div>`
    : `<div class="lib-card-placeholder" data-type="${meta.type}">${getTypeIcon(meta.type)}</div>`;

  card.innerHTML = `
    ${imgDiv}
    <div class="lib-card-body">
      <h3 class="lib-card-title">${meta.title}</h3>
      <span class="lib-card-author">${meta.author || 'Autor desconhecido'}</span>
    </div>
  `;
  container.appendChild(card);
}

function getTypeIcon(type) {
  const icons = { livro: '📖', reportagem: '🎬', revista: '📰', cronica: '✍️', noticias: '📱' };
  return icons[type] || '📄';
}

// =============================================
// 2. ABRIR LEITOR
// =============================================
async function openReader(folder) {
  const loader = document.getElementById('loader');
  loader.classList.remove('hidden');

  try {
    const metaRes = await fetch(`/content/${folder}/meta.json`);
    const meta = await metaRes.json();
    State.meta = meta;
    State.currentPath = folder;

    // Buscar conteúdos dos capítulos
    const chaptersData = [];
    for (const ch of meta.chapters) {
      const fileRes = await fetch(`/content/${folder}/${ch.file}`);
      let content = await fileRes.text();
      
      // Parsear se for Markdown
      if (ch.file.endsWith('.md')) {
        content = parseMarkdown(content, folder);
      } else if (ch.file.endsWith('.txt')) {
        content = `<div class="cronica-text">${escapeHtml(content)}</div>`;
      }
      chaptersData.push({ title: ch.title, html: content });
    }

    renderReader(meta, chaptersData);
    
    // Esconder biblioteca, mostrar leitor
    document.getElementById('library').style.display = 'none';
    const reader = document.getElementById('reader');
    reader.classList.add('active');
    
    // Scroll para topo
    window.scrollTo(0, 0);

    // Aplicar fundo
    document.body.style.background = `var(--bg-${meta.atmosphere || 'mist'})`;

    // Inicializar animações do leitor
    setTimeout(() => {
      initReaderAnimations();
      loader.classList.add('hidden');
    }, 500);

  } catch (err) {
    console.error('Erro ao abrir conteúdo:', err);
    loader.classList.add('hidden');
  }
}

function closeReader() {
  document.getElementById('reader').classList.remove('active');
  document.getElementById('reader').innerHTML = '';
  document.getElementById('library').style.display = 'flex';
  document.body.style.background = 'var(--bg-mist)';
  window.scrollTo(0, 0);
  ScrollTrigger.getAll().forEach(t => t.kill());
}

// =============================================
// 3. MOTOR DE RENDERIZAÇÃO POR TIPO
// =============================================
function renderReader(meta, chapters) {
  const reader = document.getElementById('reader');
  let html = `
    <div class="reading-progress"><div class="reading-progress-fill" id="progressFill"></div></div>
    <button class="btn-back" onclick="closeReader()"><i class="fa-solid fa-arrow-left" style="margin-right:6px;"></i> Biblioteca</button>
  `;

  switch (meta.type) {
    case 'noticias':            // <--- ADICIONE ESTAS 3 LINHAS
      html += renderNoticias(meta, chapters);
      break;
    case 'livro':
      html += renderLivro(meta, chapters);
      break;
    case 'reportagem':
      html += renderReportagem(meta, chapters);
      break;
    case 'revista':
      html += renderRevista(meta, chapters);
      break;
    case 'cronica':
      html += renderCronica(meta, chapters);
      break;
    default:
      html += renderLivro(meta, chapters);
  }

  reader.innerHTML = html;
}

function renderNoticias(meta, chapters) {
  let html = `<div class="layout-noticias">`;
  
  // Cabeçalho
  html += `<div class="reader-header news-header"><h1>${meta.title}</h1><p>${meta.author}</p></div>`;
  
  // Feed de notícias
  html += `<div class="news-feed">`;
  
  chapters.forEach(ch => {
    // O fetcher-g1 separa cada notícia com ---
    const artigos = ch.html.split(/^---$/m);
    
    artigos.forEach(artigo => {
      artigo = artigo.trim();
      if (artigo.length < 50) return; // Ignora blocos vazios
      
      // Extrai o título (primeira linha ##)
      let titulo = '';
      let resto = artigo;
      const tituloMatch = artigo.match(/^## (.*)$/m);
      if (tituloMatch) {
        titulo = tituloMatch[1];
        resto = artigo.replace(/^## .*$/m, '');
      }
      
      // Extrai data e categoria (linhas em *itálico* ou **negrito** no topo)
      let metaText = '';
      resto = resto.replace(/^\*([^*]+)\*$/m, (match, text) => {
        if (!metaText) metaText = text;
        return '';
      });
      resto = resto.replace(/^\*\*([^*]+)\*\*$/m, (match, text) => {
        if (!metaText || metaText.length < 20) metaText = text;
        return '';
      });
      
      // Limpa o resto do texto
      resto = resto.trim();
      
      if (titulo) {
        html += `<article class="news-article">`;
        html += `<h2>${titulo}</h2>`;
        if (metaText) html += `<div class="news-meta"><span>${metaText}</span></div>`;
        if (resto) html += `<div class="word-reveal">${resto}</div>`;
        html += `</article>`;
      }
    });
  });
  
  html += `</div></div>`;
  return html;
}

function renderLivro(meta, chapters) {
  let html = `<div class="layout-livro">`;
  html += `<div class="reader-header"><h1>${meta.title}</h1><p>${meta.author}</p></div>`;
  chapters.forEach(ch => {
    html += `<div class="chapter-block"><h2 class="chapter-title">${ch.title}</h2><div class="prose word-reveal">${ch.html}</div></div>`;
  });
  html += `</div>`;
  return html;
}

function renderReportagem(meta, chapters) {
  let html = `<div class="layout-reportagem">`;
  // Hero Media (Vídeo ou Imagem)
  if (meta.heroMedia) {
    if (meta.heroMedia.type === 'video') {
      html += `<div class="hero-media"><video src="/content/${State.currentPath}/${meta.heroMedia.src}" poster="/content/${State.currentPath}/${meta.heroMedia.poster}" autoplay muted loop playsinline></video></div>`;
    } else {
      html += `<div class="hero-media"><img src="/content/${State.currentPath}/${meta.heroMedia.src}" alt="Capa"></div>`;
    }
  }
  html += `<div class="content-grid"><div class="main-text word-reveal">`;
  chapters.forEach(ch => {
    html += ch.html;
  });
  html += `</div>`; // fecha main-text
  
  // Sidebar (pull quotes extraídas automaticamente ou fixas)
  html += `<aside class="sidebar"><h3>Destaques</h3>`;
  chapters.forEach(ch => {
    const div = document.createElement('div');
    div.innerHTML = ch.html;
    const blockquotes = div.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
      html += `<div class="pull-quote">${bq.textContent}</div>`;
    });
  });
  if (!html.includes('pull-quote')) {
    html += `<div class="pull-quote">Carregue seu conteúdo com blockquotes (>) no Markdown para ver os destaques aqui.</div>`;
  }
  html += `</aside></div></div>`; // fecha grid e layout
  return html;
}

function renderRevista(meta, chapters) {
  let html = `<div class="layout-revista">`;
  const cover = meta.cover ? `/content/${State.currentPath}/${meta.cover}` : '';
  html += `<div class="mag-header" ${cover ? `style="background-image:url('${cover}')"` : ''}>
    <div class="mag-header-content"><h1>${meta.title}</h1><p style="font-family:var(--sans);color:var(--text-dim);font-size:14px;text-transform:uppercase;letter-spacing:2px;">${meta.author}</p></div>
  </div>`;
  
  html += `<div class="mag-body">`;
  chapters.forEach(ch => {
    html += `<div class="mag-col word-reveal">${ch.html}</div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderCronica(meta, chapters) {
  let html = `<div class="layout-cronica"><div class="cronica-wrapper">`;
  html += `<h1 class="cronica-title">${meta.title}</h1>`;
  chapters.forEach(ch => {
    html += ch.html;
  });
  html += `</div></div>`;
  return html;
}

// =============================================
// 4. PARSER DE MARKDOWN (Simples e seguro)
// =============================================
function parseMarkdown(md, folder) {
  let html = md;
  
  // Imagens: ![alt](src) -> <img>
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return `<img src="/content/${folder}/${src}" alt="${alt}" loading="lazy">`;
  });
  
  // Blockquotes: > text -> <blockquote>
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>'); // Junta blockquotes seguidos
  
  // Horizontal Rule: --- ou *** -> <hr>
  html = html.replace(/^---$|^(\*\*\*)$/gm, '<hr>');
  
  // Headers: ## -> h2, ### -> h3
  html = html.replace(/^###\s(.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s(.*$)/gm, '<h2>$1</h2>');
  
  // Bold: **text** -> <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text* -> <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Parágrafos: Dupla quebra de linha ou blocos soltos
  html = html.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<img') || block.startsWith('<hr') || block.startsWith('<blockquote')) {
      return block;
    }
    // Linhas simples viram <p>
    return block.split(/\n/).map(line => {
      line = line.trim();
      return line ? `<p>${line}</p>` : '';
    }).join('');
  }).join('\n');

  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================
// 5. ANIMAÇÕES DO LEITOR
// =============================================
function initReaderAnimations() {
  // Word Reveal
  document.querySelectorAll('.word-reveal').forEach(container => {
    // Se já tem tags HTML internas (img, blockquote), não faz split de palavras,
    // aplica fade-in no bloco inteiro
    if (container.querySelector('img, blockquote, h2, h3, hr')) {
      gsap.from(container.querySelectorAll('p'), {
        opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: container, start: 'top 80%', }
      });
      return;
    }

    // Split de palavras para texto puro
    const textNodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const text = node.textContent;
      if (!text.trim()) return;
      const words = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(token => {
        const span = document.createElement('span');
        span.className = 'word' + (/\s/.test(token) ? ' space' : '');
        span.textContent = token;
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });

    const words = container.querySelectorAll('.word:not(.space)');
    if (words.length === 0) return;

    gsap.to(words, {
      opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03,
      scrollTrigger: { trigger: container, start: 'top 85%', end: 'top 35%', scrub: true }
    });
  });

  // Elementos especiais
  gsap.from('.chapter-title', { opacity: 0, y: 20, duration: 0.8, scrollTrigger: { trigger: '.chapter-title', start: 'top 80%' } });
  gsap.from('.cronica-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cronica-title', start: 'top 75%' } });
  gsap.from('.mag-header-content', { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.mag-header', start: 'top 60%' } });
  gsap.from('.pull-quote', { x: 30, opacity: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: '.sidebar', start: 'top 80%' } });

  // Progresso
  ScrollTrigger.create({
    trigger: '#reader', start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => { document.getElementById('progressFill').style.width = (self.progress * 100) + '%'; }
  });
}

// =============================================
// 6. CANVAS DE ATMOSFERA
// =============================================
function initAtmosphere() {
  const canvas = document.getElementById('atmosCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h, frame = 0;

  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * (w / devicePixelRatio),
      y: Math.random() * (h / devicePixelRatio),
      size: Math.random() * 50 + 20,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.05,
      opacity: Math.random() * 0.03 + 0.01,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w / devicePixelRatio, h / devicePixelRatio);
    frame++;
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      const rw = w / devicePixelRatio, rh = h / devicePixelRatio;
      if (p.x > rw + p.size) p.x = -p.size;
      if (p.x < -p.size) p.x = rw + p.size;
      if (p.y > rh + p.size) p.y = -p.size;
      if (p.y < -p.size) p.y = rh + p.size;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.size));
      grad.addColorStop(0, `rgba(200,180,140,${p.opacity})`);
      grad.addColorStop(1, 'rgba(200,180,140,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    });
    requestAnimationFrame(draw);
  }
  draw();
}
