/* =============================================
   CURSOR INTELIGENTE — Transformação contextual
   ======================================== */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.addEventListener('mouseover', (e) => {
  const el = e.target.closest('[data-cursor]');
  cursorDot.classList.remove('magnify', 'control', 'label-mode');
  cursorRing.classList.remove('magnify', 'control');
  if (el) {
    const type = el.dataset.cursor;
    if (type === 'magnify') {
      cursorDot.classList.add('magnify');
      cursorRing.classList.add('magnify');
    } else if (type === 'control') {
      cursorDot.classList.add('control');
      cursorRing.classList.add('control');
    }
    if (el.dataset.label) {
      cursorDot.classList.add('label-mode');
      cursorDot.setAttribute('data-label', el.dataset.label);
    }
  }
});

document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget || !e.relatedTarget.closest('[data-cursor]')) {
    cursorDot.classList.remove('magnify', 'control', 'label-mode');
    cursorRing.classList.remove('magnify', 'control');
  }
});