// Base de dados dos produtos
const produtos = {
    "1": {
        titulo: "Laranja",
        subtitulo: "Refrescante",
        preco: "R$ 12,00",
        descricao: "Suco de laranja 100% natural, espremido na hora e sem adição de açúcar. Rico em vitamina C.",
        cor: "#FF8C00"
    },
    "2": {
        titulo: "Morango",
        subtitulo: "Cremoso",
        preco: "R$ 15,00",
        descricao: "Milkshake cremoso de morango feito com frutas frescas e leite integral.",
        cor: "#FF1493"
    },
    "3": {
        titulo: "Limão",
        subtitulo: "Cítrico",
        preco: "R$ 10,00",
        descricao: "Limonada suíça gelada com toque de hortelã. Perfeita para dias quentes.",
        cor: "#32CD32"
    },
    "4": {
        titulo: "Uva",
        subtitulo: "Intenso",
        preco: "R$ 18,00",
        descricao: "Suco integral de uva tinta, com sabor encorpado e antioxidante.",
        cor: "#8B008B"
    },
    "5": {
        titulo: "Maracujá",
        subtitulo: "Exótico",
        preco: "R$ 14,00",
        descricao: "Suco de maracujá com polpa congelada, levemente azedo e muito refrescante.",
        cor: "#FFD700"
    }
};

const slider = id('slider');
const modal = id('modalDetalhes');
const btnPlayPause = id('btnPlayPause');

let isPlaying = true;
let currentRotation = 0;
const totalItens = 5;
const anguloPorItem = 360 / totalItens;

function id(elementId) {
    return document.getElementById(elementId);
}

// Controle do Carrossel
btnPlayPause.addEventListener('click', () => {
    isPlaying = !isPlaying;
    slider.style.animationPlayState = isPlaying ? 'running' : 'paused';
    btnPlayPause.textContent = isPlaying ? '⏸ Pausar' : '▶ Play';
});

id('btnProximo').addEventListener('click', () => rotacionarCarrossel(-1));
id('btnAnterior').addEventListener('click', () => rotacionarCarrossel(1));

function rotacionarCarrossel(direcao) {
    if (isPlaying) {
        isPlaying = false;
        slider.style.animationPlayState = 'paused';
        btnPlayPause.textContent = '▶ Play';
    }
    currentRotation += direcao * anguloPorItem;
    slider.style.animation = 'none'; // Desativa animação CSS continua para evitar conflitos
    slider.style.transition = 'transform 0.5s ease-out';
    slider.style.transform = `perspective(1000px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
}

// Modal de Detalhes
document.querySelectorAll('.slider .item').forEach(item => {
    item.addEventListener('click', () => {
        const idProduto = item.getAttribute('data-id');
        const produto = produtos[idProduto];
        if (produto) abrirModal(produto);
    });
});

function abrirModal(produto) {
    id('modalTitulo').textContent = produto.titulo;
    id('modalSubtitulo').textContent = produto.subtitulo;
    id('modalPreco').textContent = produto.preco;
    id('modalDescricao').textContent = produto.descricao;
    id('modalCorTopo').style.background = produto.cor;

    modal.classList.add('active');
    slider.style.animationPlayState = 'paused';
    id('btnFecharModal').focus();
}

function fecharModal() {
    modal.classList.remove('active');
    if (isPlaying) {
        slider.style.animationPlayState = 'running';
    }
}

id('btnFecharModal').addEventListener('click', fecharModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        fecharModal();
    }
});