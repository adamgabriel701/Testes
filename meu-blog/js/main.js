// Configurar Marked para usar Highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

// Preencher Configuração do Site
document.getElementById('pageTitle').innerText = `${SITE_CONFIG.title} — ${SITE_CONFIG.role}`;
document.getElementById('footerName').innerText = SITE_CONFIG.author;
document.getElementById('year').innerText = new Date().getFullYear();
document.getElementById('currentDate').innerText = new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' });
document.getElementById('heroSubtitle').innerText = SITE_CONFIG.hero.subtitle;
document.getElementById('heroDescription').innerHTML = SITE_CONFIG.hero.description.replace(SITE_CONFIG.author, `<span style="color: var(--fg); font-weight: 500;">${SITE_CONFIG.author}</span>`);

// Renderizar Nav
const navLinks = document.getElementById('navLinks');
SITE_CONFIG.nav.forEach(item => {
  navLinks.innerHTML += `<a href="${item.url}" class="hover-link">${item.label}</a>`;
});

// Renderizar Estatísticas
const statsGrid = document.getElementById('statsGrid');
SITE_CONFIG.stats.forEach(stat => {
  statsGrid.innerHTML += `
    <div>
      <div class="font-mono font-bold text-3xl md:text-4xl accent">${stat.value}</div>
      <div class="font-mono text-xs uppercase tracking-widest mt-2 muted">${stat.label}</div>
    </div>`;
});

// Renderizar Setup
const setupGrid = document.getElementById('setupGrid');
SITE_CONFIG.setup.forEach(tool => {
  setupGrid.innerHTML += `
    <div class="setup-item">
      <i class="${tool.icon}"></i>
      <div class="font-mono text-sm">${tool.name}</div>
    </div>`;
});

// Renderizar Marquee
const marqueeContent = document.getElementById('marqueeContent');
const marqueeItems = SITE_CONFIG.setup.map(t => `<span>${t.name}</span><span>·</span>`).join('');
marqueeContent.innerHTML = marqueeItems + marqueeItems; 

// Renderizar Redes Sociais
const socialLinks = document.getElementById('socialLinks');
SITE_CONFIG.socials.forEach(social => {
  socialLinks.innerHTML += `<a href="${social.url}" target="_blank" rel="noopener" class="hover-link text-lg" aria-label="Rede Social"><i class="${social.icon}"></i></a>`;
});

// Renderizar Snippets
const snippetsGrid = document.getElementById('snippetsGrid');
BLOG_DATA.snippets.forEach((snippet, index) => {
  const highlightedCode = hljs.highlightAuto(snippet.code, [snippet.lang]).value;
  snippetsGrid.innerHTML += `
    <div class="code-window reveal">
      <div class="code-header">
        <span class="font-mono text-xs muted">${snippet.title}</span>
        <button class="copy-btn" data-code-id="snippet-${index}">
          <i class="fas fa-copy"></i> <span>copiar</span>
        </button>
      </div>
      <pre><code id="snippet-${index}" class="hljs language-${snippet.lang}">${highlightedCode}</code></pre>
    </div>`;
});

// Lógica de Copiar Snippet
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const codeId = btn.dataset.codeId;
    const codeEl = document.getElementById(codeId);
    navigator.clipboard.writeText(codeEl.innerText);
    btn.classList.add('copied');
    btn.querySelector('span').innerText = 'copiado!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.querySelector('span').innerText = 'copiar';
    }, 2000);
  });
});

// Renderizar Posts (Notícias)
const postsGrid = document.getElementById('postsGrid');
function renderPosts(filter = '') {
  postsGrid.innerHTML = '';
  const filteredPosts = BLOG_DATA.posts.filter(post => 
    post.title.toLowerCase().includes(filter.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredPosts.length === 0) {
    document.getElementById('noResults').classList.remove('hidden');
    return;
  }
  document.getElementById('noResults').classList.add('hidden');

  filteredPosts.forEach(post => {
    postsGrid.innerHTML += `
      <article class="article-card reveal visible" onclick="openPost('${post.slug}')">
        <div class="flex items-start justify-between mb-6">
          <div class="card-num">${post.id}</div>
          <span class="tag">${post.tags[0]}</span>
        </div>
        <div class="font-mono text-xs mb-4 muted">${post.date} — ${post.readTime} de leitura</div>
        <h3 class="font-bold text-2xl mb-4 leading-tight">${post.title}</h3>
        <p class="text-sm mb-8 muted" style="line-height: 1.65;">${post.excerpt}</p>
        <div class="flex items-center gap-2 font-mono text-xs uppercase tracking-widest accent">
          <span>ler artigo</span>
          <span class="arrow">→</span>
        </div>
      </article>`;
  });
}
renderPosts();

// Busca
document.getElementById('searchInput').addEventListener('input', (e) => renderPosts(e.target.value));

// Renderizar Arquivo
const archiveList = document.getElementById('archiveList');
BLOG_DATA.posts.forEach(post => {
  archiveList.innerHTML += `
    <a href="javascript:void(0)" onclick="openPost('${post.slug}')" class="archive-item">
      <div class="font-mono text-xs w-24 flex-shrink-0 muted">${post.date}</div>
      <div class="flex-1 min-w-0">
        <div class="text-xl md:text-2xl archive-title mb-1 font-bold">${post.title}</div>
        <div class="text-sm muted">${post.excerpt}</div>
      </div>
      <div class="tag hidden md:inline-block">${post.tags[0]}</div>
      <div class="font-mono text-xs w-16 text-right flex-shrink-0 muted">${post.readTime}</div>
    </a>`;
});

// Lógica de Abrir Post (Integra com o terminal)
function openPost(slug) {
  const post = BLOG_DATA.posts.find(p => p.slug === slug);
  if (!post) return;
  
  const html = marked.parse(post.content);
  const term = document.getElementById('terminalOutput');
  term.innerHTML += `<div class="line success">--- abrindo ${post.slug}.md ---</div>`;
  term.innerHTML += `<div class="line">${html}</div>`;
  term.scrollTop = term.scrollHeight;
  
  // Rola a página manualmente parando exatamente no topo do terminal
  const terminalElement = document.getElementById('terminal');
  const topPos = terminalElement.getBoundingClientRect().top + window.scrollY - 90; // -90 compensa a navbar fixa
  
  window.scrollTo({
    top: topPos,
    behavior: 'smooth'
  });
}

// Efeito de Máquina de Escrever
const typeEl = document.getElementById('typewriter');
let gIdx = 0, cIdx = 0, deleting = false;
function tick() {
  const current = SITE_CONFIG.hero.greetings[gIdx];
  if (deleting) {
    cIdx--; typeEl.textContent = current.slice(0, cIdx);
    if (cIdx === 0) { deleting = false; gIdx = (gIdx + 1) % SITE_CONFIG.hero.greetings.length; setTimeout(tick, 400); return; }
    setTimeout(tick, 35);
  } else {
    cIdx++; typeEl.textContent = current.slice(0, cIdx);
    if (cIdx === current.length) { deleting = true; setTimeout(tick, 2200); return; }
    setTimeout(tick, 75 + Math.random() * 50);
  }
}
tick();

// Alternar Tema
const themeButtons = document.querySelectorAll('.theme-btn');
const root = document.documentElement;
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('devlog-theme', theme); } catch (e) {}
  themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
}
themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
try { const saved = localStorage.getItem('devlog-theme'); if (saved) setTheme(saved); } catch (e) {}

// Barra de Progresso e Voltar ao Topo
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
  
  if (scrollTop > 300) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Revelar ao Rolar
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));