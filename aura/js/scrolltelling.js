/* =============================================
   SCROLLYTELLING — Narrativa Cinematográfica
   Animações acionadas pela rolagem via GSAP
   ============================================= */

// Registrar plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Elementos principais
const scrollyContainer = document.getElementById('scrollytelling');
const scrollyCanvas = document.getElementById('scrollyCanvas');
const sCtx = scrollyCanvas.getContext('2d');
const chapters = document.querySelectorAll('.scrolly-chapter');
const chapterDots = document.querySelectorAll('.chapter-dot');
const progressFill = document.getElementById('scrollyProgressFill');
const chapterLabel = document.getElementById('scrollyChapterLabel');

// Estado da narrativa
let currentChapter = 0;
const totalChapters = 5;
const chapterNames = ['Despertar', 'Estrutura', 'Ritmo', 'Profundidade', 'Síntese'];
const chapterColors = ['#E8A838', '#38E8C6', '#E84878', '#8B5CF6', '#E8A838'];

// =============================================
// CANVAS DE FUNDO — Formas abstratas animadas
// =============================================
function resizeScrollyCanvas() {
  scrollyCanvas.width = scrollyContainer.offsetWidth * devicePixelRatio;
  scrollyCanvas.height = scrollyContainer.offsetHeight * devicePixelRatio;
  sCtx.scale(devicePixelRatio, devicePixelRatio);
}
resizeScrollyCanvas();
window.addEventListener('resize', resizeScrollyCanvas);

// Partículas do scrollytelling
const scrollyParticles = [];
for (let i = 0; i < 60; i++) {
  scrollyParticles.push({
    x: Math.random() * 2000, y: Math.random() * 3000,
    baseX: Math.random() * 2000, baseY: Math.random() * 3000,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2,
    angle: Math.random() * Math.PI * 2,
    color: chapterColors[0]
  });
}

// Formas geométricas do storytelling
const scrollyShapes = [
  { type: 'circle', x: 0.2, y: 0.3, size: 120, rotation: 0, opacity: 0 },
  { type: 'triangle', x: 0.7, y: 0.4, size: 100, rotation: 0, opacity: 0 },
  { type: 'square', x: 0.5, y: 0.7, size: 80, rotation: 0, opacity: 0 },
  { type: 'ring', x: 0.3, y: 0.6, size: 150, rotation: 0, opacity: 0 },
  { type: 'cross', x: 0.8, y: 0.2, size: 60, rotation: 0, opacity: 0 }
];

let scrollyProgress = 0;

function drawScrollyFrame() {
  const w = scrollyContainer.offsetWidth;
  const h = scrollyContainer.offsetHeight;
  sCtx.clearRect(0, 0, w, h);

  // Fundo sutil com gradiente
  const bgGrad = sCtx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, 'rgba(8,8,12,0.95)');
  bgGrad.addColorStop(1, 'rgba(14,14,20,0.98)');
  sCtx.fillStyle = bgGrad;
  sCtx.fillRect(0, 0, w, h);

  // Desenhar partículas
  scrollyParticles.forEach((p, i) => {
    p.angle += p.speed * 0.02;
    p.x = p.baseX + Math.sin(p.angle) * 30 * (i % 3 + 1);
    p.y = p.baseY + Math.cos(p.angle * 0.7) * 20 * (i % 2 + 1);

    // Mover com o scroll
    const yOffset = p.y - (scrollyProgress * h * 0.5);
    const wrappedY = ((yOffset % (h + 100)) + h + 100) % (h + 100) - 50;

    sCtx.beginPath();
    sCtx.arc(p.x % w, wrappedY, p.size, 0, Math.PI * 2);
    sCtx.fillStyle = p.color;
    sCtx.globalAlpha = 0.4 + Math.sin(p.angle) * 0.2;
    sCtx.fill();
  });
  sCtx.globalAlpha = 1;

  // Desenhar formas geométricas
  scrollyShapes.forEach((shape, i) => {
    if (shape.opacity < 0.01) return;
    const cx = shape.x * w;
    const cy = shape.y * h - (scrollyProgress * h * 0.3);
    const wrappedCy = ((cy % (h + 300)) + h + 300) % (h + 300) - 150;

    sCtx.save();
    sCtx.translate(cx, wrappedCy);
    sCtx.rotate(shape.rotation);
    sCtx.globalAlpha = shape.opacity;

    const color = chapterColors[currentChapter] || '#E8A838';

    switch (shape.type) {
      case 'circle':
        sCtx.beginPath();
        sCtx.arc(0, 0, Math.max(1, shape.size), 0, Math.PI * 2);
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 2;
        sCtx.stroke();
        break;
      case 'triangle':
        sCtx.beginPath();
        for (let j = 0; j < 3; j++) {
          const a = (j / 3) * Math.PI * 2 - Math.PI / 2;
          const px = Math.cos(a) * shape.size, py = Math.sin(a) * shape.size;
          j === 0 ? sCtx.moveTo(px, py) : sCtx.lineTo(px, py);
        }
        sCtx.closePath();
        sCtx.fillStyle = color;
        sCtx.globalAlpha = shape.opacity * 0.15;
        sCtx.fill();
        sCtx.globalAlpha = shape.opacity;
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 1.5;
        sCtx.stroke();
        break;
      case 'square':
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 1.5;
        sCtx.strokeRect(-shape.size/2, -shape.size/2, shape.size, shape.size);
        break;
      case 'ring':
        sCtx.beginPath();
        sCtx.arc(0, 0, Math.max(1, shape.size), 0, Math.PI * 2);
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 3;
        sCtx.setLineDash([8, 12]);
        sCtx.stroke();
        sCtx.setLineDash([]);
        break;
      case 'cross':
        sCtx.strokeStyle = color;
        sCtx.lineWidth = 2;
        sCtx.beginPath();
        sCtx.moveTo(-shape.size, 0); sCtx.lineTo(shape.size, 0);
        sCtx.moveTo(0, -shape.size); sCtx.lineTo(0, shape.size);
        sCtx.stroke();
        break;
    }
    sCtx.restore();
  });

  requestAnimationFrame(drawScrollyFrame);
}
drawScrollyFrame();

