'use client';

import { useCart } from '@/lib/store';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function CartDrawer() {
  const isCartOpen = useCart((state) => state.isCartOpen);
  const closeCart = useCart((state) => state.closeCart);
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const total = useCart((state) => state.total());
  const checkout = useCart((state) => state.checkout);

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isCartOpen]);

  // NOVO: Lógica de Frete Grátis
  const FREE_SHIPPING_THRESHOLD = 100;
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm" onClick={closeCart} />

          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-surface z-95 shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-bold text-secondary">Seu Pedido</h3>
              <button onClick={closeCart} className="text-gray-400 hover:text-secondary active:scale-90 transition-transform">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* NOVO: Barra de Progresso Frete Grátis */}
            {items.length > 0 && (
              <div className="p-4 bg-primary/5 border-b border-gray-100 dark:border-gray-800">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-xs text-muted mb-2">
                    Faltam <span className="font-bold text-primary">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</span> para o frete grátis! 🚀
                  </p>
                ) : (
                  <p className="text-xs font-bold text-green-500 mb-2">Você ganhou frete grátis! 🎉</p>
                )}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${shippingProgress}%` }} transition={{ duration: 0.5 }} className="h-full bg-primary rounded-full" />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted">
                  <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div key={`${item.id}-${index}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-secondary">{item.quantity}x {item.name}</h4>
                        <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:underline">Remover</button>
                      </div>
                      
                      {item.selections && item.selections.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.selections.map((sel, i) => (
                            <div key={i} className="text-xs text-muted flex items-center gap-1">
                              <span className="text-primary">•</span> {sel.label}
                              {sel.price ? <span className="text-primary font-medium">+ R$ {sel.price.toFixed(2).replace('.', ',')}</span> : null}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NOVO: Exibir observações */}
                      {item.notes && (
                        <div className="mt-2 text-xs text-muted italic bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                          📝 {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-secondary text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-6 bg-surface space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted">Total</span>
                  <span className="text-2xl font-bold text-secondary">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onClick={() => { closeCart(); useCart.setState({ orderStatus: 'checkout' }); }} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2">
                  Finalizar Pedido
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}