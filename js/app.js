// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    injectComponents();
    renderNav();
    initPreloader();
    initScrollReveal();
    initNavbar();
    initBackToTop();
    initCounters();
    initTestimonials();
    initSmoothScroll();
    initLightbox();
    initSearch();
    initAccessibility();
    registerSW();
});

// ===== COMPONENT INJECTOR =====
async function injectComponents() {
    const headerHTML = `
    <div class="max-w-[1400px] mx-auto px-4 md:px-8">
        <div class="flex items-center justify-between h-20 md:h-24">
            <a href="index.html" class="flex items-center gap-3 group">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-guarana flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-guarana/30">
                    <iconify-icon icon="lucide:flower2" class="text-white text-lg md:text-xl"></iconify-icon>
                </div>
                <div class="hidden sm:block">
                    <span class="font-heading font-extrabold text-lg md:text-xl text-white drop-shadow-lg tracking-tight">Maués</span>
                    <span class="block text-[10px] md:text-xs text-sol font-heading font-semibold tracking-widest uppercase drop-shadow">Capital do Guaraná</span>
                </div>
            </a>
            <nav class="hidden xl:flex items-center gap-1" id="desktopNav"></nav>
            <div class="flex items-center gap-3">
                <button onclick="openSearch()" class="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 text-white/60 text-xs hover:bg-white/20 transition-all cursor-pointer" aria-label="Buscar">
                    <iconify-icon icon="lucide:search" class="text-sm"></iconify-icon>
                    <span class="hidden lg:inline">Buscar...</span>
                    <kbd class="hidden lg:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-2 font-mono">⌘K</kbd>
                </button>
                <a href="contato-e-suporte.html" class="hidden md:inline-flex items-center gap-2 bg-guarana hover:bg-guarana-light text-white text-xs font-heading font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-guarana/30">
                    <iconify-icon icon="lucide:map-pin" class="text-sm"></iconify-icon> Planeje sua Viagem
                </a>
                <button class="xl:hidden w-10 h-10 flex items-center justify-center text-white" onclick="toggleMobileMenu()" aria-label="Menu">
                    <iconify-icon icon="lucide:menu" class="text-2xl" id="menuIcon"></iconify-icon>
                </button>
            </div>
        </div>
    </div>`;

    const mobileHTML = `<div class="flex flex-col items-center justify-center h-full gap-5 overflow-y-auto py-20" id="mobileNavLinks"></div>`;

    const header = document.getElementById('navbar');
    if (header && !header.innerHTML.trim()) header.innerHTML = headerHTML;

    const mobile = document.getElementById('mobileMenu');
    if (mobile && !mobile.innerHTML.trim()) mobile.innerHTML = mobileHTML;
}

// ===== PWA SERVICE WORKER =====
function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

// ===== PRELOADER =====
function initPreloader() {
    const p = document.getElementById('preloader');
    if (!p) return;
    window.addEventListener('load', () => {
        setTimeout(() => p.classList.add('hidden'), 2200);
    });
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 80);
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    });
}

// ===== MOBILE MENU =====
let menuOpen = false;
function toggleMobileMenu() {
    menuOpen = !menuOpen;
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if (menu) menu.classList.toggle('open', menuOpen);
    if (icon) icon.setAttribute('icon', menuOpen ? 'lucide:x' : 'lucide:menu');
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => obs.observe(el));
}

// ===== COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.counter-num');
    if (!counters.length) return;
    let done = false;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !done) {
                done = true;
                counters.forEach(c => {
                    const target = parseInt(c.dataset.target);
                    const start = performance.now();
                    (function update(now) {
                        const p = Math.min((now - start) / 2000, 1);
                        c.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
                        if (p < 1) requestAnimationFrame(update);
                    })(start);
                });
            }
        });
    }, { threshold: 0.3 });
    counters.forEach(c => obs.observe(c));
}

