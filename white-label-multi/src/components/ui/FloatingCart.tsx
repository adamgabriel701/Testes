'use client';

import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCart() {
  const items = useCart((state) => state.items);
  const total = useCart((state) => state.total());
  const openCart = useCart((state) => state.openCart);
  const orderStatus = useCart((state) => state.orderStatus); // NOVO
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // NOVO: Se estiver no checkout ou tracker, não mostra o botão flutuante
  if (itemCount === 0 || orderStatus !== 'cart') return null;

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 md:bottom-8 left-0 right-0 z-40 px-4 pb-4 md:pb-8"
        >
          <div className="max-w-5xl mx-auto">
            <button 
              onClick={openCart}
              className="w-full bg-surface text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/40 active:scale-95 transition-transform flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="bg-surface px-2 py-1 rounded-full text-sm">
                  {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                </span>
                <span>Ver Carrinho</span>
              </div>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}