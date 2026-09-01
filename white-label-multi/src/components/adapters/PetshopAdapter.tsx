'use client';

import { useCart } from '@/lib/store';
import { petshopMenu } from '@/lib/products-petshop';
import ThemeToggle from '@/components/core/ThemeToggle';
import CartDrawer from '@/components/food/CartDrawer'; // Reaproveita o Carrinho
import FloatingCart from '@/components/food/FloatingCart'; // Reaproveita o Botão Flutuante
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PetshopAdapter({ tenantName }: { tenantName: string }) {
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);

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
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-extrabold tracking-tight text-secondary">{tenantName}</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Banner Fofo */}
      <div className="bg-primary text-white text-center py-3 text-sm font-medium">
        🐶 Tudo para o seu melhor amigo | Frete Grátis acima de R$ 199 🐱
      </div>

      {/* Lista de Produtos */}
      <div className="max-w-5xl mx-auto px-4 py-8 pb-20 space-y-10">
        {petshopMenu.map((section) => (
          <section key={section.category}>
            <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-3">
              <span className="text-3xl">{section.icon}</span>
              {section.category}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {section.products.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-surface p-4 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-800 hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {product.tags && (
                      <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full mr-2">
                        {product.tags[0]}
                      </span>
                    )}
                    <h3 className="font-bold text-secondary text-sm md:text-base">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted line-clamp-2 mt-1">{product.description}</p>
                    <p className="text-md font-extrabold text-secondary mt-2">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleQuickAdd(product)}
                    className="bg-primary text-white text-sm font-bold p-3 rounded-xl active:scale-90 transition-transform shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
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
