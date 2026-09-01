export interface FashionProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
}

export const fashionData: FashionProduct[] = [
  {
    id: 'f1', name: 'Camiseta Oversized Básica', price: 89.90, category: 'Camisetas', tags: ['Novo'],
    description: 'Camiseta com modelagem oversized, 100% algodão. Caimento perfeito para um visual streetwear.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
  },
  {
    id: 'f2', name: 'Camiseta Premium Lisa', price: 79.90, category: 'Camisetas',
    description: 'Tecido nobre, toque sedoso e modelagem clássica. Disponível em diversas cores.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
  },
  {
    id: 'f3', name: 'Calça Cargo Streetwear', price: 229.90, category: 'Calças', tags: ['Top'],
    description: 'Calça cargo com tecido resistente, múltiplos bolsos e fita de ajuste no tornozelo.',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97f755?w=800&q=80'
  },
  {
    id: 'f4', name: 'Calça Jeans Reta', price: 199.90, category: 'Calças',
    description: 'Jeans de modelagem reta clássica. Lavagem escura e tecido com elasticidade.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'
  },
  {
    id: 'f5', name: 'Boné Aba Reta', price: 59.90, category: 'Acessórios',
    description: 'Boné com aba reta, ajuste plástico e bordamento 3D na frente.',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed9c28ab722f?w=800&q=80'
  },
  {
    id: 'f6', name: 'Mochila Urban Tatic', price: 179.90, category: 'Acessórios', tags: ['Promoção'],
    description: 'Mochila resistente à água, com compartimento para notebook e port USB externo.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
  },
  {
    id: 'f7', name: 'Jaqueta Bomber Jeans', price: 289.90, category: 'Jaquetas', tags: ['Novo'],
    description: 'Jaqueta bomber com mistura de jeans e moletom. Estilo moderno para dias frios.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
  },
  {
    id: 'f8', name: 'Moletom Premium Canguru', price: 159.90, category: 'Moletom',
    description: 'Moletom com tecido grosgramado interno, capuz ajustável e bolso canguru.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'
  }
];
