import Product3DCarousel from '@/components/menu/Product3DCarousel';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductModal from '@/components/menu/ProductModal';
import FloatingCart from '@/components/cart/FloatingCart';
import ThemeToggle from '@/components/layout/ThemeToggle';
import OrderTracker from '@/components/cart/OrderTracker';
import BottomNav from '@/components/layout/BottomNav';
import HomeHero from '@/components/layout/HomeHero';
import StickyHeader from '@/components/layout/StickyHeader';
import MenuSection from '@/components/menu/MenuSection';
import Testimonials from '@/components/layout/Testimonials';
import GlobalSearch from '@/components/layout/GlobalSearch'; // NOVO
import CheckoutView from '@/components/cart/CheckoutView';
import { menuData } from '@/lib/products';

// Adicionando Combos direto na página para estender o menu
const extendedMenuData = [
  {
    category: 'Combos',
    icon: '🎁',
    products: [
      {
        id: 'combo1',
        name: 'Combo Casal (Burger + Pizza)',
        description: '1 X-Bacon + 1 Pizza Margherita + 2 Refrigerantes 350ml.',
        price: 69.90,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        tags: ['Econômico'],
        category: 'default'
      },
      {
        id: 'combo2',
        name: 'Combo Família',
        description: '2 Hambúrgueres + 1 Porção de Batata Cheddar + 2 Refris.',
        price: 79.90,
        imageUrl: 'https://images.unsplash.com/photo-1575443594216-b4a6f9c63f68?w=800&q=80',
        tags: ['Top'],
        category: 'default'
      }
    ]
  },
  ...menuData
];

export default async function Home({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenantName = resolvedParams.tenant.charAt(0).toUpperCase() + resolvedParams.tenant.slice(1);
  const tenantImage = "https://images.unsplash.com/photo-1552566626-52f8b828addf?w=1200&q=80";

  return (
    <main className="min-h-screen bg-background relative">
      <OrderTracker />
      <CheckoutView />
      <GlobalSearch /> {/* NOVO */}
      <StickyHeader tenantName={tenantName} menuData={extendedMenuData} />
      
      <div id="inicio" className="scroll-mt-0">
        <HomeHero tenantName={tenantName} tenantImage={tenantImage} />
      </div>

      {/* Seções do Cardápio */}
      <div id="cardapio" className="max-w-5xl mx-auto px-4 py-12 space-y-20 scroll-mt-20">
        {extendedMenuData.map((section) => (
          <MenuSection key={section.category} section={section} />
        ))}
      </div>

      {/* NOVO: Seção de Avaliações */}
      <Testimonials />

      {/* Componentes Globais */}
      <ProductModal />
      <CartDrawer />
      <FloatingCart />
      <BottomNav />
    </main>
  );
}