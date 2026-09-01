'use client';

import { useCart } from '@/lib/store';
import { pharmaMenu } from '@/lib/products-pharmacy';
import ThemeToggle from '@/components/core/ThemeToggle';
import CartDrawer from '@/components/food/CartDrawer'; // Reaproveita o Carrinho
import FloatingCart from '@/components/food/FloatingCart'; // Reaproveita o Botão Flutuante
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PharmacyAdapter({ tenantName }: { tenantName: string }) {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', 'Analgésicos', 'Vitaminas', 'Antialérgicos', 'Primeiros Socorros'];
  
  const filteredMenu = filter === 'Todos' 
    ? pharmaMenu 
    : pharmaMenu.filter(section => section.category.includes(filter));

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
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <h1 className="text-xl font-extrabold tracking-tight text-secondary">{tenantName}</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Banner de Entrega Rápida */}
      <div className="bg-primary text-white text-center py-2 text-sm font-medium">
        🚑 Entrega em até 45 minutos | Plantão 24h
      </div>

      {/* Filtros */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === cat ? 'bg-secondary text-white' : 'bg-surface text-muted hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Medicamentos */}
      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-8">
        {filteredMenu.map((section) => (
          <section key={section.category}>
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <span className="text-2xl">{section.icon}</span>
              {section.category}
            </h2>
            
            <div className="space-y-3">
              {section.products.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-surface p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-800"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {product.tags && (
                      <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full mr-2">
                        {product.tags[0]}
                      </span>
                    )}
                    <h3 className="font-bold text-secondary text-sm md:text-base truncate">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted truncate">{product.description}</p>
                    <p className="text-sm font-bold text-secondary mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleQuickAdd(product)}
                    className="bg-primary text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl active:scale-90 transition-transform shadow-sm"
                  >
                    Adicionar
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Componentes Globais Reaproveitados */}
      <CartDrawer />
      <FloatingCart />
    </main>
  );
}
