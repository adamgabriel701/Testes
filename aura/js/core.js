/* =============================================
   CORE — Navegação, Zen, Toast, Scroll, Init
   ============================================= */

// --- TOAST ---
window.showToast = function(message) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = message;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 2500);
};

// --- NAVEGAÇÃO ORBITAL ---
const navTrigger = document.getElementById('navTrigger');
const orbitalNav = document.getElementById('orbitalNav');
const navIcon = document.getElementById('navIcon');
let navOpen = false;

navTrigger.addEventListener('click', () => {
  navOpen = !navOpen;
  orbitalNav.classList.toggle('open', navOpen);
  navTrigger.classList.toggle('active', navOpen);
  navIcon.className = navOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-plus';
  AudioSystem.click();
});

orbitalNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navOpen = false; orbitalNav.classList.remove('open');
    navTrigger.classList.remove('active');
    navIcon.className = 'fa-solid fa-plus';
    AudioSystem.transition();
  });
});

document.addEventListener('click', (e) => {
  if (navOpen && !orbitalNav.contains(e.target) && !navTrigger.contains(e.target)) {
    navOpen = false; orbitalNav.classList.remove('open');
    navTrigger.classList.remove('active');
    navIcon.className = 'fa-solid fa-plus';
  }
});

// --- MODO ZEN ---
let zenMode = false;
document.getElementById('zenBtn').addEventListener('click', () => {
  zenMode = !zenMode;
  document.body.classList.toggle('zen-mode', zenMode);
  document.getElementById('zenBtn').classList.toggle('active', zenMode);
  AudioSystem.click();
  showToast(zenMode ? 'Modo Zen ativado — apenas estrutura' : 'Modo Zen desativado');
});

// --- BOTÃO DE SOM ---
document.getElementById('soundBtn').addEventListener('click', () => {
  const on = AudioSystem.toggle();
  const btn = document.getElementById('soundBtn');
  btn.classList.toggle('active', !on);
  btn.innerHTML = on ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
  showToast(on ? 'Som ativado' : 'Som desativado');
});

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- SCROLL PROGRESS ---
window.addEventListener('scroll', () => {
  const s = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scrollProgress').style.width = s + '%';
});

// --- GLASS CARD — Luz seguindo o mouse ---
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

// --- FOCO VISÍVEL (Teclado) ---
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

// --- DESBLOQUEIO DO AUDIOCONTEXT ---
document.addEventListener('click', () => AudioSystem.ensure(), { once: true });

// --- CONSOLE ---
console.log('%c✦ Aura — Ecossistema Interativo das Sensações Digital', 'color:#E8A838;font-size:16px;font-weight:bold;font-family:Syne,sans-serif;');
console.log('%cExplore as seções, ajuste a física dos botões, teste as leis de UX e alterne os modos de acessibilidade.', 'color:#7A756F;font-size:12px;font-family:Space Grotesk,sans-serif;');
