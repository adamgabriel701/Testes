'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import type { CarouselProduct } from '@/lib/products';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black/70 text-white px-4 py-2 rounded-full text-xs font-medium">
        Carregando... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function Product3DCarousel({ products }: { products: CarouselProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [canRender3D, setCanRender3D] = useState(true);
  const activeProduct = products[activeIndex];
  
  const openProductModal = useCart((state) => state.openProductModal);
  const addItem = useCart((state) => state.addItem);
  const openCart = useCart((state) => state.openCart);

  useEffect(() => {
    const isLowPerfDevice = navigator.hardwareConcurrency <= 4 || /Mobi|Android/i.test(navigator.userAgent);
    if (!activeProduct.modelUrl) setCanRender3D(false);
    else setCanRender3D(!isLowPerfDevice);
  }, [activeProduct.modelUrl]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => (prev + newDirection + products.length) % products.length);
  };

  const handleQuickAdd = () => {
    addItem({
      id: activeProduct.id,
      name: activeProduct.name,
      basePrice: activeProduct.price, // ADICIONADO AQUI
      price: activeProduct.price,     // Preço final (igual ao base, sem adicionais)
      quantity: 1,
      image: activeProduct.imageUrl
    });
    openCart();
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <div className="bg-surface rounded-4xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">
      
      {/* ÁREA DO CARROSSEL 3D / IMAGEM */}
      <div className="w-full md:w-1/2 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative h-80 md:h-auto flex items-center justify-center">
        
        {canRender3D && activeProduct.modelUrl ? (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Model url={activeProduct.modelUrl} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            <Suspense fallback={<Loader />}><></></Suspense>
          </Canvas>
        ) : (
          <motion.div 
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full relative p-8"
          >
            <Image 
              src={activeProduct.imageUrl} 
              alt={activeProduct.name} 
              fill 
              className="object-contain drop-shadow-2xl" 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        )}

        {/* Setas de Navegação */}
        <button 
          onClick={() => paginate(-1)} 
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full p-2 shadow-lg backdrop-blur transition-all hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => paginate(1)} 
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-full p-2 shadow-lg backdrop-blur transition-all hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Tags (Novo, Mais Pedido) */}
        {activeProduct.tags && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {activeProduct.tags.map((tag: string) => (
              // Trocado bg-secondary por bg-gray-900 dark:bg-gray-700
              <span key={tag} className="bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Badges de Indicadores (Bolinhas) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => { setDirection(idx > activeIndex ? 1 : -1); setActiveIndex(idx); }}
              className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* ÁREA DE INFORMAÇÕES DO PRODUTO ATIVO */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-4 justify-between relative overflow-hidden">
        {/* Animação de troca de texto */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeProduct.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-secondary">{activeProduct.name}</h2>
            <p className="text-muted leading-relaxed text-sm md:text-base">{activeProduct.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted text-sm">A partir de</span>
            <motion.span 
              key={`price-${activeProduct.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-primary"
            >
              R$ {activeProduct.price.toFixed(2).replace('.', ',')}
            </motion.span>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => openProductModal(activeProduct)}
              className="flex-1 border-2 border-secondary text-secondary py-3 rounded-2xl font-bold hover:bg-secondary/5 transition-colors active:scale-95"
            >
              Personalizar
            </button>
            <button 
              onClick={handleQuickAdd}
              className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 active:scale-95"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}