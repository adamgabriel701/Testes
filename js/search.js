// ===== BUSCA GLOBAL (Cmd+K / Ctrl+K) =====
let searchData = [];
let searchOpen = false;

async function initSearch() {
    try {
        const base = document.documentElement.dataset.base || '.';
        const res = await fetch(`${base}/js/search-data.json`);
        searchData = await res.json();
    } catch {
        // Fallback se offline ou falhar
        searchData = [
            { title: 'Página Inicial', desc: 'Portal de turismo de Maués', url: 'index.html', tags: ['inicio','home'] },
            { title: 'Guaraná', desc: 'Rota sagrada do guaraná', url: 'guarana.html', tags: ['guaraná','lavoura'] },
            { title: 'Sateré-Mawé', desc: 'Cultura e turismo comunitário', url: 'satere-mawe.html', tags: ['indígena','artesanato'] },
            { title: 'Onde Ficar', desc: 'Hospedagem em Maués', url: 'onde-ficar.html', tags: ['pousada','hotel'] },
            { title: 'Onde Comer', desc: 'Gastronomia amazônica', url: 'onde-comer.html', tags: ['comida','restaurante'] },
            { title: 'Pesca Esportiva', desc: 'Tucunaré-açu e mais', url: 'pesca-esportiva.html', tags: ['pesca','tucunaré'] },
            { title: 'Eventos', desc: 'Festa do Guaraná e mais', url: 'noticias-e-eventos.html', tags: ['festa','evento'] },
            { title: 'Contato', desc: 'Central do visitante', url: 'contato-e-suporte.html', tags: ['contato','emergência'] }
        ];
    }
    buildSearchUI();
    bindSearchKeys();
}

function buildSearchUI() {
    if (document.getElementById('searchModal')) return;

    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-backdrop" onclick="closeSearch()"></div>
        <div class="search-panel">
            <div class="search-input-wrap">
                <iconify-icon icon="lucide:search" class="search-input-icon"></iconify-icon>
                <input type="text" id="searchInput" placeholder="Buscar em Maués..." autocomplete="off">
                <kbd class="search-kbd">ESC</kbd>
            </div>
            <div id="searchResults" class="search-results">
                <div class="search-hint">
                    <iconify-icon icon="lucide:command" class="text-xl text-white/20 mb-2 block"></iconify-icon>
                    <p class="text-white/30 text-xs font-body">Digite para buscar páginas, eventos, atrativos...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('searchInput').addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        const container = document.getElementById('searchResults');
        if (!q) {
            container.innerHTML = `<div class="search-hint"><iconify-icon icon="lucide:command" class="text-xl text-white/20 mb-2 block"></iconify-icon><p class="text-white/30 text-xs font-body">Digite para buscar páginas, eventos, atrativos...</p></div>`;
            return;
        }
        const results = searchData.filter(item => {
            const haystack = `${item.title} ${item.desc} ${item.tags.join(' ')}`.toLowerCase();
            return haystack.includes(q);
        });
        if (!results.length) {
            container.innerHTML = `<div class="search-hint"><iconify-icon icon="lucide:search-x" class="text-xl text-white/20 mb-2 block"></iconify-icon><p class="text-white/30 text-xs font-body">Nenhum resultado para "<strong class="text-white/50">${q}</strong>"</p></div>`;
            return;
        }
        container.innerHTML = results.map(r => `
            <a href="${r.url}" class="search-result-item" onclick="closeSearch()">
                <div class="search-result-icon"><iconify-icon icon="lucide:file-text" class="text-sol"></iconify-icon></div>
                <div class="search-result-text">
                    <span class="search-result-title">${r.title}</span>
                    <span class="search-result-desc">${r.desc}</span>
                </div>
                <iconify-icon icon="lucide:arrow-right" class="search-result-arrow"></iconify-icon>
            </a>
        `).join('');
    });
}

function bindSearchKeys() {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchOpen ? closeSearch() : openSearch();
        }
        if (e.key === 'Escape' && searchOpen) closeSearch();
    });
}

function openSearch() {
    searchOpen = true;
    const m = document.getElementById('searchModal');
    if (m) { m.classList.add('open'); document.getElementById('searchInput').focus(); }
    document.body.style.overflow = 'hidden';
}

function closeSearch() {
    searchOpen = false;
    const m = document.getElementById('searchModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
}
