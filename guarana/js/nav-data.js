const NAV_ITEMS = [
    { label: 'Início', href: 'index.html' },
    { label: 'Guaraná', href: 'guarana.html' },
    { label: 'Sateré-Mawé', href: 'satere-mawe.html' },
    { label: 'Turismo', href: 'index.html#galeria' },
    { label: 'Longevidade', href: 'index.html#longevidade' },
    { label: 'Pesca', href: 'pesca-esportiva.html' },
    { label: 'Onde Ficar', href: 'onde-ficar.html' },
    { label: 'Onde Comer', href: 'onde-comer.html' },
    { label: 'Eventos', href: 'noticias-e-eventos.html' },
    { label: 'Contato', href: 'contato-e-suporte.html' },
];

function renderNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const desktop = document.getElementById('desktopNav');
    if (desktop) {
        desktop.innerHTML = NAV_ITEMS.map(item => {
            const isActive = item.href === currentPage || (currentPage === '' && item.href === 'index.html');
            return `<a href="${item.href}" class="nav-link px-3 py-2 text-sm font-medium text-white/80 hover:text-sol transition-colors rounded-lg hover:bg-white/10 ${isActive ? '!text-sol' : ''}">${item.label}</a>`;
        }).join('');
    }

    const mobile = document.getElementById('mobileNavLinks');
    if (mobile) {
        mobile.innerHTML = NAV_ITEMS.map(item =>
            `<a href="${item.href}" onclick="toggleMobileMenu()" class="text-xl font-heading font-bold text-areia hover:text-sol transition-colors">${item.label}</a>`
        ).join('');
    }

    // Footer
    const footer = document.getElementById('siteFooter');
    if (footer) {
        footer.innerHTML = `
        <div class="bg-amazon-dark pt-16 pb-8">
            <div class="max-w-[1400px] mx-auto px-4 md:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div>
                        <a href="index.html" class="flex items-center gap-3 mb-5">
                            <div class="w-10 h-10 rounded-full bg-guarana flex items-center justify-center"><iconify-icon icon="lucide:flower2" class="text-white text-lg"></iconify-icon></div>
                            <div><span class="font-heading font-extrabold text-lg text-white block leading-tight">Maués</span><span class="text-[10px] text-sol font-heading font-semibold tracking-widest uppercase">Capital do Guaraná</span></div>
                        </a>
                        <p class="text-white/50 text-sm font-body leading-relaxed mb-5">Onde a floresta encontra a tradição. Um destino autêntico no coração da Amazônia.</p>
                        <div class="flex items-center gap-3">
                            <a href="#" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-guarana hover:text-white transition-all" aria-label="Instagram"><iconify-icon icon="lucide:instagram" class="text-sm"></iconify-icon></a>
                            <a href="#" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-guarana hover:text-white transition-all" aria-label="Facebook"><iconify-icon icon="lucide:facebook" class="text-sm"></iconify-icon></a>
                            <a href="#" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-guarana hover:text-white transition-all" aria-label="YouTube"><iconify-icon icon="lucide:youtube" class="text-sm"></iconify-icon></a>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">Navegação</h4>
                        <ul class="space-y-3">${NAV_ITEMS.slice(0,5).map(i=>`<li><a href="${i.href}" class="text-white/50 text-sm font-body hover:text-sol transition-colors">${i.label}</a></li>`).join('')}</ul>
                    </div>
                    <div>
                        <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">Mais</h4>
                        <ul class="space-y-3">${NAV_ITEMS.slice(5).map(i=>`<li><a href="${i.href}" class="text-white/50 text-sm font-body hover:text-sol transition-colors">${i.label}</a></li>`).join('')}<li><a href="#" class="text-white/50 text-sm font-body hover:text-sol transition-colors">Política de Privacidade</a></li></ul>
                    </div>
                    <div>
                        <h4 class="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">Contato</h4>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3"><iconify-icon icon="lucide:map-pin" class="text-sol text-sm mt-0.5 flex-shrink-0"></iconify-icon><span class="text-white/50 text-sm font-body">Centro, Maués — AM<br>CEP 69180-000</span></li>
                            <li class="flex items-center gap-3"><iconify-icon icon="lucide:phone" class="text-sol text-sm flex-shrink-0"></iconify-icon><span class="text-white/50 text-sm font-body">(92) 3532-1100</span></li>
                            <li class="flex items-center gap-3"><iconify-icon icon="lucide:mail" class="text-sol text-sm flex-shrink-0"></iconify-icon><span class="text-white/50 text-sm font-body">turismo@maues.am.gov.br</span></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p class="text-white/30 text-xs font-body text-center md:text-left">2025 Turismo Maués. Todos os direitos reservados.</p>
                    <div class="flex items-center gap-2 text-white/30 text-xs font-body"><iconify-icon icon="lucide:heart" class="text-guarana text-sm"></iconify-icon> Feito com amor pela Amazônia</div>
                </div>
            </div>
        </div>`;
    }
}