// =============================================
// GSAP SCROLLTRIGGER — Timeline da narrativa
// =============================================

// --- Capítulo 0: Despertar ---
gsap.timeline({
  scrollTrigger: {
    trigger: '#chapter-0',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setChapter(0),
    onEnterBack: () => setChapter(0),
  }
})
.from('#chapter-0 .chapter-number', { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out' })
.from('#chapter-0 .chapter-title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }, '<')
.from('#chapter-0 .chapter-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }, '<')
.to(scrollyShapes[0], { opacity: 0.6, rotation: Math.PI * 0.25, duration: 1, ease: 'power2.out' }, 0)
.to(scrollyShapes[4], { opacity: 0.3, rotation: Math.PI * 0.5, duration: 1.2, ease: 'power2.out' }, 0.2);

// --- Capítulo 1: Estrutura ---
gsap.timeline({
  scrollTrigger: {
    trigger: '#chapter-1',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setChapter(1),
    onEnterBack: () => setChapter(1),
  }
})
.from('#chapter-1 .chapter-number', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
.from('#chapter-1 .chapter-title', { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 }, '<')
.from('#chapter-1 .chapter-text', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }, '<')
.from('#chapter-1 .grid-lines', { scaleY: 0, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }, '<')
.to(scrollyShapes[1], { opacity: 0.7, rotation: -Math.PI * 0.3, size: 130, duration: 1, ease: 'power2.out' }, 0)
.to(scrollyShapes[3], { opacity: 0.5, rotation: Math.PI * 0.4, duration: 1.2, ease: 'power2.out' }, 0.3);

// --- Capítulo 2: Ritmo ---
gsap.timeline({
  scrollTrigger: {
    trigger: '#chapter-2',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setChapter(2),
    onEnterBack: () => setChapter(2),
  }
})
.from('#chapter-2 .chapter-number', { x: 60, opacity: 0, duration: 0.7, ease: 'power3.out' })
.from('#chapter-2 .chapter-title', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 }, '<')
.from('#chapter-2 .chapter-text', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }, '<')
.from('#chapter-2 .wave-container', { scaleX: 0, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 }, '<')
.to(scrollyShapes[2], { opacity: 0.8, rotation: Math.PI * 0.25, size: 100, duration: 1, ease: 'power2.out' }, 0)
.to(scrollyShapes[0], { opacity: 0.2, size: 60, duration: 0.8, ease: 'power2.out' }, 0);

// --- Capítulo 3: Profundidade ---
gsap.timeline({
  scrollTrigger: {
    trigger: '#chapter-3',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setChapter(3),
    onEnterBack: () => setChapter(3),
  }
})
.from('#chapter-3 .chapter-number', { y: -40, opacity: 0, duration: 0.7, ease: 'power3.out' })
.from('#chapter-3 .chapter-title', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }, '<')
.from('#chapter-3 .chapter-text', { y: 30, opacity: 0, duration: 0.8, ease: 'progressHorizontal` 0.3 }, '<')
.from('#chapter-3 .depth-layers', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out', delay: 0.4 }, '<')
.to(scrollyShapes[3], { opacity: 0.9, size: 200, rotation: -Math.PI * 0.2, duration: 1.2, ease: 'power2.out' }, 0)
.to(scrollyShapes[4], { opacity: 0.6, size: 90, rotation: Math.PI, duration: 1, ease: 'power2.out' }, 0.2)
.to(scrollyShapes[1], { opacity: 0.3, size: 60, duration: 0.8 }, 0);

// --- Capítulo 4: Síntese ---
gsap.timeline({
  scrollTrigger: {
    trigger: '#chapter-4',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setChapter(4),
    onEnterBack: () => setChapter(4),
  }
})
.from('#chapter-4 .chapter-number', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)' })
.from('#chapter-4 .chapter-title', { y: 40, opacity: 0, scale: 0.9, duration: 0.9, ease: 'power3.out', delay: 0.2 }, '<')
.from('#chapter-4 .chapter-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }, '<')
.from('#chapter-4 .synthesis-shapes', { opacity: 0, scale: 0.8, rotation: -0.1, duration: 1, ease: 'power3.out', delay: 0.5 }, '<')
// Todas as formas se juntam
.to(scrollyShapes, { opacity: 0.8, size: 70, x: 0.5, y: 0.5, rotation: Math.PI * 0.15, duration: 1.5, ease: 'power3.inOut', stagger: 0.1 }, 0.3);

// =============================================
// Scroll progress da seção scrollytelling
// =============================================
ScrollTrigger.create({
  trigger: scrollyContainer,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    scrollyProgress = self.progress;

    // Atualizar barra de progresso
    if (progressFill) progressFill.style.width = (self.progress * 100) + '%';

    // Atualizar cor das partículas com base no capítulo
    const color = chapterColors[currentChapter] || '#E8A838';
    scrollyParticles.forEach(p => p.color = color);
  }
});

// =============================================
// Troca de capítulo
// =============================================
function setChapter(index) {
  if (index === currentChapter) return;
  const prevChapter = currentChapter;
  currentChapter = index;

  // Atualizar label
  if (chapterLabel) chapterLabel.textContent = chapterNames[index];

  // Atualizar dots
  chapterDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.style.background = i === index ? chapterColors[i] : 'var(--border)';
  });

  // Som de transição
  AudioSystem.transition();
}

// =============================================
// Wave SVG animada (Capítulo 2)
// =============================================
function initWaveAnimation() {
  const waveContainer = document.querySelector('#chapter-2 .wave-container');
  if (!waveContainer) return;

  let waveOffset = 0;
  function drawWave() {
    waveOffset += 0.03;
    let path = 'M0,40';
    for (let x = 0; x <= 400; x += 5) {
      const y = 40 + Math.sin((x * 0.02) + waveOffset) * 15 + Math.sin((x * 0.01) + waveOffset * 1.5) * 8;
      path += ` L${x},${y}`;
    }
    path += ' L400,80 L0,80 Z';
    const svgPath = waveContainer.querySelector('path');
    if (svgPath) svgPath.setAttribute('d', path);
    requestAnimationFrame(drawWave);
  }
  drawWave();
}
initWaveAnimation();

// =============================================
// Grid Lines animadas (Capítulo 1)
// =============================================
(function initGridLines() {
  const grid = document.querySelector('#chapter-1 .grid-lines');
  if (!grid) return;
  let offset = 0;
  function animateGrid() {
    offset += 0.3;
    grid.style.backgroundPosition = `${offset}px ${offset * 0.5}px`;
    requestAnimationFrame(animateGrid);
  }
  animateGrid();
})();

// =============================================
// Depth Layers parallax (Capítulo 3)
// =============================================
ScrollTrigger.create({
  trigger: '#chapter-3',
  start: 'top bottom',
  end: 'bottom top',
  onUpdate: (self) => {
    const layers = document.querySelectorAll('#chapter-3 .depth-layer');
    layers.forEach((layer, i) => {
      const speed = (i + 1) * 15;
      layer.style.transform = `translateY(${self.progress * speed - speed/2}px)`;
    });
  }
});
