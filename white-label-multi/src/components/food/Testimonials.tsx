'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Maria Silva',
    avatar: 'M',
    rating: 5,
    comment: 'O melhor hambúrguer da cidade! O pão é super fresquinho e a carne desmancha na boca. Entrega rápida demais!'
  },
  {
    name: 'João Souza',
    avatar: 'J',
    rating: 5,
    comment: 'Pedi a pizza pepperoni e fiquei impressionado com a qualidade dos ingredientes. Com certeza vou pedir mais vezes!'
  },
  {
    name: 'Ana Costa',
    avatar: 'A',
    rating: 4,
    comment: 'Comida deliciosa e quente quando chegou. O milkshake de ovomaltine é simplesmente perfeito. Recomendo!'
  }
];

export default function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        O que os clientes dizem
      </h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface p-6 rounded-4xl shadow-sm border border-gray-50 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-bold text-secondary">{t.name}</h4>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={idx < t.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">"{t.comment}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
