'use client';

import { useCart } from '@/lib/store';
import { floristMenu } from '@/lib/products-florist';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CartDrawer from '@/components/ui/CartDrawer'; // Reaproveita o Carrinho
import FloatingCart from '@/components/ui/FloatingCart'; // Reaproveita o Botão Flutuante
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FloristAdapter({ tenantName }: { tenantName: string }) {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', 'Buquês', 'Datas Especiais', 'Plantas'];
  
  const filteredMenu = filter === 'Todos' 
    ? floristMenu 
    : floristMenu.filter(section => section.category.includes(filter));

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      basePrice: product.price,
      price: product.price,
      quantity: 1,
      image: product.imageUrl
    });
    openCart();
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <h1 className="text-xl font-extrabold tracking-tight text-secondary">{tenantName}</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Banner de Entrega Rápida */}
      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
        🌷 Entrega no mesmo dia | Pedidos até 16h
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              // Usando as classes fixas de preto/branco para evitar bug de contraste no dark mode
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                filter === cat 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-transparent text-secondary border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-10">
        {filteredMenu.map((section) => (
          <section key={section.category}>
            <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-3">
              <span className="text-3xl">{section.icon}</span>
              {section.category}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {section.products.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col bg-surface rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    {product.tags && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                        {product.tags[0]}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-bold text-secondary text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted line-clamp-2 mt-1 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-md font-extrabold text-secondary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                      <button 
                        onClick={() => handleQuickAdd(product)}
                        className="bg-primary text-white text-xs font-bold p-2 rounded-xl active:scale-90 transition-transform shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
