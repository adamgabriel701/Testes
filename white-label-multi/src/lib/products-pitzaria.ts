export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl?: string; 
  tags?: string[];
  category?: string;
}

export interface MenuSection {
  category: string;
  icon: string;
  products: Product[];
}

export const pitzariaMenu: MenuSection[] = [
  {
    category: 'Pitzas do Rei',
    icon: '🍕',
    products: [
      { id: 'p1', name: 'Pitza Média', price: 42.00, category: 'pizza', tags: ['Mais Pedido'], description: 'Escolha entre diversos sabores.', imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5e993c9db?w=800&q=80' },
      { id: 'p2', name: 'Pitza Grande', price: 48.00, category: 'pizza', description: 'Escolha entre diversos sabores.', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749652e58c?w=800&q=80' },
      { id: 'p3', name: 'Pitza Família', price: 53.00, category: 'pizza', description: 'Escolha entre diversos sabores.', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80b002?w=800&q=80' },
      { id: 'p4', name: 'Pitza Big Família', price: 100.00, category: 'pizza', tags: ['Top'], description: 'Escolha entre diversos sabores. A maior pizza da casa!', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' }
    ]
  },
  {
    category: 'Sanduíches do Rei',
    icon: '🍔',
    products: [
      { id: 's1', name: 'Kikão', price: 7.00, category: 'burger', description: 'Pão massa fina, salsicha, queijo, batata palha, maionese e catchup.', imageUrl: 'https://images.unsplash.com/photo-1612392061784-6870a8f8af2a?w=800&q=80' },
      { id: 's2', name: 'Misto Simples', price: 5.00, category: 'burger', description: 'Pão de forma, queijo e presunto.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 's3', name: 'Misto Duplo', price: 8.00, category: 'burger', description: 'Pão de forma, queijo e presunto em dobro.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 's4', name: 'X-Burguer', price: 8.00, category: 'burger', description: 'Pão, carne friboi, queijo, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { id: 's5', name: 'X-Salada', price: 12.00, category: 'burger', description: 'Pão, carne friboi, ovo, queijo, presunto, alface, tomate, pepino.', imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80' },
      { id: 's6', name: 'X-Salada Carne Artesanal', price: 15.00, category: 'burger', description: 'Pão, carne caseira, ovo, queijo, presunto, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80' },
      { id: 's7', name: 'X-Banana', price: 17.00, category: 'burger', description: 'Pão, carne caseira, ovo, queijo, presunto, banana, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 's8', name: 'X-Salsicha', price: 15.00, category: 'burger', description: 'Pão, carne caseira, ovo, queijo, presunto, alface, tomate e salsicha.', imageUrl: 'https://images.unsplash.com/photo-1612392061784-6870a8f8af2a?w=800&q=80' },
      { id: 's9', name: 'X-Bacon', price: 17.00, category: 'burger', tags: ['Premium'], description: 'Pão, carne caseira, ovo, queijo, presunto, alface, tomate e bacon.', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80' },
      { id: 's10', name: 'X-Calabresa', price: 17.00, category: 'burger', description: 'Pão, carne caseira, ovo, queijo, presunto, alface, tomate e calabresa.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 's11', name: 'X-Frango', price: 17.00, category: 'burger', description: 'Pão, creme de frango, ovo, queijo, presunto, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80' },
      { id: 's12', name: 'X-Filé', price: 25.00, category: 'burger', description: 'Pão, filé de carne, molho barbecue, queijo, cebola e alface.', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80' },
      { id: 's13', name: 'X-Rei', price: 25.00, category: 'burger', tags: ['Especial'], description: 'Pão, duas carnes caseiras, dois ovos, duas fatias de queijo e presunto, alface, tomate, pepino, calabresa, bacon, banana.', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' },
      { id: 's14', name: 'Big X-Rei', price: 50.00, category: 'burger', tags: ['Top'], description: 'Pão, quatro carnes caseiras, quatro ovos, quatro fatias de queijo e presunto, bacon, calabresa, salsicha, banana, molho barbecue, alface, tomate e pepino.', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80' },
      { id: 's15', name: 'Supremo', price: 20.00, category: 'burger', description: 'Pão de hamburguer, carne seca, tomate, alface, cebola, maionese, catchup, molho barbecue, batata palha.', imageUrl: 'https://images.unsplash.com/photo-1574484284002-954d03327907?w=800&q=80' }
    ]
  },
  {
    category: 'Churrasco do Rei',
    icon: '🍖',
    products: [
      { id: 'c1', name: 'Speto de Alcatra', price: 25.00, category: 'default', description: 'Arroz/Baião, farofa, salada.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
      { id: 'c2', name: 'Speto de Calabresa', price: 20.00, category: 'default', description: 'Arroz/Baião, farofa, salada e batata frita.', imageUrl: 'https://images.unsplash.com/photo-1607101308014-6e5e6c0c6c5d?w=800&q=80' },
      { id: 'c3', name: 'Speto Misto', price: 30.00, category: 'default', description: 'Arroz/Baião, farofa, salada e batata frita.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
      { id: 'c4', name: 'Speto de Picanha', price: 40.00, category: 'default', tags: ['Premium'], description: 'Arroz/Baião, farofa, salada.', imageUrl: 'https://images.unsplash.com/photo-1592811912330-4ab8b0e9e9d1?w=800&q=80' },
      { id: 'c5', name: 'Chapa Mista', price: 80.00, category: 'default', tags: ['Para 2'], description: 'Alcatra, Calabresa e Filé de Frango.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }
    ]
  },
  {
    category: 'Porções do Rei',
    icon: '🍲',
    products: [
      { id: 'po1', name: 'Lasanha', price: 25.00, category: 'default', description: 'Arroz e farofa.', imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b280e93689?w=800&q=80' },
      { id: 'po2', name: 'Filé na Chapa', price: 40.00, category: 'default', description: 'Filé, arroz, farofa, cebola, tomate e alface.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }
    ]
  },
  {
    category: 'Batatas',
    icon: '🍟',
    products: [
      { id: 'b1', name: 'Batata Frita', price: 25.00, category: 'default', description: 'Batata frita comum.', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80' },
      { id: 'b2', name: 'Batata Frita Especial', price: 35.00, category: 'default', tags: ['Top'], description: 'Batata frita, calabresa e bacon.', imageUrl: 'https://images.unsplash.com/photo-1639024471283-0350aef5b1f4?w=800&q=80' }
    ]
  },
  {
    category: 'Refrigerantes',
    icon: '🥤',
    products: [
      { id: 'r1', name: 'Coca-cola lata', price: 7.00, category: 'default', description: 'Refrigerante de lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'r2', name: 'Coca-cola zero lata', price: 7.00, category: 'default', description: 'Refrigerante de lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'r3', name: 'Fanta laranja lata', price: 7.00, category: 'default', description: 'Refrigerante de lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r4', name: 'Guaraná antarctica lata', price: 7.00, category: 'default', description: 'Refrigerante de lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r5', name: 'Pepsi Lata', price: 7.00, category: 'default', description: 'Refrigerante de lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'r6', name: 'Coca-cola 1L', price: 12.00, category: 'default', description: 'Refrigerante de 1L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'r7', name: 'Coca-Cola Zero 1L', price: 12.00, category: 'default', description: 'Refrigerante de 1L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'r8', name: 'Fanta Laranja 1L', price: 12.00, category: 'default', description: 'Refrigerante de 1L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r9', name: 'Tuchaua 1L', price: 8.00, category: 'default', description: 'Refrigerante de 1L.', imageUrl: 'https://images.unsplash.com/photo-1610957665285-3b55b91c7b09?w=800&q=80' },
      { id: 'r10', name: 'Coca-cola 2L', price: 17.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'r11', name: 'Coca-cola zero 2L', price: 17.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'r12', name: 'Fanta Laranja 2L', price: 17.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r13', name: 'Guaraná antarctica 2L', price: 15.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r14', name: 'Baré 2L', price: 12.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'r15', name: 'Tuchaua 2L', price: 10.00, category: 'default', description: 'Refrigerante de 2L.', imageUrl: 'https://images.unsplash.com/photo-1610957665285-3b55b91c7b09?w=800&q=80' },
      { id: 'r16', name: 'Coca cola 2,5 L', price: 20.00, category: 'default', description: 'Refrigerante de 2,5L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' }
    ]
  },
  {
    category: 'Sucos',
    icon: '🧃',
    products: [
      { id: 'su1', name: 'Taperebá copo 500ml', price: 10.00, category: 'default', description: 'Suco de 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 'su2', name: 'Acerola copo 500ml', price: 10.00, category: 'default', description: 'Copo de 500ml.', imageUrl: 'https://images.unsplash.com/photo-1613479227194-1b54b2e3b3a7?w=800&q=80' },
      { id: 'su3', name: 'Taperebá 1L', price: 20.00, category: 'default', description: 'Suco de 1L.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 'su4', name: 'Acerola 1L', price: 20.00, category: 'default', description: 'Suco de 1L.', imageUrl: 'https://images.unsplash.com/photo-1613479227194-1b54b2e3b3a7?w=800&q=80' },
      { id: 'su5', name: 'Taperebá 2L', price: 40.00, category: 'default', description: 'Suco de 2L.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 'su6', name: 'Acerola 2L', price: 40.00, category: 'default', description: 'Suco de 2L.', imageUrl: 'https://images.unsplash.com/photo-1613479227194-1b54b2e3b3a7?w=800&q=80' }
    ]
  },
  {
    category: 'Cerveja Long Neck',
    icon: '🍺',
    products: [
      { id: 'ce1', name: 'Antartica Original', price: 10.00, category: 'default', description: 'Cerveja Long Neck.', imageUrl: 'https://images.unsplash.com/photo-1608270586620-7331723837fc?w=800&q=80' },
      { id: 'ce2', name: 'Coronita', price: 11.00, category: 'default', description: 'Cerveja Long Neck.', imageUrl: 'https://images.unsplash.com/photo-1608270586620-7331723837fc?w=800&q=80' },
      { id: 'ce3', name: 'Heineken', price: 12.00, category: 'default', description: 'Cerveja Long Neck.', imageUrl: 'https://images.unsplash.com/photo-1608270586620-7331723837fc?w=800&q=80' }
    ]
  },
  {
    category: 'Água e Bomboniere',
    icon: '🍫',
    products: [
      { id: 'a1', name: 'Água 500 ml', price: 3.50, category: 'default', description: 'Água de 500 ml.', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80' },
      { id: 'bb1', name: 'Ouro branco', price: 3.00, category: 'default', description: 'Bombons de chocolate.', imageUrl: 'https://images.unsplash.com/photo-1548366091-15c4b06c3fd0?w=800&q=80' },
      { id: 'bb2', name: 'Pirulito', price: 2.00, category: 'default', description: 'Pirulito.', imageUrl: 'https://images.unsplash.com/photo-1548366091-15c4b06c3fd0?w=800&q=80' },
      { id: 'bb3', name: 'Bombons de menta', price: 1.00, category: 'default', description: 'Bombons de menta 3 por 1.', imageUrl: 'https://images.unsplash.com/photo-1548366091-15c4b06c3fd0?w=800&q=80' }
    ]
  }
];