/* =============================================
   HERO CANVAS — Campo de partículas 3D (Wasm Worker)
   ============================================= */
import init, { ParticleSystem } from '../../../packages/wasm-particles/pkg/wasm_particles.js';

const heroCanvas = document.getElementById('hero-canvas');
const hCtx = heroCanvas.getContext('2d');
const PARTICLE_COUNT = 300; // Aumentamos para 300! O Worker aguenta.
let heroMouseX = 0, heroMouseY = 0;

// Inicia o Worker
const worker = new Worker('./js/hero-worker.js', { type: "module" });

function resizeHeroCanvas() {
    const section = document.getElementById('hero');
    if(section) {
        heroCanvas.width = section.offsetWidth;
        heroCanvas.height = section.offsetHeight;
    }
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

// Mouse
document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left - heroCanvas.width / 2;
    heroMouseY = e.clientY - rect.top - heroCanvas.height / 2;
});

const COLORS = ['#E8A838', '#38E8C6', '#F2EDE8'];
let lastFrameData = null;

// Recebe os dados calculados do Rust via Worker
worker.onmessage = function(e) {
    if (e.data.type === 'ready') {
        console.log('🦀 Wasm Worker pronto!');
        requestAnimationFrame(animateHero);
    } else if (e.data.type === 'frame') {
        lastFrameData = e.data;
        // Pede o próximo cálculo imediatamente
        worker.postMessage({ type: 'update', data: { mouseX: heroMouseX, mouseY: heroMouseY } });
    }
};

// Inicializa o Wasm no worker
worker.postMessage({ type: 'init', data: { width: heroCanvas.width, height: heroCanvas.height, count: PARTICLE_COUNT } });

function animateHero() {
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    const cx = heroCanvas.width / 2;
    const cy = heroCanvas.height / 2;
    const focalLength = 400;

    if (!lastFrameData) {
        requestAnimationFrame(animateHero);
        return;
    }

    const { xs, ys, zs, sizes, colors } = lastFrameData;

    let screenX = new Array(xs.length);
    let screenY = new Array(xs.length);
    let scales = new Array(xs.length);

    for (let i = 0; i < xs.length; i++) {
        const scale = focalLength / (focalLength + zs[i]);
        scales[i] = scale;
        screenX[i] = cx + xs[i] * scale;
        screenY[i] = cy + ys[i] * scale;
    }

    // Desenho das linhas
    for (let i = 0; i < xs.length; i++) {
        const sxi = screenX[i], syi = screenY[i], si = scales[i];
        for (let j = i + 1; j < xs.length; j++) {
            const sxj = screenX[j], syj = screenY[j], sj = scales[j];
            const dx = sxi - sxj;
            const dy = syi - syj;
            const d = Math.sqrt(dx * dx + dy * dy);
            
            if (d < 80) {
                hCtx.beginPath();
                hCtx.moveTo(sxi, syi);
                hCtx.lineTo(sxj, syj);
                hCtx.strokeStyle = `rgba(232,168,56,${(1 - d / 80) * 0.15 * Math.min(si, sj)})`;
                hCtx.lineWidth = 0.5;
                hCtx.stroke();
            }
        }
    }

    // Desenho das partículas
    for (let i = 0; i < xs.length; i++) {
        const size = Math.max(0.5, sizes[i] * scales[i]);
        hCtx.beginPath();
        hCtx.arc(screenX[i], screenY[i], size, 0, Math.PI * 2);
        hCtx.fillStyle = COLORS[colors[i]];
        hCtx.globalAlpha = Math.max(0.1, Math.min(1, scales[i]));
        hCtx.fill();
    }

    hCtx.globalAlpha = 1;
    requestAnimationFrame(animateHero);
}

// Como este é um módulo (type="module"), garantimos que o core.js seja inicializado após o DOM carregar
if (typeof initCore === 'function') {
    initCore();
} else {
    // Caso o core.js ainda precise ser aguardado
    window.addEventListener('load', () => {
        if (typeof initCore === 'function') initCore();
    });
}