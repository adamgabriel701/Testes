'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { name: 'Ana Silva', avatar: 'A', text: 'Experiência de compra incrível! A interface é muito rápida e o checkout foi super fácil.', rating: 5 },
  { name: 'Bruno Costa', avatar: 'B', text: 'O design escuro é lindo. Muito confortável de navegar à noite.', rating: 5 },
  { name: 'Carla Dias', avatar: 'C', text: 'As animações são fluidas e não travam meu celular. Parabéns pelo app!', rating: 4 },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  // Troca automática a cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-48 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center"
        >
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < testimonials[index].rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
            ))}
          </div>
          <p className="text-secondary text-lg font-medium italic mb-4">"{testimonials[index].text}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {testimonials[index].avatar}
            </div>
            <span className="font-bold text-secondary">{testimonials[index].name}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
