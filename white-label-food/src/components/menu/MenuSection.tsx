'use client';

import { useCart } from '@/lib/store';
import Product3DCarousel from '@/components/menu/Product3DCarousel'; // Mudou de './Product3DCarousel'
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuSection as MenuSectionType } from '@/lib/products';

export default function MenuSection({ section }: { section: MenuSectionType }) {
  const searchQuery = useCart((state) => state.searchQuery);

  // Se estiver buscando e não encontrar nada nesta seção, esconde ela
  if (searchQuery) {
    const hasMatches = section.products.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (!hasMatches) return null;
  }

  return (
    <AnimatePresence>
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        id={section.category.toLowerCase().replace(/\s/g, '-')}
        className="scroll-mt-32"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{section.icon}</span>
          <h2 className="text-2xl font-bold text-secondary">{section.category}</h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-4"></div>
        </div>
        <Product3DCarousel products={section.products} />
      </motion.section>
    </AnimatePresence>
  );
}
