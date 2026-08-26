/* =============================================
   O FAROL DO FIM DO MUNDO
   Scrollytelling Literário — Motor de animação
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

// =============================================
// 1. SPLIT DE PALAVRAS
// Transforma <p class="word-reveal"> em spans
// =============================================
document.querySelectorAll('.word-reveal').forEach(paragraph => {
  const text = paragraph.textContent;
  const words = text.split(/(\s+)/); // Preserva espaços
  paragraph.innerHTML = '';

  words.forEach(token => {
    const span = document.createElement('span');
    span.className = 'word' + (/\s/.test(token) ? ' space' : '');
    span.textContent = token;
    paragraph.appendChild(span);
  });
});

// =============================================
// 2. ANIMAÇÃO DE REVELAÇÃO POR PALAVRA
// =============================================
document.querySelectorAll('.word-reveal').forEach(paragraph => {
  const words = paragraph.querySelectorAll('.word:not(.space)');

  if (words.length === 0) return;

  // Posição inicial do parágrafo (para saber quando animar)
  gsap.to(words, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.04,
    scrollTrigger: {
      trigger: paragraph,
      start: 'top 85%',
      end: 'top 35%',
      scrub: true,
    },
    // Callback para adicionar classe "revealed" (acessibilidade)
    onComplete: () => words.forEach(w => w.classList.add('revealed')),
  });
});

// =============================================
// 3. ANIMAÇÕES DE ENTRADA DE ELEMENTOS
// =============================================

// Epígrafe
gsap.from('.epigraph', {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.epigraph',
    start: 'top 70%',
  }
});

// Cabeçalhos de capítulo
document.querySelectorAll('.chapter-header, .epilogue-header').forEach(header => {
  const num = header.querySelector('.chapter-num, .epilogue-title');
  const title = header.querySelector('.chapter-title');
  const rule = header.querySelector('.chapter-rule');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: header,
      start: 'top 75%',
    }
  });

  if (num) tl.from(num, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
  if (title) tl.from(title, { opacity: 0, y: 15, duration: 0.7, ease: 'power3.out' }, '-=0.4');
  if (rule) tl.from(rule, { scaleX: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
});

// Entradas de diário (slide da esquerda)
document.querySelectorAll('.diary-entry').forEach(entry => {
  gsap.from(entry, {
    x: -40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: entry,
      start: 'top 80%',
    }
  });
});

// Marca de fim de capítulo
document.querySelectorAll('.chapter-end-mark').forEach(mark => {
  gsap.from(mark, {
    opacity: 0,
    scale: 0.5,
    duration: 0.6,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: mark,
      start: 'top 85%',
    }
  });
});

// Fim do livro
gsap.from('.book-end', {
  opacity: 0,
  y: 20,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.book-end',
    start: 'top 85%',
  }
});

// =============================================
// 4. INDICADOR DE CAPÍTULO
// =============================================
const indicator = document.getElementById('chapterIndicator');
const indicatorLabel = document.getElementById('indicatorLabel');
let indicatorTimeout;

document.querySelectorAll('.book-section').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => showIndicator(section.dataset.chapter),
    onEnterBack: () => showIndicator(section.dataset.chapter),
  });
});

function showIndicator(name) {
  indicatorLabel.textContent = name;
  indicator.classList.add('visible');
  clearTimeout(indicatorTimeout);
  indicatorTimeout = setTimeout(() => {
    indicator.classList.remove('visible');
  }, 2000);
}

// =============================================
// 5. BARRA DE PROGRESSO DE LEITURA
// =============================================
const progressFill = document.getElementById('progressFill');

ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    progressFill.style.width = (self.progress * 100) + '%';
  }
});

// =============================================
// 6. CANVAS DE ATMOSFERA
// =============================================
const canvas = document.getElementById('atmosCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let atmosType = 'mist';
let canvasW, canvasH;

function resizeCanvas() {
  canvasW = canvas.width = window.innerWidth * devicePixelRatio;
  canvasH = canvas.height = window.innerHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Criar partículas
function createParticles(type) {
  particles = [];
  const count = type === 'storm' ? 120 : (type === 'night' ? 40 : 60);

  for (let i = 0; i < count; i++) {
    const p = {
      x: Math.random() * (canvasW / devicePixelRatio),
      y: Math.random() * (canvasH / devicePixelRatio),
      size: 0,
      speedX: 0,
      speedY: 0,
      opacity: 0,
      color: '',
    };

    switch (type) {
      case 'mist':
        p.size = Math.random() * 60 + 20;
        p.speedX = (Math.random() - 0.5) * 0.15;
        p.speedY = (Math.random() - 0.5) * 0.05;
        p.opacity = Math.random() * 0.04 + 0.01;
        p.color = '200,180,140';
        break;
      case 'storm':
        p.size = Math.random() * 2 + 0.5;
        p.speedX = Math.random() * 4 + 2;
        p.speedY = Math.random() * 2 + 1;
        p.opacity = Math.random() * 0.4 + 0.1;
        p.color = '180,190,210';
        break;
      case 'calm':
        p.size = Math.random() * 3 + 1;
        p.speedX = (Math.random() - 0.5) * 0.1;
        p.speedY = -Math.random() * 0.2 - 0.05;
        p.opacity = Math.random() * 0.15 + 0.05;
        p.color = '200,200,180';
        break;
      case 'night':
        p.size = Math.random() * 2 + 0.5;
        p.speedX = (Math.random() - 0.5) * 0.05;
        p.speedY = (Math.random() - 0.5) * 0.05;
        p.opacity = Math.random() * 0.6 + 0.2;
        p.color = '220,220,240';
        // Posição fixa relativa (estrelas)
        p.baseX = p.x;
        p.baseY = p.y;
        p.twinkleSpeed = Math.random() * 0.02 + 0.005;
        p.twinkleOffset = Math.random() * Math.PI * 2;
        break;
      case 'dawn':
        p.size = Math.random() * 40 + 10;
        p.speedX = (Math.random() - 0.5) * 0.2;
        p.speedY = -Math.random() * 0.1;
        p.opacity = Math.random() * 0.03 + 0.01;
        p.color = '200,160,100';
        break;
    }
    particles.push(p);
  }
}

createParticles('mist');

// Trocar atmosfera conforme a seção
document.querySelectorAll('.book-section').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => {
      atmosType = section.dataset.atmos;
      createParticles(atmosType);
    },
    onEnterBack: () => {
      atmosType = section.dataset.atmos;
      createParticles(atmosType);
    },
  });
});

// Loop de renderização
let frameCount = 0;

function drawAtmosphere() {
  const w = canvasW / devicePixelRatio;
  const h = canvasH / devicePixelRatio;
  ctx.clearRect(0, 0, w, h);
  frameCount++;

  particles.forEach(p => {
    switch (atmosType) {
      case 'mist':
      case 'dawn':
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > w + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = w + p.size;
        if (p.y > h + p.size) p.y = -p.size;
        if (p.y < -p.size) p.y = h + p.size;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.size));
        grad.addColorStop(0, `rgba(${p.color},${p.opacity})`);
        grad.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        break;

      case 'storm':
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > w) { p.x = 0; p.y = Math.random() * h; }
        if (p.y > h) { p.y = 0; p.x = Math.random() * w; }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speedX * 3, p.y - p.speedY * 3);
        ctx.strokeStyle = `rgba(${p.color},${p.opacity})`;
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
        break;

      case 'calm':
        p.x += p.speedX + Math.sin(frameCount * 0.005 + p.x * 0.01) * 0.05;
        p.y += p.speedY;
        if (p.y < -p.size) { p.y = h + p.size; p.x = Math.random() * w; }
        if (p.x > w + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = w + p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
        break;

      case 'night':
        const twinkle = Math.sin(frameCount * p.twinkleSpeed + p.twinkleOffset);
        const alpha = p.opacity * (0.5 + twinkle * 0.5);
        ctx.beginPath();
        ctx.arc(p.baseX, p.baseY, Math.max(0.3, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.max(0, alpha)})`;
        ctx.fill();
        break;
    }
  });

  // Efeito adicional: vinheta sutil
  const vignette = ctx.createRadialGradient(w/2, h/2, w*0.25, w/2, h/2, w*0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  requestAnimationFrame(drawAtmosphere);
}
drawAtmosphere();

// =============================================
// 7. PARALLAX SUTIL NAS SEÇÕES
// =============================================
document.querySelectorAll('.book-section').forEach(section => {
  gsap.to(section.querySelector('.page-content'), {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
});
