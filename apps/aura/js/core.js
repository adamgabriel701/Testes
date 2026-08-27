/* =============================================
   CORE — Navegação, Zen, Toast, Scroll, Init
   ======================================== */

window.showToast = function(message) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = message;
  c.appendChild(t);
  gsap.fromTo(t, {opacity: 0, y: 20, scale: 0.9}, {opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out'});
  setTimeout(() => {
    gsap.to(t, {opacity: 0, y: 10, duration: 0.3, onComplete: () => t.remove()});
  }, 2500);
};

const navTrigger = document.getElementById('navTrigger');
const orbitalNav = document.getElementById('orbitalNav');
const navIcon = document.getElementById('navIcon');
let navOpen = false;

navTrigger.addEventListener('click', () => {
  navOpen = !navOpen;
  orbitalNav.classList.toggle('open', navOpen);
  navTrigger.classList.toggle('active', navOpen);
  navIcon.className = navOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-plus';
});

orbitalNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navOpen = false; orbitalNav.classList.remove('open');
    navTrigger.classList.remove('active');
    navIcon.className = 'fa-solid fa-plus';
  });
});

document.addEventListener('click', (e) => {
  if (navOpen && !orbitalNav.contains(e.target) && !navTrigger.contains(e.target)) {
    navOpen = false; orbitalNav.classList.remove('open');
    navTrigger.classList.remove('active');
    navIcon.className = 'fa-solid fa-plus';
  }
});

let zenMode = false;
document.getElementById('zenBtn').addEventListener('click', () => {
  zenMode = !zenMode;
  document.body.classList.toggle('zen-mode', zenMode);
  document.getElementById('zenBtn').classList.toggle('active', zenMode);
  showToast(zenMode ? 'Modo Zen ativado — apenas estrutura' : 'Modo Zen desativado');
});

// Botão de som escondido, mas mantido no DOM caso queira reativar no futuro
const soundBtn = document.getElementById('soundBtn');
if(soundBtn) {
  soundBtn.style.display = 'none';
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('scroll', () => {
  const s = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scrollProgress').style.width = s + '%';
});

document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); });
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

console.log('%c✦ Aura — Ecossistema Interativo das Sensações Digital', 'color:#E8A838;font-size:16px;font-weight:bold;font-family:Syne,sans-serif;');
console.log('%cExplore as seções, ajuste a física dos botões, teste as leis de UX e alterne os modos de acessibilidade.', 'color:#7A756F;font-size:12px;font-family:Space Grotesk,sans-serif;');