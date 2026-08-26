/* =============================================
   ACESSIBILIDADE VIVA — Daltonismo, Contraste, SR
   ============================================= */
const a11yBtn = document.getElementById('a11yBtn');
const a11yDropdown = document.getElementById('a11yDropdown');

a11yBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  a11yDropdown.classList.toggle('open');
  AudioSystem.click();
});
document.addEventListener('click', (e) => {
  if (!a11yDropdown.contains(e.target) && e.target !== a11yBtn) a11yDropdown.classList.remove('open');
});

document.querySelectorAll('.a11y-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.a11y-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    const mode = opt.dataset.color;
    if (mode === 'normal') document.documentElement.removeAttribute('data-color');
    else document.documentElement.dataset.color = mode;
    a11yDropdown.classList.remove('open');
    window.updateContrastRatios?.();
    AudioSystem.click();
    if (window.showToast) showToast(`Modo de visão: ${opt.textContent}`);
  });
});

// Razão de contraste
function getLuminance(r,g,b) {
  const [rs,gs,bs] = [r,g,b].map(c => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); });
  return 0.2126*rs + 0.7152*gs + 0.0722*bs;
}
function getContrastRatio(l1,l2) { return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); }
function getComputedRgb(prop) {
  const t = document.createElement('div'); t.style.color = prop; document.body.appendChild(t);
  const m = getComputedStyle(t).color.match(/\d+/g); document.body.removeChild(t);
  return m ? m.map(Number) : [0,0,0];
}

window.updateContrastRatios = function() {
  const fg = getComputedRgb('var(--fg)'), bg = getComputedRgb('var(--bg)');
  const ratio = getContrastRatio(getLuminance(...fg), getLuminance(...bg));
  document.getElementById('cr1').textContent = ratio.toFixed(2)+':1 '+(ratio>=4.5?'✓':'✗');
  document.getElementById('cr2').textContent = ratio.toFixed(2)+':1 '+(ratio>=4.5?'✓':'✗');
  document.getElementById('cr3').textContent = ratio.toFixed(2)+':1 '+(ratio>=3?'✓':'✗');
};
setTimeout(window.updateContrastRatios, 500);

new MutationObserver(window.updateContrastRatios)
  .observe(document.documentElement, { attributes:true, attributeFilter:['data-theme','data-color'] });

// Leitor de tela visual
const srItems = [
  { icon:'fa-image', title:'Imagem do Produto', desc:'Imagem: "Cadeira ergonômica modelo A200 em ambiente de escritório moderno com iluminação natural"' },
  { icon:'fa-cart-shopping', title:'Adicionar ao Carrinho', desc:'Botão: "Adicionar ao Carrinho" — preço: R$ 1.299,00 — em estoque' },
  { icon:'fa-star', title:'Avaliação 4.7/5', desc:'Avaliação: 4.7 de 5 estrelas baseada em 238 avaliações de clientes' },
  { icon:'fa-arrow-right', title:'Navegar para Checkout', desc:'Link: "Ir para checkout" — abre formulário de pagamento em nova etapa' },
];

const srContainer = document.getElementById('srDemos');
srItems.forEach(item => {
  const el = document.createElement('div');
  el.className = 'sr-demo-item';
  el.setAttribute('data-cursor', 'label-mode');
  el.setAttribute('data-label', item.title);
  el.innerHTML = `<i class="fa-solid ${item.icon}" style="color:var(--accent);width:20px;text-align:center;"></i><span style="font-size:13px;font-weight:500;">${item.title}</span>`;
  el.addEventListener('mouseenter', () => {
    document.getElementById('srOutput').textContent = item.desc;
    AudioSystem.hover();
  });
  el.addEventListener('mouseleave', () => {
    document.getElementById('srOutput').textContent = 'Passe o mouse sobre um item acima...';
  });
  srContainer.appendChild(el);
});
