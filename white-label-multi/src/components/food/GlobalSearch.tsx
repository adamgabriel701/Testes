'use client';

import { useCart } from '@/lib/store';
import { menuData } from '@/lib/products';
import { pitzariaMenu } from '@/lib/products-pitzaria';
import { xpiuMenu } from '@/lib/products-xpiu'; // NOVO IMPORT
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

export default function GlobalSearch() {
  const isSearchOpen = useCart((state) => state.isSearchOpen);
  const closeSearch = useCart((state) => state.closeSearch);
  const searchQuery = useCart((state) => state.searchQuery);
  const setSearchQuery = useCart((state) => state.setSearchQuery);
  const openProductModal = useCart((state) => state.openProductModal);

  const allMenus = useMemo(() => [...menuData, ...pitzariaMenu, ...xpiuMenu], []);

  const results = useMemo(() => {
    if (!searchQuery || !isSearchOpen) return [];
    
    return allMenus.flatMap(section => 
      section.products
        .filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(p => ({ ...p, section: section.category }))
    );
  }, [searchQuery, isSearchOpen, allMenus]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-background flex flex-col"
        >
          {/* Cabeçalho da Busca */}
          <div className="border-b border-gray-100 dark:border-gray-800 bg-surface shadow-sm">
            <div className="max-w-3xl mx-auto p-4 flex items-center gap-4">
              <button onClick={closeSearch} className="text-secondary active:scale-90 transition-transform">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="flex-1 relative">
                <input 
                  autoFocus
                  type="text"
                  placeholder="O que você deseja comer hoje?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-secondary px-5 py-3 pl-10 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Área de Resultados */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4">
              {searchQuery && results.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  <p className="text-4xl mb-4">🔍</p>
                  <p>Nenhum produto encontrado para "{searchQuery}"</p>
                </div>
              ) : searchQuery ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">
                    {results.length} Resultados encontrados
                  </h3>
                  {results.map((product) => (
                    <motion.button 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        openProductModal(product);
                        closeSearch();
                      }}
                      className="w-full flex items-center gap-4 bg-surface p-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-left border border-transparent hover:border-primary/20"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-primary font-medium">{product.section}</span>
                        <h4 className="font-bold text-secondary truncate">{product.name}</h4>
                        <p className="text-sm text-muted line-clamp-1">{product.description}</p>
                      </div>
                      <span className="font-bold text-secondary text-sm whitespace-nowrap">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted">
                  <p className="text-sm">Digite o nome de um produto para começar a buscar.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}