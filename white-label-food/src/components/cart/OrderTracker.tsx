'use client';

import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { key: 'preparing', label: 'Preparando', icon: '👨‍🍳', description: 'Seu pedido está na cozinha' },
  { key: 'delivering', label: 'A caminho', icon: '🛵', description: 'O entregador saiu com seu pedido' },
  { key: 'delivered', label: 'Entregue', icon: '✅', description: 'Bom apetite!' },
];

export default function OrderTracker() {
  const orderStatus = useCart((state) => state.orderStatus);
  const orderId = useCart((state) => state.orderId);
  const resetOrder = useCart((state) => state.resetOrder);

  // Só renderiza se for um status de tracker (ignora 'cart' e 'checkout')
  if (orderStatus === 'cart' || orderStatus === 'checkout') return null;

  const currentStepIndex = steps.findIndex(s => s.key === orderStatus);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-background flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-surface shadow-2xl rounded-4xl p-8 text-center flex flex-col items-center">
          <div className="text-6xl mb-4">
            {steps[currentStepIndex]?.icon || '⏳'}
          </div>
          
          <span className="text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            Pedido {orderId}
          </span>

          <h2 className="text-3xl font-extrabold text-secondary mb-8">
            Acompanhe seu Pedido
          </h2>

          {/* Tracker Visual */}
          <div className="w-full flex flex-col gap-6 mb-10">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center gap-4">
                <div className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-500 ${idx <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                  {idx < currentStepIndex ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{idx + 1}</span>
                  )}
                </div>
                <div className="text-left flex-1">
                  <h4 className={`font-bold transition-colors ${idx <= currentStepIndex ? 'text-secondary' : 'text-gray-400 dark:text-gray-500'}`}>{step.label}</h4>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Botão para voltar ao cardápio */}
          {orderStatus === 'delivered' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={resetOrder}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 active:scale-95"
            >
              Fazer outro Pedido
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}