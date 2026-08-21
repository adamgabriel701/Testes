// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    initPreloader();
    initScrollReveal();
    initNavbar();
    initBackToTop();
    initCounters();
    initTestimonials();
    initSmoothScroll();
    initLightbox();
});

// ===== PRELOADER =====
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const p = document.getElementById('preloader');
            if (p) p.classList.add('hidden');
        }, 2200);
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

// ===== COUNTDOWN (eventos) =====
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
// Auto-init countdown if elements exist
if (document.getElementById('cd-days')) initCountdown();
