/* =============================================
   UX PLAYGROUND — Fitts, Hick, Heatmap
   ======================================== */
window.uxTimingData = [];

// --- LEI DE FITTS ---
const fittsArea = document.getElementById('fittsArea');
let fittsHits = 0, fittsMisses = 0, fittsTimes = [], fittsTargetStart = 0;

function createFittsTarget() {
  fittsArea.innerHTML = '';
  const size = Math.floor(Math.random() * 50) + 30;
  const aW = Math.max(1, fittsArea.offsetWidth - size);
  const aH = Math.max(1, fittsArea.offsetHeight - size);
  const x = Math.floor(Math.random() * aW), y = Math.floor(Math.random() * aH);

  const target = document.createElement('div');
  target.className = 'fitts-target';
  Object.assign(target.style, {
    width: size+'px', height: size+'px', left: x+'px', top: y+'px',
    background: 'radial-gradient(circle, var(--accent), var(--bg2))',
    color: 'var(--bg)', fontSize: Math.max(10, size*0.25)+'px',
    boxShadow: `0 0 20px rgba(232,168,56,0.4), inset 0 0 10px rgba(255,255,255,0.1)`,
    border: '1px solid var(--accent)'
  });
  target.textContent = size + 'px';
  target.setAttribute('data-cursor', 'control');
  target.setAttribute('data-label', `Alvo ${size}px`);

  target.addEventListener('click', (e) => {
    e.stopPropagation();
    const time = performance.now() - fittsTargetStart;
    fittsHits++; fittsTimes.push(time);
    window.uxTimingData.push({ type:'fitts', time, size, timestamp: Date.now() });
    document.getElementById('fittsHits').textContent = fittsHits;
    document.getElementById('fittsAvgTime').textContent =
      (fittsTimes.reduce((a,b)=>a+b,0)/fittsTimes.length).toFixed(0)+'ms';
    window.updateUxInsights?.(); window.updateMiniChart?.();
    gsap.fromTo(target, {scale: 0.8}, {scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)'});
    setTimeout(createFittsTarget, 200);
  });
  fittsArea.appendChild(target);
  fittsTargetStart = performance.now();
}

fittsArea.addEventListener('click', (e) => {
  if (e.target === fittsArea) {
    fittsMisses++;
    document.getElementById('fittsMisses').textContent = fittsMisses;
    gsap.fromTo(fittsArea, {backgroundColor: 'rgba(232,72,72,0.1)'}, {backgroundColor: 'var(--bg2)', duration: 0.5});
  }
});
createFittsTarget();

// --- MAPA DE CALOR ---
const heatCanvas = document.getElementById('heatmap-canvas');
const heatCtx = heatCanvas.getContext('2d');
let heatData = [];

function resizeHeatmap() {
  const r = heatCanvas.getBoundingClientRect();
  heatCanvas.width = r.width * devicePixelRatio;
  heatCanvas.height = r.height * devicePixelRatio;
  heatCtx.scale(devicePixelRatio, devicePixelRatio);
}
resizeHeatmap(); window.addEventListener('resize', resizeHeatmap);

heatCanvas.addEventListener('mousemove', (e) => {
  const r = heatCanvas.getBoundingClientRect();
  heatData.push({ x: e.clientX-r.left, y: e.clientY-r.top, intensity: 0.3 });
  if (heatData.length > 2000) heatData = heatData.slice(-1500);
  drawHeatmap();
});

function drawHeatmap() {
  const w = heatCanvas.width/devicePixelRatio, h = heatCanvas.height/devicePixelRatio;
  heatCtx.clearRect(0,0,w,h);
  heatCtx.fillStyle = document.documentElement.dataset.theme !== 'light' ? '#060608' : '#EDE7DD';
  heatCtx.fillRect(0,0,w,h);
  heatData.forEach(p => {
    const g = heatCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,25);
    g.addColorStop(0, `rgba(232,168,56,${p.intensity})`);
    g.addColorStop(0.5, `rgba(232,80,56,${p.intensity*0.5})`);
    g.addColorStop(1, 'rgba(232,80,56,0)');
    heatCtx.fillStyle = g; heatCtx.fillRect(p.x-25,p.y-25,50,50);
  });
  heatData.forEach(p => p.intensity *= 0.998);
  heatData = heatData.filter(p => p.intensity > 0.01);
}

// --- LEI DE HICK ---
const hickSlider = document.getElementById('hickSlider');
const hickGrid = document.getElementById('hickGrid');
let hickTimes = [], hickTargetStart = 0;
const distractors = ['Menu','Link','Info','Sobre','Mais','Ver','Abrir','Fechar','Editar','Salvar','Cancelar','OK','Sim','Não','Voltar','Enviar','Buscar','Filtro','Tag','Reset','Nova','Anterior','Próximo','Compartilhar'];

