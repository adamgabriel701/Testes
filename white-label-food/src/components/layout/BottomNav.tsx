'use client';

import { useCart } from '@/lib/store';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const openCart = useCart((state) => state.openCart);
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [activeSection, setActiveSection] = useState('inicio');

  // Monitora qual seção está visível na tela para destacar no menu
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'cardapio'];
      const offset = window.scrollY + window.innerHeight / 3;

      if (window.scrollY < 300) {
        setActiveSection('inicio');
        return;
      }

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el && el.offsetTop <= offset) {
          setActiveSection(sec);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: '🏠', action: () => scrollTo('inicio') },
    { id: 'cardapio', label: 'Cardápio', icon: '📖', action: () => scrollTo('cardapio') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-gray-100 dark:border-gray-800 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center w-full h-full text-xs relative"
          >
            <span className={`text-xl mb-1 transition-transform ${activeSection === item.id ? 'scale-110' : 'opacity-50 grayscale'}`}>
              {item.icon}
            </span>
            <span className={`font-medium ${activeSection === item.id ? 'text-primary' : 'text-muted'}`}>
              {item.label}
            </span>
            {activeSection === item.id && (
              <motion.div layoutId="navIndicator" className="absolute top-0 w-12 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
        
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center w-full h-full text-xs relative"
        >
          <div className="relative">
            <span className="text-xl mb-1 block opacity-50 grayscale">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 right-0 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="font-medium text-muted">Pedido</span>
        </button>
      </div>
    </nav>
  );
}