export interface PetProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
}

export const petshopMenu: { category: string; icon: string; products: PetProduct[] }[] = [
  {
    category: 'Rações Premium',
    icon: '🦴',
    products: [
      {
        id: 'pet1', name: 'Ração Golden 15kg (Cães Adultos)', price: 189.90, category: 'Rações', tags: ['Mais Vendido'],
        description: 'Alimento completo e balanceado para cães adultos de porte médio. Sabor carne.',
        imageUrl: 'https://images.unsplash.com/photo-1568640347808-6e3f2d1f7c4d?w=800&q=80'
      },
      {
        id: 'pet2', name: 'Ração Whiskas 10kg (Gatos Castrados)', price: 145.00, category: 'Rações',
        description: 'Desenvolvida para gatos castrados, ajudando a controlar o peso e a saúde urinária.',
        imageUrl: 'https://images.unsplash.com/photo-1583511655802-4c0d2f3f1d00?w=800&q=80'
      }
    ]
  },
  {
    category: 'Peticos e Brinquedos',
    icon: '🎾',
    products: [
      {
        id: 'pet3', name: 'Bolinha de Borracha Resistente', price: 29.90, category: 'Brinquedos',
        description: 'Brinquedo ideal para cães que gostam de morder. Material não tóxico e super resistente.',
        imageUrl: 'https://images.unsplash.com/photo-1601758174039-1ee76f0d5f5d?w=800&q=80'
      },
      {
        id: 'pet4', name: 'Arranhador Gato com Torre', price: 89.90, category: 'Brinquedos', tags: ['Novo'],
        description: 'Torre de arranhão com cobertura em sisal e bolinha pendurada. Preserva seus móveis!',
        imageUrl: 'https://images.unsplash.com/photo-1574145183431-062e7553e5e9?w=800&q=80'
      }
    ]
  },
  {
    category: 'Higiene e Cuidados',
    icon: '🧴',
    products: [
      {
        id: 'pet5', name: 'Shampoo Peludo & Cheiroso 500ml', price: 34.50, category: 'Higiene',
        description: 'Shampoo hidratante para pelos longos. Deixa o pelo macio e perfumado por dias.',
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7de3?w=800&q=80'
      },
      {
        id: 'pet6', name: 'Areia Higiênica Premium 4kg', price: 25.00, category: 'Higiene',
        description: 'Areia sanitária para gatos com agregados antimicrobianos e controle de odor.',
        imageUrl: 'https://images.unsplash.com/photo-1596815312477-9b2b26b6d3f2?w=800&q=80'
      }
    ]
  }
];