// ===== TESTIMONIALS =====
let currentTest = 0;
let testInterval;
function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    goToTestimonial(0);
    startTestAutoplay();
    track.parentElement.addEventListener('mouseenter', () => clearInterval(testInterval));
    track.parentElement.addEventListener('mouseleave', startTestAutoplay);
}
function goToTestimonial(i) {
    currentTest = i;
    const track = document.getElementById('testimonialTrack');
    if (track) track.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll('.testimonial-dot').forEach((d, idx) => {
        d.style.background = idx === i ? '#F2A900' : 'rgba(255,255,255,0.3)';
        d.style.width = idx === i ? '24px' : '12px';
        d.style.borderRadius = '6px';
    });
}
function startTestAutoplay() { testInterval = setInterval(() => goToTestimonial((currentTest + 1) % 3), 5000); }

// ===== LIGHTBOX =====
function initLightbox() {
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    document.getElementById('lightboxImg').src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
}

// ===== TOAST =====
function showToast(message, icon = 'lucide:check-circle') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = `<iconify-icon icon="${icon}" class="text-sol text-lg"></iconify-icon> ${message}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== NEWSLETTER =====
function handleNewsletter(e) {
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    if (input && input.value) {
        showToast('Inscrição realizada com sucesso!');
        input.value = '';
    }
}

// ===== FILTER CARDS (turismo) =====
function filterCards(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    document.querySelectorAll('.tour-card').forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        if (match) {
            card.style.display = '';
            requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 400);
        }
    });
}

// ===== FAQ =====
function toggleFaq(item) {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

// ===== COUNTDOWN =====
function initCountdown() {
    function getNextFesta() {
        const now = new Date();
        let d = new Date(now.getFullYear(), 10, 15);
        if (now > d) d = new Date(now.getFullYear() + 1, 10, 15);
        return d;
    }
    function update() {
        const diff = getNextFesta() - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
        const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = String(v).padStart(2, '0'); };
        el('cd-days', d); el('cd-hours', h); el('cd-mins', m); el('cd-secs', s);
    }
    update();
    setInterval(update, 1000);
}
if (document.getElementById('cd-days')) initCountdown();

// ===== WEATHER WIDGET =====
function initWeather() {
    const container = document.getElementById('weatherWidget');
    if (!container) return;
    // Dados simulados (em produção, usar API real)
    const weather = {
        temp: 29, feelsLike: 33, humidity: 78, condition: 'Parcialmente Nublado',
        icon: 'lucide:cloud-sun', wind: 12, uv: 9
    };
    container.innerHTML = `
        <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
                <iconify-icon icon="${weather.icon}" class="text-sol text-2xl"></iconify-icon>
                <span class="font-heading font-black text-2xl text-white">${weather.temp}°C</span>
            </div>
            <div class="text-white/60 text-xs font-body space-y-1">
                <div>Sensação: ${weather.feelsLike}°C • ${weather.condition}</div>
                <div>Umidade: ${weather.humidity}% • Vento: ${weather.wind} km/h • UV: ${weather.uv}</div>
            </div>
        </div>`;
}

// ===== LEAFLET MAP =====
function initLeafletMap(mapId, points, center = [-3.383, -57.717], zoom = 13) {
    const el = document.getElementById(mapId);
    if (!el || typeof L === 'undefined') return;

    const map = L.map(mapId, { scrollWheelZoom: false }).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const guaranaIcon = L.divIcon({
        html: '<div style="background:#C02626;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white"><span style="color:white;font-size:14px">🌱</span></div>',
        iconSize: [28, 28], iconAnchor: [14, 14], className: ''
    });
    const foodIcon = L.divIcon({
        html: '<div style="background:#F2A900;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white"><span style="color:white;font-size:14px">🍽️</span></div>',
        iconSize: [28, 28], iconAnchor: [14, 14], className: ''
    });
    const defaultIcon = L.divIcon({
        html: '<div style="background:#0B4F26;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid white"><span style="color:white;font-size:14px">📍</span></div>',
        iconSize: [28, 28], iconAnchor: [14, 14], className: ''
    });

    points.forEach(p => {
        const icon = p.icon === 'guarana' ? guaranaIcon : p.icon === 'food' ? foodIcon : defaultIcon;
        L.marker(p.coords, { icon }).addTo(map).bindPopup(`<strong>${p.name}</strong><br><span style="font-size:12px">${p.desc}</span>`);
    });

    // Fix rendering after reveal
    setTimeout(() => map.invalidateSize(), 1000);
}