/* =============================================
   VÓRTEX — Motor de Simulação de UI Generativa
   ============================================= */

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
let W, H, dpr;

// =============================================
// ESTADO DA SIMULAÇÃO
// =============================================
const Config = {
  nodeCount: 60,
  repulsion: 3000,
  linkDistance: 120,
  speed: 0.3,
  damping: 0.95,
  nodeSize: 3,
  lineOpacity: 0.4,
  colorA: '#ff6b35',
  colorB: '#00d4aa',
  glow: true,
  trails: true,
  frozen: false,
};

let nodes = [];
let edges = [];
let mouse = { x: -9999, y: -9999, down: false };
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

// =============================================
// RESIZE
// =============================================
function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0);
}
resize();
window.addEventListener('resize', resize);

// =============================================
// CLASSE NÓ
// =============================================
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * Config.speed * 2;
    this.vy = (Math.random() - 0.5) * Config.speed * 2;
    this.radius = Config.nodeSize;
    this.pinned = false;
    this.trail = [];
    this.maxTrail = 12;
  }

  update() {
    if (this.pinned || Config.frozen) return;

    // Repulsão do mouse
    const mdx = this.x - mouse.x;
    const mdy = this.y - mouse.y;
    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mDist < 150 && mDist > 0) {
      const force = (Config.repulsion / (mDist * mDist)) * 50;
      this.vx += (mdx / mDist) * force;
      this.vy += (mdy / mDist) * force;
    }

    // Repulsão entre nós
    for (const other of nodes) {
      if (other === this) continue;
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80 && dist > 0) {
        const force = (Config.repulsion * 0.3) / (dist * dist);
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Damping
    this.vx *= Config.damping / 100;
    this.vy *= Config.damping / 100;

    this.x += this.vx;
    this.y += this.vy;

    // Limites com bounce
    const margin = 20;
    if (this.x < margin) { this.x = margin; this.vx *= -0.5; }
    if (this.x > W - margin) { this.x = W - margin; this.vx *= -0.5; }
    if (this.y < margin) { this.y = margin; this.vy *= -0.5; }
    if (this.y > H - margin) { this.y = H - margin; this.vy *= -0.5; }

    // Trilha
    if (Config.trails) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();
    } else {
      this.trail = [];
    }
  }
}

// =============================================
// GERENCIAR NÓS
// =============================================
function syncNodeCount(target) {
  while (nodes.length < target) {
    nodes.push(new Node(
      Math.random() * W * 0.6 + W * 0.2,
      Math.random() * H * 0.6 + H * 0.2
    ));
  }
  while (nodes.length > target) {
    nodes.pop();
  }
}

// =============================================
// ARESTAS (Conexões)
// =============================================
function updateEdges() {
  edges = [];
  const ld = Config.linkDistance;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ld) {
        edges.push({ a: i, b: j, dist: dist });
      }
    }
  }
}

// =============================================
// INTERPOLAR CORES
// =============================================
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

