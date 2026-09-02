'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';
import FeatureBar from '@/components/ui/FeatureBar';
import Footer from '@/components/ui/Footer';
import Toast, { showToast } from '@/components/ui/Toast';
import TestimonialCarousel from '@/components/ui/TestimonialCarousel';
import Accordion from '@/components/ui/Accordion';

const testProducts = [
  { id: '1', name: 'Camiseta Premium', price: 79.90, imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', tags: ['Novo'] },
  { id: '2', name: 'Calça Cargo Street', price: 229.90, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80' },
  { id: '3', name: 'Moletom Canguru', price: 159.90, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', tags: ['Promo'] },
  { id: '4', name: 'Boné Aba Reta', price: 59.90, imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80' }
];

const faqItems = [
  { title: 'Como funciona a troca de produtos?', content: 'Você tem até 30 dias para solicitar a troca. Basta entrar na seção "Meus Pedidos", selecionar o item e justificar o motivo. Geraremos um código de postagem grátis.' },
  { title: 'Quais são os prazos de entrega?', content: 'O prazo varia por região. Geralmente, capitais levam de 2 a 5 dias úteis. Interior pode levar de 4 a 8 dias úteis. Você verá a estimativa exata no checkout.' },
  { title: 'Posso cancelar meu pedido?', content: 'Sim. Pedidos cancelados em até 1 hora após a compra têm 100% do estorno garantido. Após esse período, se já estiver em separação, o cancelamento pode ser negado.' }
];

export default function UITestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('descricao');
  const [toggleState, setToggleState] = useState(true);
  const [step, setStep] = useState(1);

  const triggerSkeleton = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-secondary uppercase">UI Sandbox</h1>
          <ThemeToggle />
        </div>
      </header>

      <FeatureBar />

      {/* SEÇÃO 1: Carrossel */}
      <section className="max-w-7xl mx-auto w-full px-4 py-16">
        <h2 className="text-xl font-bold text-muted mb-8 uppercase tracking-wider">1. Carrossel Automático</h2>
        <TestimonialCarousel />
      </section>

      {/* SEÇÃO 2: Skeleton & Toast */}
      <section className="max-w-7xl mx-auto w-full px-4 py-8">
        <h2 className="text-xl font-bold text-muted mb-8 uppercase tracking-wider">2. Skeleton & Notificações</h2>
        <div className="flex gap-4 mb-8">
          <button onClick={triggerSkeleton} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Simular Carregamento</button>
          <button onClick={() => showToast('Produto adicionado!')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">Disparar Toast</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testProducts.map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className={`relative aspect-[3/4] rounded-xl overflow-hidden ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''}`}>
                {!isLoading && <Image src={testProducts[i].imageUrl} alt={testProducts[i].name} fill className="object-cover" sizes="25vw" />}
              </div>
              <div className={`h-4 rounded w-3/4 ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 3: Acordeão (FAQ) */}
      <section className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-xl font-bold text-muted mb-8 uppercase tracking-wider">3. Acordeão (FAQ)</h2>
        <Accordion items={faqItems} />
      </section>

      {/* SEÇÃO 4: Tabs e Toggle */}
      <section className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-xl font-bold text-muted mb-8 uppercase tracking-wider">4. Tabs & Toggle Switch</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Tabs Animadas */}
          <div className="bg-surface p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              {['descricao', 'avaliacoes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 font-bold text-sm transition-colors ${activeTab === tab ? 'text-primary' : 'text-muted'}`}
                >
                  {tab === 'descricao' ? 'Descrição' : 'Avaliações (4)'}
                  {activeTab === tab && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-muted text-sm leading-relaxed">
              {activeTab === 'descricao' 
                ? 'Camiseta confeccionada em 100% algodão premium. Modelagem oversized com caimento perfeito. Toque macio e durabilidade reforçada após múltiplas lavagens.' 
                : '⭐⭐⭐⭐⭐ "Melhor camiseta que comprei! O tecido é excelente." - João'}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="bg-surface p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-secondary">Aceitar Marketing</h4>
                <p className="text-sm text-muted">Receba ofertas exclusivas por e-mail.</p>
              </div>
              <button 
                onClick={() => setToggleState(!toggleState)}
                className={`relative w-14 h-8 rounded-full transition-colors ${toggleState ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <motion.div 
                  layout 
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ left: toggleState ? 'calc(100% - 28px)' : '4px' }}
                />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO 5: Stepper Horizontal */}
      <section className="max-w-7xl mx-auto w-full px-4 py-12">
        <h2 className="text-xl font-bold text-muted mb-8 uppercase tracking-wider">5. Stepper (Status do Pedido)</h2>
        
        <div className="bg-surface p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            {['Carrinho', 'Endereço', 'Pagamento', 'Finalizado'].map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum <= step;
              
              return (
                <div key={label} className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center">
                    <motion.div 
                      animate={{ scale: isActive ? 1 : 0.8, backgroundColor: isActive ? '#ff4500' : '#e5e7eb' }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      {stepNum}
                    </motion.div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-secondary' : 'text-muted'}`}>{label}</span>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: stepNum < step ? '100%' : '0%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button onClick={() => setStep(Math.max(1, step - 1))} className="bg-gray-200 dark:bg-gray-700 text-secondary px-6 py-2 rounded-xl font-bold active:scale-95">Voltar</button>
            <button onClick={() => setStep(Math.min(4, step + 1))} className="bg-primary text-white px-6 py-2 rounded-xl font-bold active:scale-95">Avançar</button>
          </div>
        </div>
      </section>

      <Footer tenantName="UI Test" />
      <Toast />
    </div>
  );
}