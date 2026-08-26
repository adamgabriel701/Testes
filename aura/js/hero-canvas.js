/* =============================================
   HERO CANVAS — Campo de partículas 3D
   ============================================= */
const heroCanvas = document.getElementById('hero-canvas');
const hCtx = heroCanvas.getContext('2d');
const PARTICLE_COUNT = 180;
let particles = [];
let heroMouseX = 0, heroMouseY = 0;

function resizeHeroCanvas() {
  const section = document.getElementById('hero');
  heroCanvas.width = section.offsetWidth;
  heroCanvas.height = section.offsetHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * heroCanvas.width,
    y: Math.random() * heroCanvas.height,
    z: Math.random() * 600 - 300,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    vz: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    color: Math.random() > 0.7 ? '#E8A838' : (Math.random() > 0.5 ? '#38E8C6' : '#F2EDE8')
  });
}

document.getElementById('hero').addEventListener('mousemove', (e) => {
  const rect = heroCanvas.getBoundingClientRect();
  heroMouseX = e.clientX - rect.left - heroCanvas.width / 2;
  heroMouseY = e.clientY - rect.top - heroCanvas.height / 2;
});

function animateHero() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  const cx = heroCanvas.width / 2;
  const cy = heroCanvas.height / 2;
  const focalLength = 400;

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.z += p.vz;
    const dx = p.x - heroMouseX, dy = p.y - heroMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150 && dist > 0) {
      const force = (150 - dist) / 150 * 0.8;
      p.vx += (dx / dist) * force * 0.1;
      p.vy += (dy / dist) * force * 0.1;
    }
    p.vx *= 0.995; p.vy *= 0.995;
    if (p.x < -300) p.x = 300; if (p.x > 300) p.x = -300;
    if (p.y < -300) p.y = 300; if (p.y > 300) p.y = -300;
    if (p.z < -400) p.z = 400; if (p.z > 400) p.z = -400;

    const scale = focalLength / (focalLength + p.z);
    const sx = cx + p.x * scale, sy = cy + p.y * scale;
    const size = Math.max(0.5, p.size * scale);
    hCtx.beginPath();
    hCtx.arc(sx, sy, size, 0, Math.PI * 2);
    hCtx.fillStyle = p.color;
    hCtx.globalAlpha = Math.max(0.1, Math.min(1, scale));
    hCtx.fill();
  });

  hCtx.globalAlpha = 1;
  for (let i = 0; i < particles.length; i++) {
    const pi = particles[i], si = focalLength / (focalLength + pi.z);
    const sxi = cx + pi.x * si, syi = cy + pi.y * si;
    for (let j = i + 1; j < particles.length; j++) {
      const pj = particles[j], sj = focalLength / (focalLength + pj.z);
      const d = Math.hypot(sxi - (cx + pj.x * sj), syi - (cy + pj.y * sj));
      if (d < 80) {
        hCtx.beginPath(); hCtx.moveTo(sxi, syi);
        hCtx.lineTo(cx + pj.x * sj, cy + pj.y * sj);
        hCtx.strokeStyle = `rgba(232,168,56,${(1 - d / 80) * 0.15 * Math.min(si, sj)})`;
        hCtx.lineWidth = 0.5; hCtx.stroke();
      }
    }
  }
  hCtx.globalAlpha = 1;
  requestAnimationFrame(animateHero);
}
animateHero();