// =============================================
// DESENHO
// =============================================
function draw() {
  // Fundo com desvanecimento sutil (efeito de trilha)
  if (Config.trails) {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, W, H);
  }

  const rgbA = hexToRgb(Config.colorA);
  const rgbB = hexToRgb(Config.colorB);
  const ld = Config.linkDistance;

  // Trilhas
  if (Config.trails) {
    for (const node of nodes) {
      if (node.trail.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(node.trail[0].x, node.trail[0].y);
      for (let i = 1; i < node.trail.length; i++) {
        ctx.lineTo(node.trail[i].x, node.trail[i].y);
      }
      const t = node.x / W;
      const c = lerpColor(rgbA, rgbB, t);
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.1)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Arestas
  for (const edge of edges) {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    const alpha = (1 - edge.dist / ld) * Config.lineOpacity;
    if (alpha < 0.01) continue;

    const t = (a.x + b.x) / (2 * W);
    const c = lerpColor(rgbA, rgbB, t);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Nós
  for (const node of nodes) {
    const t = node.x / W;
    const c = lerpColor(rgbA, rgbB, t);

    // Glow
    if (Config.glow) {
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, Math.max(1, node.radius * 6));
      grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.3)`);
      grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(1, node.radius * 6), 0, Math.PI * 2);
      ctx.fill();
    }

    // Ponto
    ctx.beginPath();
    ctx.arc(node.x, node.y, Math.max(0.5, node.radius), 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.fill();
  }

  // Linha do mouse
  if (mouse.x > 0 && mouse.y > 0) {
    let closestDist = Infinity;
    let closestNode = null;
    for (const node of nodes) {
      const d = Math.hypot(node.x - mouse.x, node.y - mouse.y);
      if (d < closestDist) { closestDist = d; closestNode = node; }
    }
    if (closestNode && closestDist < 200) {
      const alpha = (1 - closestDist / 200) * 0.3;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(closestNode.x, closestNode.y);
      ctx.strokeStyle = `rgba(${rgbA[0]},${rgbA[1]},${rgbA[2]},${alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

// =============================================
// LOOP PRINCIPAL
// =============================================
function loop(time) {
  // FPS
  frameCount++;
  if (time - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = time;
    document.getElementById('statFps').innerHTML = fps + ' FPS';
  }

  syncNodeCount(Config.nodeCount);
  nodes.forEach(n => { n.radius = Config.nodeSize; });
  updateEdges();

  nodes.forEach(n => n.update());
  draw();

  // Stats
  document.getElementById('statNodes').innerHTML = nodes.length + ' nós';
  document.getElementById('statEdges').innerHTML = edges.length + ' ligações';

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// =============================================
// INPUT
// =============================================
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener('mousedown', e => {
  mouse.down = true;
  const node = getNodeAt(e.clientX, e.clientY);
  if (node) node.pinned = true;
});
canvas.addEventListener('mouseup', () => {
  mouse.down = false;
  nodes.forEach(n => n.pinned = false);
});
canvas.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
  nodes.forEach(n => n.pinned = false);
});

// Touch
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
  const node = getNodeAt(t.clientX, t.clientY);
  if (node) node.pinned = true;
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });
canvas.addEventListener('touchend', () => {
  mouse.x = -9999;
  mouse.y = -9999;
  nodes.forEach(n => n.pinned = false);
});

function getNodeAt(x, y) {
  let closest = null, minD = Infinity;
  for (const n of nodes) {
    const d = Math.hypot(n.x - x, n.y - y);
    if (d < minD) { minD = d; closest = n; }
  }
  return minD < 30 ? closest : null;
}

// =============================================
// SLIDERS
// =============================================
const sliders = [
  { id: 'nodeCount', key: 'nodeCount', parse: parseInt },
  { id: 'repulsion', key: 'repulsion', parse: parseInt },
  { id: 'linkDistance', key: 'linkDistance', parse: parseInt },
  { id: 'speed', key: 'speed', parse: v => parseInt(v) / 100 },
  { id: 'damping', key: 'damping', parse: parseInt },
  { id: 'nodeSize', key: 'nodeSize', parse: parseInt },
  { id: 'lineOpacity', key: 'lineOpacity', parse: v => parseInt(v) / 100 },
];

sliders.forEach(s => {
  const el = document.getElementById(s.id);
  const valEl = document.getElementById(s.id + 'Val');
  el.addEventListener('input', () => {
    Config[s.key] = s.parse(el.value);
    valEl.textContent = el.value;
  });
});

// Cores
document.getElementById('colorA').addEventListener('input', e => Config.colorA = e.target.value);
document.getElementById('colorB').addEventListener('input', e => Config.colorB = e.target.value);

// Toggles
document.getElementById('toggleGlow').addEventListener('click', function() {
  Config.glow = !Config.glow;
  this.classList.toggle('active', Config.glow);
});
document.getElementById('toggleTrails').addEventListener('click', function() {
  Config.trails = !Config.trails;
  this.classList.toggle('active', Config.trails);
  if (!Config.trails) nodes.forEach(n => n.trail = []);
});

// Panel toggle
document.getElementById('panelToggle').addEventListener('click', () => {
  document.getElementById('panel').classList.toggle('collapsed');
});

// =============================================
// PRESETS
// =============================================
const presets = {
  constellation: { nodeCount: 80, repulsion: 2500, linkDistance: 130, speed: 20, damping: 96, nodeSize: 2, lineOpacity: 30, glow: true, trails: true },
  mesh: { nodeCount: 120, repulsion: 5000, linkDistance: 80, speed: 10, damping: 90, nodeSize: 2, lineOpacity: 50, glow: false, trails: false },
  orbit: { nodeCount: 40, repulsion: 1500, linkDistance: 200, speed: 50, damping: 98, nodeSize: 5, lineOpacity: 25, glow: true, trails: true },
  swarm: { nodeCount: 200, repulsion: 800, linkDistance: 60, speed: 80, damping: 92, nodeSize: 2, lineOpacity: 20, glow: false, trails: true },
  crystal: { nodeCount: 30, repulsion: 4000, linkDistance: 250, speed: 5, damping: 99, nodeSize: 6, lineOpacity: 60, glow: true, trails: false },
  waves: { nodeCount: 100, repulsion: 3000, linkDistance: 100, speed: 40, damping: 97, nodeSize: 3, lineOpacity: 35, glow: true, trails: true },
};

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = presets[btn.dataset.preset];
    if (!p) return;

    Object.keys(p).forEach(key => {
      Config[key] = p[key];
      const el = document.getElementById(key);
      if (el) el.value = typeof p[key] === 'boolean' ? (p[key] ? 1 : 0) : p[key];
      const valEl = document.getElementById(key + 'Val');
      if (valEl) valEl.textContent = el.value;
    });

    // Sync toggles
    document.getElementById('toggleGlow').classList.toggle('active', Config.glow);
    document.getElementById('toggleTrails').classList.toggle('active', Config.trails);

    // Resetar posições para o novo preset
    nodes.forEach(n => {
      n.x = Math.random() * W * 0.6 + W * 0.2;
      n.y = Math.random() * H * 0.6 + H * 0.2;
      n.vx = (Math.random() - 0.5) * Config.speed * 2;
      n.vy = (Math.random() - 0.5) * Config.speed * 2;
      n.trail = [];
    });

    showToast('Preset: ' + btn.textContent);
  });
});

