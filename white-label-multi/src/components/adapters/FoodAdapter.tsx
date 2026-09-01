'use client';

import Product3DCarousel from '@/components/food/Product3DCarousel';
import CartDrawer from '@/components/food/CartDrawer';
import ProductModal from '@/components/food/ProductModal';
import FloatingCart from '@/components/food/FloatingCart';
import OrderTracker from '@/components/food/OrderTracker';
import BottomNav from '@/components/food/BottomNav';
import HomeHero from '@/components/food/HomeHero';
import StickyHeader from '@/components/food/StickyHeader';
import MenuSection from '@/components/food/MenuSection';
import Testimonials from '@/components/food/Testimonials';
import GlobalSearch from '@/components/food/GlobalSearch';
import CheckoutView from '@/components/food/CheckoutView';
import ThemeToggle from '@/components/core/ThemeToggle';
import { menuData } from '@/lib/products';
import { pitzariaMenu } from '@/lib/products-pitzaria';
import { xpiuMenu } from '@/lib/products-xpiu';

// Funções auxiliares para identificar a loja
const isPitzaria = (tenantName: string) => tenantName === 'Pitzaria do Rei';
const isXPiu = (tenantName: string) => tenantName === 'X Piu Hamburgueria Artesanal';

// Lógica do Cardápio
const getMenuData = (tenantName: string) => {
  if (isPitzaria(tenantName)) return pitzariaMenu;
  if (isXPiu(tenantName)) return xpiuMenu;
  return menuData;
};

// Lógica da Imagem de Capa (Hero)
const getTenantImage = (tenantName: string) => {
  if (isPitzaria(tenantName)) return "https://images.unsplash.com/photo-1513104890138-7c749652e58c?w=1200&q=80";
  if (isXPiu(tenantName)) return "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80";
  return "https://images.unsplash.com/photo-1552566626-52f8b828addf?w=1200&q=80";
};

export default function FoodAdapter({ tenantName }: { tenantName: string }) {
  const activeMenu = getMenuData(tenantName);
  const tenantImage = getTenantImage(tenantName);

  return (
    <main className="min-h-screen bg-background relative">
      {/* Botão Flutuante de Tema */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <OrderTracker />
      <CheckoutView />
      <GlobalSearch />
      <StickyHeader tenantName={tenantName} menuData={activeMenu} />
      
      <div id="inicio" className="scroll-mt-0">
        {/* Removidas as props extras para bater com a tipagem do HomeHero */}
        <HomeHero 
          tenantName={tenantName} 
          tenantImage={tenantImage} 
        />
      </div>

      {/* Seções do Cardápio */}
      <div id="cardapio" className="max-w-5xl mx-auto px-4 py-12 space-y-20 scroll-mt-20">
        {activeMenu.map((section) => (
          <MenuSection key={section.category} section={section} />
        ))}
      </div>

      {/* Seção de Avaliações */}
      <Testimonials />

      {/* Componentes Globais */}
      <ProductModal />
      <CartDrawer />
      <FloatingCart />
      <BottomNav />
    </main>
  );
}