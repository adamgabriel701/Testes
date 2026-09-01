'use client';

import { useCart } from '@/lib/store';
import { fashionData } from '@/lib/products-fashion';
import ThemeToggle from '@/components/core/ThemeToggle';
import FashionModal from '@/components/fashion/FashionModal';
import CartDrawer from '@/components/food/CartDrawer'; // Reaproveitando o Carrinho
import FloatingCart from '@/components/food/FloatingCart'; // Reaproveitando o Botão Flutuante
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function FashionAdapter({ tenantName }: { tenantName: string }) {
  const openFashionModal = useCart((state) => state.openFashionModal);
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', 'Camisetas', 'Calças', 'Moletom', 'Acessórios'];
  
  const filteredProducts = filter === 'Todos' 
    ? fashionData 
    : fashionData.filter(p => p.category === filter);

  return (
    <main className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-secondary">{tenantName}</h1>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Fashion */}
      <header className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80" 
          alt="Coleção" 
          fill 
          priority 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-10 left-10 max-w-lg">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-secondary drop-shadow-lg">Nova Coleção</h2>
            <p className="text-muted mt-2 text-lg">Peças exclusivas com até 30% OFF.</p>
          </motion.div>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => openFashionModal(product)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {product.tags && (
                <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                  {product.tags[0]}
                </span>
              )}
            </div>
            <h3 className="font-bold text-secondary text-sm md:text-base truncate">{product.name}</h3>
            <p className="text-primary font-bold text-sm md:text-base">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </motion.div>
        ))}
      </div>

      {/* Componentes Globais (Reaproveitados) */}
      <FashionModal />
      <CartDrawer />
      <FloatingCart />
    </main>
  );
}