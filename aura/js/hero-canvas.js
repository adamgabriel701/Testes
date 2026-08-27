/* =============================================
   HERO CANVAS — Campo de partículas 3D (WASM)
   ============================================= */
import init, { ParticleSystem } from '../../wasm-particles/pkg/wasm_particles.js';

const heroCanvas = document.getElementById('hero-canvas');
const hCtx = heroCanvas.getContext('2d');
const PARTICLE_COUNT = 250; // Aumentei para 250 porque o Rust aguenta fácil!
let heroMouseX = 0, heroMouseY = 0;
let wasmSystem;

function resizeHeroCanvas() {
  const section = document.getElementById('hero');
  heroCanvas.width = section.offsetWidth;
  heroCanvas.height = section.offsetHeight;
}

// Cores fixas para não recalcular string a cada frame
const COLORS = ['#E8A838', '#38E8C6', '#F2EDE8'];

async function runWasm() {
  // 1. Inicializa o WebAssembly
  await init();
  
  // 2. Configura o Canvas
  resizeHeroCanvas();
  window.addEventListener('resize', resizeHeroCanvas);

  // 3. Cria o sistema de partículas no Rust
  wasmSystem = new ParticleSystem(heroCanvas.width, heroCanvas.height, PARTICLE_COUNT);

  // 4. Evento do Mouse
  document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = heroCanvas.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left - heroCanvas.width / 2;
    heroMouseY = e.clientY - rect.top - heroCanvas.height / 2;
  });

  // 5. Inicia o loop de animação
  animateHero();
}

function animateHero() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  const cx = heroCanvas.width / 2;
  const cy = heroCanvas.height / 2;
  const focalLength = 400;

  // PEDIDOS PARA O RUST ATUALIZAR A FÍSICA
  wasmSystem.update(heroMouseX, heroMouseY);

  // PEGANDO OS DADOS DE VOLTA PARA O JS DESENHAR
  const xs = wasmSystem.get_x();
  const ys = wasmSystem.get_y();
  const zs = wasmSystem.get_z();
  const sizes = wasmSystem.get_sizes();
  const colors = wasmSystem.get_colors();

  // Pré-calcula as posições na tela (escala 3D -> 2D)
  let screenX = new Array(xs.length);
  let screenY = new Array(xs.length);
  let scales = new Array(xs.length);

  for (let i = 0; i < xs.length; i++) {
    const scale = focalLength / (focalLength + zs[i]);
    scales[i] = scale;
    screenX[i] = cx + xs[i] * scale;
    screenY[i] = cy + ys[i] * scale;
  }

  // 1. Desenhar as linhas (Loop duplo - feito em JS pois precisa de Canvas API)
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

  // 2. Desenhar as partículas
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

// Inicia tudo
runWasm();