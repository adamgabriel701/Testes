export interface PharmaProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
  requiresPrescription?: boolean;
}

export const pharmaMenu: { category: string; icon: string; products: PharmaProduct[] }[] = [
  {
    category: 'Analgésicos e Antitérmicos',
    icon: '💊',
    products: [
      {
        id: 'm1', name: 'Paracetamol 750mg (20 Comps)', price: 12.50, category: 'Analgésicos',
        description: 'Para alívio de dores leves e febre. Sem necessidade de receita.',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f5ae?w=800&q=80'
      },
      {
        id: 'm2', name: 'Ibuprofeno 400mg (10 Comps)', price: 18.90, category: 'Analgésicos', tags: ['Mais Vendido'],
        description: 'Ação anti-inflamatória. Alívio de dores de cabeça e muscular.',
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b96148?w=800&q=80'
      },
      {
        id: 'm3', name: 'Dipirona 500mg (20 Comps)', price: 15.00, category: 'Analgésicos',
        description: 'Antitérmico e analgésico de ação rápida.',
        imageUrl: 'https://images.unsplash.com/photo-1631549916768-4d9d33ef4f6d?w=800&q=80'
      }
    ]
  },
  {
    category: 'Vitaminas e Suplementos',
    icon: '🧪',
    products: [
      {
        id: 'v1', name: 'Vitamina C 1g (10 Comps Efervescentes)', price: 25.00, category: 'Vitaminas', tags: ['Trending'],
        description: 'Reforço para imunidade. Sabor laranja.',
        imageUrl: 'https://images.unsplash.com/photo-1626202373052-9d3b91e9d1a7?w=800&q=80'
      },
      {
        id: 'v2', name: 'Complexo B (30 Cápsulas)', price: 35.00, category: 'Vitaminas',
        description: 'Suplemento vitamínico para energia e metabolismo.',
        imageUrl: 'https://images.unsplash.com/photo-1607619056570-6c5c0a52d2d7?w=800&q=80'
      }
    ]
  },
  {
    category: 'Antialérgicos',
    icon: '🤧',
    products: [
      {
        id: 'a1', name: 'Loratadina 10mg (10 Comps)', price: 22.00, category: 'Antialérgicos',
        description: 'Alívio de rinite e alergias sazonais. Não causa sono.',
        imageUrl: 'https://images.unsplash.com/photo-1559757175-0f6c9b9c4c4d?w=800&q=80'
      }
    ]
  },
  {
    category: 'Primeiros Socorros',
    icon: '🩹',
    products: [
      {
        id: 'p1', name: 'Curativo Adesivo (50 Unidades)', price: 19.90, category: 'Primeiros Socorros',
        description: 'Curativos estéreis de tamanhos variados.',
        imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446b62?w=800&q=80'
      },
      {
        id: 'p2', name: 'Soro Fisiológico 500ml', price: 14.00, category: 'Primeiros Socorros',
        description: 'Solução salina 0,9% para limpeza de feridas e olhos.',
        imageUrl: 'https://images.unsplash.com/photo-1632468352515-6b4a4b9b9b9b?w=800&q=80'
      }
    ]
  }
];
