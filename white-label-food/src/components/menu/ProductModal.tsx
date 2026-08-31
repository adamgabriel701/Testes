'use client';

import { useCart } from '@/lib/store';
import type { CartItem, CartSelection } from '@/lib/store';
import { getCustomizations } from '@/lib/customizations';
import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductModal() {
  const activeProduct = useCart((state) => state.activeProduct);
  const closeProductModal = useCart((state) => state.closeProductModal);
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);

  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<CartSelection[]>([]);
  const [notes, setNotes] = useState(''); // NOVO

  useEffect(() => {
    if (activeProduct) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setSelections([]);
      setNotes('');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeProduct]);

  const groups = useMemo(() => {
    if (!activeProduct) return [];
    return getCustomizations(activeProduct.category || 'default');
  }, [activeProduct]);

  const { extrasPrice, finalPrice } = useMemo(() => {
    const base = activeProduct?.price || 0;
    const extras = selections.reduce((sum, sel) => sum + (sel.price || 0), 0);
    return { extrasPrice: extras, finalPrice: (base + extras) * quantity };
  }, [activeProduct, selections, quantity]);

  const handleSelectOption = (group: typeof groups[0], optionId: string, label: string, price?: number) => {
    if (group.type === 'single') {
      setSelections(prev => [...prev.filter(s => s.groupId !== group.id), { groupId: group.id, optionId, label, price }]);
    } else {
      setSelections(prev => {
        const exists = prev.find(s => s.optionId === optionId);
        if (exists) return prev.filter(s => s.optionId !== optionId);
        return [...prev, { groupId: group.id, optionId, label, price }];
      });
    }
  };

  const handleAddItem = () => {
    if (!activeProduct) return;
    const cartItem: CartItem = {
      id: activeProduct.id,
      name: activeProduct.name,
      basePrice: activeProduct.price,
      price: activeProduct.price + extrasPrice,
      quantity: quantity,
      image: activeProduct.imageUrl,
      selections: selections,
      notes: notes.trim() || undefined, // NOVO
    };
    addItem(cartItem);
    closeProductModal();
    openCart();
  };

  return (
    <AnimatePresence>
      {activeProduct && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md"
          onClick={closeProductModal}
        >
          <motion.div 
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-surface rounded-t-4xl md:rounded-4xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-48 md:h-auto relative bg-gray-100 dark:bg-gray-800">
              <img src={activeProduct.imageUrl} alt={activeProduct.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative">
              <button onClick={closeProductModal} className="absolute top-4 right-4 text-gray-400 hover:text-secondary bg-surface rounded-full p-2 shadow-sm active:scale-90 transition-transform z-10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-3xl font-extrabold text-secondary mt-2">{activeProduct.name}</h2>
              <p className="text-muted leading-relaxed mt-2 mb-6">{activeProduct.description}</p>

              <div className="space-y-6 mb-6">
                {groups.map((group) => (
                  <div key={group.id}>
                    <h3 className="font-bold text-secondary mb-3 flex items-center gap-2">
                      {group.title}
                      {group.required && <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Obrigatório</span>}
                    </h3>
                    <div className="space-y-2">
                      {group.options.map((option) => {
                        const isSelected = selections.some(s => s.optionId === option.id);
                        return (
                          <button key={option.id} onClick={() => handleSelectOption(group, option.id, option.label, option.price)}
                            className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <span className="font-medium text-secondary text-left">{option.label}</span>
                            <div className="flex items-center gap-3">
                              {option.price ? <span className="text-sm font-bold text-primary">+ R$ {option.price.toFixed(2).replace('.', ',')}</span> : <span className="text-sm text-muted">Grátis</span>}
                              <div className={`h-5 w-5 flex items-center justify-center border ${group.type === 'single' ? 'rounded-full' : 'rounded-md'} ${isSelected ? 'bg-primary border-primary' : 'border-gray-400 dark:border-gray-500'}`}>
                                {isSelected && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* NOVO: Campo de Observações */}
                <div>
                  <h3 className="font-bold text-secondary mb-3">Observações</h3>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Sem cebola, ponto da carne, etc."
                    className="w-full bg-gray-100 dark:bg-gray-800 text-secondary p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-surface">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-secondary text-xl font-bold w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">−</button>
                    <span className="font-bold text-secondary w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="text-primary text-xl font-bold w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">+</button>
                  </div>
                  <button onClick={handleAddItem} className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2">
                    Adicionar <span className="bg-primary/80 px-2 py-0.5 rounded-lg text-sm">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
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