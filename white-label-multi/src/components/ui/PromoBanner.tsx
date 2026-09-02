'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PromoBannerProps {
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
}

export default function PromoBanner({ image, title, subtitle, ctaText = 'Aproveitar' }: PromoBannerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg my-8 group cursor-pointer"
    >
      <Image 
        src={image} 
        alt={title} 
        fill 
        className="object-cover group-hover:scale-105 transition-transform duration-700" 
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-10 h-full flex flex-col justify-center p-8 max-w-md">
        <motion.h3 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg"
        >
          {title}
        </motion.h3>
        <motion.p 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 mt-2 text-sm md:text-base"
        >
          {subtitle}
        </motion.p>
        
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold w-fit shadow-lg active:scale-95 transition-transform"
        >
          {ctaText} →
        </motion.button>
      </div>
    </motion.div>
  );
}
