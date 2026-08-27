/* =============================================
   LAB DE MICROINTERAÇÕES — Física de botões
   ======================================== */
let physMass = 1.0, physFriction = 0.3, physStiff = 0.15, physDistort = 0.2;
let clickCount = 0;
let lastFrameTime = performance.now(), frameCount = 0;

const massSlider = document.getElementById('massSlider');
const frictionSlider = document.getElementById('frictionSlider');
const stiffSlider = document.getElementById('stiffSlider');
const distortSlider = document.getElementById('distortSlider');

function updatePhysicsParams() {
  physMass = parseFloat(massSlider.value);
  physFriction = parseFloat(frictionSlider.value);
  physStiff = parseFloat(stiffSlider.value);
  physDistort = parseFloat(distortSlider.value);
  document.getElementById('massVal').textContent = physMass.toFixed(1);
  document.getElementById('frictionVal').textContent = physFriction.toFixed(2);
  document.getElementById('stiffVal').textContent = physStiff.toFixed(2);
  document.getElementById('distortVal').textContent = physDistort.toFixed(2);

  const b = 1 - physFriction, c = physStiff;
  document.getElementById('easingLabel').textContent =
    `cubic-bezier(${(b*0.5).toFixed(2)},${(1+c).toFixed(2)},${(b*0.7).toFixed(2)},1)`;

  const springTime = (physMass / physStiff) * 0.3 + 0.1;
  document.querySelectorAll('.physics-btn').forEach(btn => {
    btn.style.setProperty('--spring',
      `${springTime.toFixed(2)}s cubic-bezier(${(1-physFriction*0.6).toFixed(2)},${(0.8+physStiff*2).toFixed(2)},${(1-physFriction*0.8).toFixed(2)},1)`);
  });
}

[massSlider, frictionSlider, stiffSlider, distortSlider].forEach(s =>
  s.addEventListener('input', updatePhysicsParams)
);
updatePhysicsParams();

const physBtns = ['physBtn1','physBtn2','physBtn3','physBtn4'].map(id => document.getElementById(id));

physBtns.forEach(btn => {
  let isPressed = false, pressStart = 0;
  btn.addEventListener('mousedown', () => {
    isPressed = true; pressStart = performance.now();
    const d = Math.min(physDistort, 0.5);
    btn.style.transform = `scale(${1-d}) skewX(${d*3}deg)`;
    btn.style.boxShadow = '0 4px 0 rgba(0,0,0,0.3)';
    document.getElementById('physicsInfo').textContent =
      `Comprimindo... Massa: ${physMass.toFixed(1)} | Distorção: ${(d*100).toFixed(0)}%`;
    document.getElementById('stressBar').style.width = Math.min(100, (d/0.5)*100) + '%';
  });
  const release = () => {
    if (!isPressed) return; isPressed = false;
    btn.style.transform = 'scale(1) skewX(0deg)'; 
    btn.style.boxShadow = 'none';
    clickCount++;
    document.getElementById('clickCounter').textContent = clickCount;
    document.getElementById('physicsInfo').textContent =
      `Retorno em ${(physMass/physStiff*100).toFixed(0)}ms | Segurou: ${(performance.now()-pressStart).toFixed(0)}ms`;
    document.getElementById('stressBar').style.width = '0%';
  };
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
});

const presets = {
  jelly: { mass: 0.5, friction: 0.15, stiff: 0.3, distort: 0.4 },
  heavy: { mass: 2.8, friction: 0.6, stiff: 0.05, distort: 0.1 },
  snappy: { mass: 0.3, friction: 0.1, stiff: 0.4, distort: 0.15 },
  slow: { mass: 2.5, friction: 0.7, stiff: 0.04, distort: 0.05 }
};

document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = presets[btn.dataset.preset];
    massSlider.value = p.mass; frictionSlider.value = p.friction;
    stiffSlider.value = p.stiff; distortSlider.value = p.distort;
    updatePhysicsParams();
    if (window.showToast) showToast(`Preset "${btn.textContent.trim()}" aplicado`);
  });
});

function updateFps() {
  frameCount++;
  const now = performance.now();
  if (now - lastFrameTime >= 1000) {
    document.getElementById('fpsCounter').textContent = frameCount;
    frameCount = 0; lastFrameTime = now;
  }
  requestAnimationFrame(updateFps);
}
updateFps();