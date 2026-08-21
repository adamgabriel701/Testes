// ===== ACESSIBILIDADE: Fonte + Alto Contraste =====
let currentFontSize = 100; // percent
let highContrast = false;

function initAccessibility() {
    if (document.getElementById('a11yToolbar')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'a11yToolbar';
    toolbar.className = 'a11y-toolbar';
    toolbar.innerHTML = `
        <button onclick="changeFontSize(-10)" title="Diminuir fonte" aria-label="Diminuir fonte">
            <iconify-icon icon="lucide:minus" class="text-sm"></iconify-icon>
            <span class="text-[10px] font-heading font-bold">A-</span>
        </button>
        <button onclick="changeFontSize(10)" title="Aumentar fonte" aria-label="Aumentar fonte">
            <iconify-icon icon="lucide:plus" class="text-sm"></iconify-icon>
            <span class="text-[10px] font-heading font-bold">A+</span>
        </button>
        <button onclick="toggleContrast()" title="Alto contraste" aria-label="Alto contraste" id="contrastBtn">
            <iconify-icon icon="lucide:circle-half" class="text-sm"></iconify-icon>
            <span class="text-[10px] font-heading font-bold">Contraste</span>
        </button>
        <button onclick="openSearch()" title="Buscar (Ctrl+K)" aria-label="Buscar">
            <iconify-icon icon="lucide:search" class="text-sm"></iconify-icon>
            <span class="text-[10px] font-heading font-bold">Buscar</span>
        </button>
    `;
    document.body.appendChild(toolbar);

    // Restaurar preferências salvas
    const savedSize = localStorage.getItem('maues-font-size');
    const savedContrast = localStorage.getItem('maues-high-contrast');
    if (savedSize) { currentFontSize = parseInt(savedSize); applyFontSize(); }
    if (savedContrast === 'true') { highContrast = true; applyContrast(); }
}

function changeFontSize(delta) {
    currentFontSize = Math.max(80, Math.min(140, currentFontSize + delta));
    localStorage.setItem('maues-font-size', currentFontSize);
    applyFontSize();
}

function applyFontSize() {
    document.documentElement.style.fontSize = currentFontSize + '%';
}

function toggleContrast() {
    highContrast = !highContrast;
    localStorage.setItem('maues-high-contrast', highContrast);
    applyContrast();
}

function applyContrast() {
    if (highContrast) {
        document.body.classList.add('high-contrast');
        document.getElementById('contrastBtn').classList.add('active');
    } else {
        document.body.classList.remove('high-contrast');
        document.getElementById('contrastBtn').classList.remove('active');
    }
}
