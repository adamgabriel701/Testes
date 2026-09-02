export interface FloristProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
}

export const floristMenu: { category: string; icon: string; products: FloristProduct[] }[] = [
  {
    category: 'Buquês & Arranjos',
    icon: '💐',
    products: [
      {
        id: 'fl1', name: 'Buquê Mix de Rosas', price: 149.90, category: 'Buquês', tags: ['Mais Vendido'],
        description: 'Mistura harmoniosa de rosas vermelhas, brancas e rosas. Toque de folhagem fresca.',
        imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80'
      },
      {
        id: 'fl2', name: 'Caixa Presente com Flores', price: 199.00, category: 'Buquês', tags: ['Premium'],
        description: 'Elegante caixa de madeira decorada com flores nobres e chocolates artesanais.',
        imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&q=80'
      },
      {
        id: 'fl3', name: 'Cesto de Campo', price: 120.00, category: 'Buquês',
        description: 'Cesto rústico com flores do campo, perfeito para decorar ambientes aconchegantes.',
        imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80'
      }
    ]
  },
  {
    category: 'Datas Especiais',
    icon: '💖',
    products: [
      {
        id: 'fl4', name: 'Coração de Rosas Vermelhas', price: 250.00, category: 'Datas Especiais', tags: ['Para Ela'],
        description: 'Estrutura em formato de coração repleta de rosas vermelhas frescas. Para declarar seu amor.',
        imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&q=80'
      },
      {
        id: 'fl5', name: 'Tulipas Importadas (10 un)', price: 180.00, category: 'Datas Especiais',
        description: 'Buquê refinado de tulipas holandesas em tons vibrantes. Sofisticação garantida.',
        imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=80'
      }
    ]
  },
  {
    category: 'Plantas & Decoração',
    icon: '🪴',
    products: [
      {
        id: 'fl6', name: 'Planta Jade (Crassula)', price: 85.00, category: 'Plantas',
        description: 'Suculenta que atrai sorte e prosperidade. Vem em vaso de cerâmica decorado.',
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80'
      },
      {
        id: 'fl7', name: 'Orquídea Phalaenopsis Branca', price: 110.00, category: 'Plantas', tags: ['Elegante'],
        description: 'Clássica orquídea branca em vaso transparente. Beleza que dura meses.',
        imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80'
      }
    ]
  }
];
