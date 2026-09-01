'use client';

import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function CheckoutView() {
  const orderStatus = useCart((state) => state.orderStatus);
  const checkout = useCart((state) => state.checkout);
  const deliveryInfo = useCart((state) => state.deliveryInfo);
  const setDeliveryInfo = useCart((state) => state.setDeliveryInfo);
  const total = useCart((state) => state.total());
  
  const [errors, setErrors] = useState({ name: '', address: '' });

  const handleCheckout = () => {
    let hasError = false;
    if (!deliveryInfo.name) { setErrors(e => ({...e, name: 'Por favor, informe seu nome'})); hasError = true; }
    if (!deliveryInfo.address) { setErrors(e => ({...e, address: 'Por favor, informe seu endereço'})); hasError = true; }
    
    if (!hasError) checkout();
  };

  return (
    <AnimatePresence>
      {orderStatus === 'checkout' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-background flex items-center justify-center p-4" // Z-150 e cobre tudo
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="bg-surface rounded-4xl shadow-2xl w-full max-w-md p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-extrabold text-secondary mb-6">Finalizar Pedido</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Nome Completo</label>
                <input 
                  type="text" value={deliveryInfo.name}
                  onChange={(e) => { setDeliveryInfo({ name: e.target.value }); setErrors(prev => ({...prev, name: ''})); }}
                  className={`w-full bg-gray-100 dark:bg-gray-800 text-secondary p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 ${errors.name ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`}
                  placeholder="João da Silva"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Endereço de Entrega</label>
                <textarea 
                  value={deliveryInfo.address}
                  onChange={(e) => { setDeliveryInfo({ address: e.target.value }); setErrors(prev => ({...prev, address: ''})); }}
                  className={`w-full bg-gray-100 dark:bg-gray-800 text-secondary p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 ${errors.address ? 'ring-2 ring-red-500' : 'focus:ring-primary'}`}
                  placeholder="Rua, número, complemento e referência"
                  rows={3}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Forma de Pagamento</label>
                <select 
                  value={deliveryInfo.payment}
                  onChange={(e) => setDeliveryInfo({ payment: e.target.value })}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-secondary p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Cartão de Crédito (na entrega)</option>
                  <option>Pix</option>
                  <option>Dinheiro</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-secondary">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-lg mb-2">
                <span className="text-muted">Taxa de Entrega</span>
                <span className="text-secondary">R$ 5,90</span>
              </div>
              <div className="flex justify-between items-center text-xl mt-4">
                <span className="font-bold text-secondary">Total</span>
                <span className="font-extrabold text-primary">R$ {(total + 5.90).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 active:scale-95"
            >
              Confirmar e Pagar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
