'use client';

import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StickyHeader({ tenantName, menuData }: { tenantName: string, menuData: any[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const setStoreSearchQuery = useCart((state) => state.setSearchQuery);
  const openCart = useCart((state) => state.openCart);
  const items = useCart((state) => state.items);

  // Aparece ao rolar para baixo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Atualiza a busca no Zustand
  useEffect(() => {
    setStoreSearchQuery(searchQuery);
  }, [searchQuery, setStoreSearchQuery]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <h2 className="font-bold text-secondary hidden md:block">{tenantName}</h2>
            
            {/* Barra de Busca */}
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Buscar no cardápio..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 text-secondary px-5 py-2.5 pl-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Botão Carrinho Flutuante Pequeno */}
            <button onClick={openCart} className="relative bg-primary text-white p-2.5 rounded-full active:scale-90 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-surface text-primary text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Navegação Rápida */}
          {!searchQuery && (
            <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-4 overflow-x-auto no-scrollbar">
              {menuData.map((section) => (
                <a
                  key={section.category}
                  href={`#${section.category.toLowerCase().replace(/\s/g, '-')}`}
                  className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  <span className="text-lg">{section.icon}</span>
                  {section.category}
                </a>
              ))}
            </div>
          )}
        </motion.header>
      )}
    </AnimatePresence>
  );
}