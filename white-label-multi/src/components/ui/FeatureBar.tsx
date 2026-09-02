'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🚚',
    title: 'Frete Grátis',
    desc: 'Acima de R$ 199'
  },
  {
    icon: '💳',
    title: 'Parcele em até 12x',
    desc: 'Sem juros no cartão'
  },
  {
    icon: '🔄',
    title: 'Troca Fácil',
    desc: 'Até 30 dias'
  },
  {
    icon: '🔒',
    title: 'Compra Segura',
    desc: 'Ambiente protegido'
  }
];

export default function FeatureBar() {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feat, i) => (
          <motion.div 
            key={feat.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-2xl">{feat.icon}</span>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-secondary">{feat.title}</h4>
              <p className="text-[10px] md:text-xs text-muted">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
