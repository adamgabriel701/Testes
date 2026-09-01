'use client';

import { useCart } from '@/lib/store';
import type { FashionProduct } from '@/lib/products-fashion';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

export default function FashionModal() {
  const activeFashion = useCart((state) => state.activeFashion);
  const closeFashionModal = useCart((state) => state.closeFashionModal);
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);

  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (activeFashion) {
      document.body.style.overflow = 'hidden';
      setSize('');
      setQuantity(1);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeFashion]);

  const finalPrice = useMemo(() => (activeFashion?.price || 0) * quantity, [activeFashion, quantity]);

  const handleAddItem = () => {
    if (!activeFashion || !size) return;
    addItem({
      id: activeFashion.id,
      name: `${activeFashion.name} (Tam: ${size})`,
      basePrice: activeFashion.price,
      price: activeFashion.price,
      quantity: quantity,
      image: activeFashion.imageUrl,
      variant: `Tamanho: ${size}`
    });
    closeFashionModal();
    openCart();
  };

  return (
    <AnimatePresence>
      {activeFashion && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md"
          onClick={closeFashionModal}
        >
          <motion.div 
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-surface rounded-t-4xl md:rounded-4xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lado Esquerdo: Imagem */}
            <div className="w-full md:w-1/2 h-72 md:h-auto relative bg-gray-100 dark:bg-gray-800">
              <img src={activeFashion.imageUrl} alt={activeFashion.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative">
              <button onClick={closeFashionModal} className="absolute top-4 right-4 text-gray-400 hover:text-secondary bg-surface rounded-full p-2 shadow-sm active:scale-90 transition-transform z-10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="mt-2">
                {activeFashion.tags?.map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mr-2">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-extrabold text-secondary mt-2">{activeFashion.name}</h2>
              <p className="text-muted leading-relaxed mt-2 mb-6">{activeFashion.description}</p>

              {/* Seletor de Tamanho */}
              <div className="mb-6">
                <h3 className="font-bold text-secondary mb-3">Tamanho:</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['PP', 'P', 'M', 'G', 'GG'].map(sz => (
                    <button 
                      key={sz} 
                      onClick={() => setSize(sz)}
                      className={`py-3 rounded-xl border transition-colors font-bold ${size === sz ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-surface">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-secondary text-xl font-bold w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">−</button>
                    <span className="font-bold text-secondary w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="text-primary text-xl font-bold w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">+</button>
                  </div>
                  <button 
                    onClick={handleAddItem}
                    disabled={!size}
                    className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-opacity shadow-lg active:scale-95 flex items-center justify-center gap-2 ${!size ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:opacity-90 shadow-primary/20'}`}
                  >
                    {!size ? 'Selecione o tamanho' : 'Adicionar'}
                    {size && <span className="bg-primary/80 px-2 py-0.5 rounded-lg text-sm">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