function createHickGrid() {
  const count = parseInt(hickSlider.value);
  document.getElementById('hickCount').textContent = count;
  hickGrid.innerHTML = '';
  const targetIdx = Math.floor(Math.random() * count);

  for (let i = 0; i < count; i++) {
    const item = document.createElement('button');
    item.style.cssText = 'padding:10px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--fg);font-family:"Space Grotesk";font-size:13px;font-weight:500;cursor:none;transition:all 0.2s;text-align:center;';
    item.setAttribute('data-cursor', 'control');

    if (i === targetIdx) {
      item.textContent = 'ALVO';
      item.style.background = 'var(--accent)'; item.style.color = 'var(--bg)';
      item.style.fontWeight = '700'; item.style.borderColor = 'var(--accent)';
      item.style.boxShadow = '0 4px 15px rgba(232,168,56,0.3)';
      item.addEventListener('click', () => {
        const time = performance.now() - hickTargetStart;
        hickTimes.push(time);
        window.uxTimingData.push({ type:'hick', time, options:count, timestamp:Date.now() });
        document.getElementById('hickAvgTime').textContent =
          (hickTimes.reduce((a,b)=>a+b,0)/hickTimes.length).toFixed(0)+'ms';
        window.updateUxInsights?.(); window.updateMiniChart?.();
        gsap.fromTo(item, {scale: 0.9}, {scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)'});
        setTimeout(createHickGrid, 300);
      });
    } else {
      item.textContent = distractors[i % distractors.length];
      item.addEventListener('click', () => {
        item.style.background = 'rgba(232,72,72,0.2)'; item.style.borderColor = '#E84848';
        gsap.fromTo(item, {x: -5}, {x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)'});
        setTimeout(() => { item.style.background='var(--bg2)'; item.style.borderColor='var(--border)'; }, 300);
      });
    }
    hickGrid.appendChild(item);
  }
  hickTargetStart = performance.now();
}

hickSlider.addEventListener('input', createHickGrid);
createHickGrid();

// --- INSIGHTS & MINI CHART ---
window.updateUxInsights = function() {
  const el = document.getElementById('uxInsight');
  const data = window.uxTimingData;
  if (data.length < 3) { el.textContent = `Continue interagindo... ${data.length}/3 dados mínimos.`; return; }

  const fitts = data.filter(d=>d.type==='fitts'), hick = data.filter(d=>d.type==='hick');
  let insights = [];

  if (fitts.length >= 2) {
    const sm = fitts.filter(d=>d.size<45), bg = fitts.filter(d=>d.size>=45);
    if (sm.length && bg.length) {
      const aS = sm.reduce((a,d)=>a+d.time,0)/sm.length;
      const aB = bg.reduce((a,d)=>a+d.time,0)/bg.length;
      insights.push(aS > aB*1.2
        ? `Alvos menores levam ${((aS/aB-1)*100).toFixed(0)}% mais tempo — Lei de Fitts confirmada.`
        : `Tempo consistente independente do tamanho — precisão acima da média.`);
    }
  }
  if (hick.length >= 2) {
    const few = hick.filter(d=>d.options<=6), many = hick.filter(d=>d.options>6);
    if (few.length && many.length) {
      const aF = few.reduce((a,d)=>a+d.time,0)/few.length;
      const aM = many.reduce((a,d)=>a+d.time,0)/many.length;
      insights.push(aM > aF*1.15
        ? `Com mais opções, decisão cresce ${((aM/aF-1)*100).toFixed(0)}% — Lei de Hick confirmada.`
        : `Tempo de decisão estável — habilidade de escaneamento excelente.`);
    }
  }
  if (!insights.length) insights.push('Dados insuficientes para diferença significativa. Continue testando!');
  el.innerHTML = insights.map(t=>`<p style="margin-bottom:6px;">${t}</p>`).join('');
};

window.updateMiniChart = function() {
  const c = document.getElementById('miniChart');
  const recent = window.uxTimingData.slice(-10);
  if (!recent.length) return;
  const max = Math.max(...recent.map(d=>d.time), 100);
  c.innerHTML = recent.map(d => {
    const h = Math.max(4, (d.time/max)*56);
    return `<div style="flex:1;height:${h}px;background:${d.type==='fitts'?'var(--accent)':'var(--accent2)'};border-radius:2px 2px 0 0;transition:height 0.3s;box-shadow:0 0 5px currentColor;" title="${d.type}: ${d.time.toFixed(0)}ms"></div>`;
  }).join('');
};