// =============================================
// AÇÕES
// =============================================
document.getElementById('btnExplode').addEventListener('click', () => {
  const cx = W / 2, cy = H / 2;
  nodes.forEach(n => {
    const dx = n.x - cx, dy = n.y - cy;
    const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    n.vx += (dx / dist) * 25;
    n.vy += (dy / dist) * 25;
  });
  showToast('Explosão');
});

document.getElementById('btnImplode').addEventListener('click', () => {
  const cx = W / 2, cy = H / 2;
  nodes.forEach(n => {
    const dx = cx - n.x, dy = cy - n.y;
    const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    n.vx += (dx / dist) * 15;
    n.vy += (dy / dist) * 15;
  });
  showToast('Implosão');
});

document.getElementById('btnFreeze').addEventListener('click', () => {
  Config.frozen = !Config.frozen;
  showToast(Config.frozen ? 'Congelado' : 'Descongelado');
});

document.getElementById('btnScatter').addEventListener('click', () => {
  nodes.forEach(n => {
    n.x = Math.random() * (W - 100) + 50;
    n.y = Math.random() * (H - 100) + 50;
    n.vx = (Math.random() - 0.5) * Config.speed * 4;
    n.vy = (Math.random() - 0.5) * Config.speed * 4;
    n.trail = [];
  });
  showToast('Espalhado');
});

// Exportar SVG
document.getElementById('btnExportSVG').addEventListener('click', () => {
  let svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
  svgContent += '<rect width="100%" height="100%" fill="#0a0a0f"/>';
  const rgbA = hexToRgb(Config.colorA);
  const rgbB = hexToRgb(Config.colorB);

  edges.forEach(edge => {
    const a = nodes[edge.a], b = nodes[edge.b];
    const alpha = ((1 - edge.dist / Config.linkDistance) * Config.lineOpacity).toFixed(2);
    const t = (a.x + b.x) / (2 * W);
    const c = lerpColor(rgbA, rgbB, t);
    svgContent += '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" stroke="rgb(' + c.join(',') + ')" stroke-opacity="' + alpha + '" stroke-width="1"/>';
  });

  nodes.forEach(n => {
    const t = n.x / W;
    const c = lerpColor(rgbA, rgbB, t);
    svgContent += '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + n.radius + '" fill="rgb(' + c.join(',') + ')"/>';
  });

  svgContent += '</svg>';

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'vortex-export.svg'; a.click();
  URL.revokeObjectURL(url);
  showToast('SVG exportado');
});

// Exportar PNG
document.getElementById('btnExportCanvas').addEventListener('click', () => {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'vortex-export.png'; a.click();
    URL.revokeObjectURL(url);
    showToast('PNG exportado');
  });
});

// =============================================
// TOAST
// =============================================
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
