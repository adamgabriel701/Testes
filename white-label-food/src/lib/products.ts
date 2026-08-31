export interface CarouselProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl?: string; 
  tags?: string[];
  category?: string; // Nova propriedade para regras de customização
}

export interface MenuSection {
  category: string;
  icon: string;
  products: CarouselProduct[];
}

export const menuData: MenuSection[] = [
  {
    category: 'Hambúrgueres',
    icon: '🍔',
    products: [
      {
        id: '1',
        name: 'X-Burger Clássico',
        description: 'Pão brioche, hambúrguer 160g artesanal, queijo cheddar derretido, alface e tomate.',
        price: 25.90,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        tags: ['Mais Pedido'],
        category: 'burger'
      },
      {
        id: '2',
        name: 'X-Bacon Supremo',
        description: 'Pão australiano, hambúrguer 180g, bacon crocante, cheddar, cebola caramelizada e maionese verde.',
        price: 32.50,
        imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80',
        modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        tags: ['Premium'],
        category: 'burger'
      },
      {
        id: '3',
        name: 'X-Vegano',
        description: 'Pão integral, hambúrguer de grão de bico, queijo vegano, rúcula, tomate seco e pasta de abacate.',
        price: 28.00,
        imageUrl: 'https://images.unsplash.com/photo-1525059696034-4957a8e1e56f?w=800&q=80',
        category: 'burger'
      }
    ]
  },
  {
    category: 'Pizzas',
    icon: '🍕',
    products: [
      {
        id: '4',
        name: 'Pizza Margherita',
        description: 'Massa fina, molho de tomate pelati, mozzarella de búfala, manjericão fresco e azeite extra virgem.',
        price: 42.50,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5e993c9db?w=800&q=80', // URL TROCADA
        category: 'pizza'
      },
      {
        id: '5',
        name: 'Pizza Pepperoni',
        description: 'Massa artesanal, molho de tomate, muçarela generosa e fatias de pepperoni importado.',
        price: 48.00,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749652e58c?w=800&q=80', // URL TROCADA
        tags: ['Top'],
        category: 'pizza'
      },
    ]
  },
  {
    category: 'Mistos',
    icon: '🥪',
    products: [
      {
        id: '6',
        name: 'Misto Quente Especial',
        description: 'Pão de forma na chapa, presunto, queijo prato, tomate e orégano. Acompanha batata frita.',
        price: 18.00,
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
        category: 'default'
      },
      {
        id: '7',
        name: 'Sanduíche de Frango Defumado',
        description: 'Pão ciabatta, peito de frango defumado, queijo brie, alface americana e maionese de ervas.',
        price: 22.50,
        imageUrl: 'https://images.unsplash.com/photo-1539252554453-5ab308b77d14?w=800&q=80',
        tags: ['Novo'],
        category: 'default'
      }
    ]
  },
  {
    category: 'Cachorros-Quentes',
    icon: '🌭',
    products: [
      {
        id: '8',
        name: 'Dog Tradicional',
        description: 'Pão macio, salsicha de carne bovina, molho da casa, milho, ervilha e batata palha.',
        price: 15.00,
        imageUrl: 'https://images.unsplash.com/photo-1612392061784-6870a8f8af2a?w=800&q=80', // URL TROCADA
        category: 'default'
      },
      {
        id: '9',
        name: 'Dog Bacon & Cheddar',
        description: 'Pão brioche, salsicha premium, bacon crocante, cheddar cremoso e cebola crispy.',
        price: 20.00,
        imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e96c12c1358?w=800&q=80', // URL TROCADA
        tags: ['Mais Pedido'],
        category: 'default'
      },
    ]
  },
  {
    category: 'Porções',
    icon: '🍟',
    products: [
      {
        id: '10',
        name: 'Batata Frita Clássica',
        description: 'Porção generosa de batatas fritas crocantes com sal marinho. Acompanha maionese.',
        price: 16.00,
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
        category: 'default'
      },
      {
        id: '11',
        name: 'Batata Cheddar & Bacon',
        description: 'Batatas fritas cobertas com cheddar derretido cremoso e bacon em cubos crocante.',
        price: 24.00,
        imageUrl: 'https://images.unsplash.com/photo-1639024471283-0350aef5b1f4?w=800&q=80',
        tags: ['Top'],
        category: 'default'
      }
    ]
  },
  {
    category: 'Sobremesas',
    icon: '🍨',
    products: [
      {
        id: '12',
        name: 'Milkshake Ovomaltine',
        description: 'Cremoso milkshake de baunilha com pedaços crocantes de ovomaltine 500ml.',
        price: 22.00,
        imageUrl: 'https://images.unsplash.com/photo-1626078436208-8fa5b9545d5a?w=800&q=80', // URL TROCADA
        tags: ['Novidade'],
        category: 'default'
      }
    ]
  }
];