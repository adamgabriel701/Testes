'use client';

import { useCart } from '@/lib/store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { menuData } from '@/lib/products';

export default function HomeHero({ tenantName, tenantImage }: { tenantName: string, tenantImage: string }) {
  const openSearch = useCart((state) => state.openSearch);

  const scrollToMenu = (category?: string) => {
    // Rola a página suavemente até a seção desejada
    if (category) {
      const id = category.toLowerCase().replace(/\s/g, '-');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
      {/* Imagem de Fundo */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <Image 
          src={tenantImage} 
          alt={tenantName} 
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Barra Superior com Busca */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <button 
          onClick={openSearch}
          className="flex-1 max-w-xs bg-surface/90 backdrop-blur-md flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-muted shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar no cardápio...
        </button>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-5xl mx-auto px-4 pb-10 md:pb-12">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
            Aberto Agora
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">
            {tenantName}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm font-medium text-white/90 drop-shadow">
            <div className="flex items-center gap-1.5">⭐ 4.8 (2.5k)</div>
            <div className="flex items-center gap-1.5">🛵 30-45 min</div>
            <div className="flex items-center gap-1.5">💸 R$ 5,90</div>
          </div>
          
          <button 
            onClick={() => scrollToMenu()}
            className="bg-primary text-white py-4 px-8 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-2xl shadow-primary/20 active:scale-95 flex items-center gap-2 mb-6"
          >
            Ver Cardápio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Categorias Rápidas */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {menuData.slice(0, 4).map((section) => (
              <button
                key={section.category}
                onClick={() => scrollToMenu(section.category)}
                className="flex items-center gap-2 bg-surface/80 backdrop-blur-md text-white font-medium text-sm px-4 py-2 rounded-full whitespace-nowrap hover:bg-surface transition-colors shadow-sm"
              >
                <span className="text-lg">{section.icon}</span>
                {section.category}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}