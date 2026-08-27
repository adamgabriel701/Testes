let currentFontSize = 100;
let highContrast = false;

function initAccessibility() {
    if (document.getElementById('a11yToolbar')) return;

    const isDark = document.body.classList.contains('dark');

    const toolbar = document.createElement('div');
    toolbar.id = 'a11yToolbar';
    // Canto inferior direito — não conflita com o FAB (canto esquerdo)
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
        <button onclick="toggleDarkMode()" title="Modo escuro" aria-label="Modo escuro" id="darkModeBtn">
            <iconify-icon icon="${isDark ? 'lucide:sun' : 'lucide:moon'}" class="text-sm"></iconify-icon>
            <span class="text-[10px] font-heading font-bold">${isDark ? 'Claro' : 'Escuro'}</span>
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
    if (document.body.classList.contains('dark')) {
        document.getElementById('darkModeBtn').classList.add('active');
    }
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
    document.body.classList.toggle('high-contrast', highContrast);
    document.getElementById('contrastBtn').classList.toggle('active', highContrast);
}