/* =============================================
   DARK/LIGHT MATRIX — Temas, Webcam, Paleta
   ======================================== */
window._manualTheme = false;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById('currentThemeDisplay').textContent = theme.toUpperCase();
  window.updatePaletteDisplay?.();
  window.updateContrastRatios?.();
  gsap.fromTo('#currentThemeDisplay', {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'});
  
  // AVISA O GSAP QUE O LAYOUT PODE TER MUDADO
  if (window.ScrollTrigger) {
    setTimeout(() => ScrollTrigger.refresh(), 300);
  }
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === 'dark' ? 'light' : 'dark');
  window._manualTheme = true;
  if (window.showToast) showToast(`Tema alterado para ${document.documentElement.dataset.theme}`);
});

window.updatePaletteDisplay = function() {
  const style = getComputedStyle(document.documentElement);
  const colors = ['--bg','--bg2','--fg','--fg-muted','--accent','--accent2','--card','--border'];
  document.getElementById('paletteDisplay').innerHTML = colors.map(c => {
    const v = style.getPropertyValue(c).trim();
    return `<div class="palette-swatch"><div class="palette-color" style="background:${v};box-shadow:inset 0 0 0 1px var(--border);"></div><span class="palette-label">${c.replace('--','')}</span></div>`;
  }).join('');
};
window.updatePaletteDisplay();

(function checkTimeTheme() {
  const h = new Date().getHours();
  if (!window._manualTheme) setTheme(h >= 6 && h < 18 ? 'light' : 'dark');
})();

const webcamVideo = document.getElementById('webcamVideo');
const webcamBtn = document.getElementById('webcamBtn');
const webcamPlaceholder = document.getElementById('webcamPlaceholder');
const lightIndicator = document.getElementById('lightIndicator');
const lightStatus = document.getElementById('lightStatus');
const lightCanvas = document.getElementById('lightCanvas');
let lightCheckInterval = null;

webcamBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment', width:320, height:240 } });
    webcamVideo.srcObject = stream;
    webcamPlaceholder.style.display = 'none';
    lightStatus.textContent = 'Ativo'; lightIndicator.style.background = '#38E8C6';
    lightIndicator.style.boxShadow = '0 0 10px #38E8C6';
    if (window.showToast) showToast('Sensor de luz ativado');

    const lCtx = lightCanvas.getContext('2d', { willReadFrequently:true });
    lightCanvas.width = 32; lightCanvas.height = 24;

    lightCheckInterval = setInterval(() => {
      if (webcamVideo.readyState < 2) return;
      lCtx.drawImage(webcamVideo, 0, 0, 32, 24);
      const data = lCtx.getImageData(0,0,32,24).data;
      let total = 0; const n = data.length/4;
      for (let i=0; i<data.length; i+=4) total += data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114;
      const avg = total / n;

      if (avg > 140) {
        lightStatus.textContent = 'Ambiente Claro'; lightIndicator.style.background = 'hsl(48,100%,57%)';
        lightIndicator.style.boxShadow = '0 0 10px hsl(48,100%,57%)';
        if (document.documentElement.dataset.theme !== 'light') { window._manualTheme = false; setTheme('light'); }
      } else if (avg < 80) {
        lightStatus.textContent = 'Ambiente Escuro'; lightIndicator.style.background = 'hsl(168,80%,57%)';
        lightIndicator.style.boxShadow = '0 0 10px hsl(168,80%,57%)';
        if (document.documentElement.dataset.theme !== 'dark') { window._manualTheme = false; setTheme('dark'); }
      } else {
        lightStatus.textContent = 'Ambiente Médio';
      }
    }, 2000);
  } catch {
    if (window.showToast) showToast('Câmera não disponível ou permissão negada');
    lightStatus.textContent = 'Erro'; lightIndicator.style.background = '#E84848';
  }
});