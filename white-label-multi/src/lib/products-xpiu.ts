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

export const xpiuMenu: MenuSection[] = [
  {
    category: 'Sanduíches',
    icon: '🍔',
    products: [
      { id: 'x1', name: 'Big Duo', price: 35.00, category: 'burger', tags: ['Top'], description: 'Pão de hambúrguer em 3 fatias, carne de picanha 125g ao molho artesanal, queijo muçarela, cebola, filé de frango, cheddar cremoso, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' },
      { id: 'x2', name: 'Big Frango', price: 35.00, category: 'burger', description: 'Pão 3 fatias, filé de frango ao molho artesanal, cheddar cremoso, muçarela, milho, alface, tomate e azeitona.', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80' },
      { id: 'x3', name: 'Mega Picanha', price: 35.00, category: 'burger', tags: ['Premium'], description: 'Pão, 2 hambúrgueres de picanha, muçarela, bacon, cheddar cremoso, cebola, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80' },
      { id: 'x4', name: 'X-Piu à Moda da Casa', price: 25.00, category: 'burger', tags: ['Mais Pedido'], description: 'Pão, ovo, filé bovino, muçarela, cheddar, alface, tomate e batata palha.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { id: 'x5', name: 'X-Picanha Bacon', price: 25.00, category: 'burger', description: 'Pão, hambúrguer de picanha, bacon, molho barbecue, muçarela e cebola.', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80' },
      { id: 'x6', name: 'X-Filé Bacon', price: 25.00, category: 'burger', description: 'Pão, filé bovino, bacon, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80' },
      { id: 'x7', name: 'X-Picanha', price: 20.00, category: 'burger', description: 'Pão, hambúrguer de picanha, molho barbecue, muçarela e cebola.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { id: 'x8', name: 'X-Filé', price: 20.00, category: 'burger', description: 'Pão, filé bovino, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80' },
      { id: 'x9', name: 'X-Frango', price: 20.00, category: 'burger', description: 'Pão, filé de frango, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80' },
      { id: 'x10', name: 'X-Tudo', price: 20.00, category: 'burger', description: 'Pão, carne, bacon, salsicha, calabresa, ovo, muçarela, presunto de peru, alface, tomate e batata palha.', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' },
      { id: 'x11', name: 'X-Bacon', price: 15.00, category: 'burger', description: 'Pão, carne, bacon, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80' },
      { id: 'x12', name: 'X-Salsicha', price: 15.00, category: 'burger', description: 'Pão, carne, salsicha, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1612392061784-6870a8f8af2a?w=800&q=80' },
      { id: 'x13', name: 'X-Calabresa Especial', price: 15.00, category: 'burger', description: 'Pão, carne, calabresa, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 'x14', name: 'X-Salada Especial', price: 15.00, category: 'burger', description: 'Pão, 2 carnes, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80' },
      { id: 'x15', name: 'X-Abacaxi', price: 15.00, category: 'burger', description: 'Pão, carne, abacaxi, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 'x16', name: 'X-Banana', price: 15.00, category: 'burger', description: 'Pão, carne, banana, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 'x17', name: 'X-Maionese', price: 12.00, category: 'burger', description: 'Pão, carne, ovo, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { id: 'x18', name: 'X-Salada Artesanal', price: 12.00, category: 'burger', description: 'Pão, carne artesanal, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80' },
      { id: 'x19', name: 'X-Salada Industrial', price: 12.00, category: 'burger', description: 'Pão, carne industrial, ovo, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
      { id: 'x20', name: 'X-Calabresa', price: 12.00, category: 'burger', description: 'Pão, calabresa, ovo, muçarela, presunto, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80' },
      { id: 'x21', name: 'Cheddar Burguer', price: 10.00, category: 'burger', description: 'Queijo cheddar cremoso, hamburguer e pão.', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' },
      { id: 'x22', name: 'X-Burguer', price: 10.00, category: 'burger', description: 'Pão, carne, muçarela, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1574484284002-954d03327907?w=800&q=80' },
      { id: 'x23', name: 'Hambúrguer', price: 10.00, category: 'burger', description: 'Pão, carne, muçarela, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3d3e2?w=800&q=80' },
      { id: 'x24', name: 'Americano', price: 8.00, category: 'burger', description: '3 fatias de pães de forma, muçarela, ovo, presunto de peru, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x25', name: 'X-Piu', price: 7.00, category: 'burger', description: 'Pão, muçarela, ovo, presunto de peru, alface, tomate e batata palha.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x26', name: 'X-Egg', price: 7.00, category: 'burger', description: 'Pão, muçarela, ovo, alface e tomate.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x27', name: 'Misto Duplo', price: 7.00, category: 'burger', description: '3 fatias de pães de forma, muçarela e presunto de peru.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x28', name: 'Queijo Duplo', price: 7.00, category: 'burger', description: '3 fatias de pães de forma e muçarela.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x29', name: 'Misto Simples', price: 5.00, category: 'burger', description: 'Pão de forma, muçarela e presunto de peru.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x30', name: 'Queijo Simples', price: 5.00, category: 'burger', description: 'Pão de forma e muçarela.', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
      { id: 'x31', name: 'Pão Amanteigado', price: 4.00, category: 'default', description: 'Pão amanteigado.', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80' }
    ]
  },
  {
    category: 'Peça Também',
    icon: '🍟',
    products: [
      { id: 'p1', name: 'Batata Frita Bacon & Cheddar', price: 25.00, category: 'default', tags: ['Top'], description: 'Batata frita com bacon e cheddar.', imageUrl: 'https://images.unsplash.com/photo-1639024471283-0350aef5b1f4?w=800&q=80' },
      { id: 'p2', name: 'Batata Frita Calabresa & Cheddar', price: 25.00, category: 'default', description: 'Batata frita com calabresa e cheddar.', imageUrl: 'https://images.unsplash.com/photo-1639024471283-0350aef5b1f4?w=800&q=80' },
      { id: 'p3', name: 'Batata Frita & Cheddar', price: 25.00, category: 'default', description: 'Batata frita com cheddar.', imageUrl: 'https://images.unsplash.com/photo-1639024471283-0350aef5b1f4?w=800&q=80' },
      { id: 'p4', name: 'Batata Frita & Bacon', price: 20.00, category: 'default', description: 'Batata frita com bacon.', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80' },
      { id: 'p5', name: 'Batata & Calabresa', price: 20.00, category: 'default', description: 'Batata frita com calabresa.', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80' },
      { id: 'p6', name: 'Batata Frita', price: 15.00, category: 'default', description: 'Batata frita comum.', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80' },
      { id: 'p7', name: 'Milk Shake Chocolate (400ml)', price: 15.00, category: 'default', description: 'Milk shake de chocolate 400ml.', imageUrl: 'https://images.unsplash.com/photo-1573888572739-2ace0c2e3e5f?w=800&q=80' },
      { id: 'p8', name: 'Milk Shake Morango (400ml)', price: 15.00, category: 'default', description: 'Milk shake de morango 400ml.', imageUrl: 'https://images.unsplash.com/photo-1573888572739-2ace0c2e3e5f?w=800&q=80' }
    ]
  },
  {
    category: 'Pratos',
    icon: '🍽️',
    products: [
      { id: 'pr1', name: 'Filé Bovino no Prato', price: 35.00, category: 'default', description: 'Filé Bovino, Batata frita e Salada Especial.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
      { id: 'pr2', name: 'Filé de Frango no Prato', price: 35.00, category: 'default', description: 'Filé de Frango, Batata frita e Salada Especial.', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' }
    ]
  },
  {
    category: 'Sucos',
    icon: '🥤',
    products: [
      { id: 's1', name: 'Suco de Abacaxi (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's2', name: 'Suco de Abacaxi (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's3', name: 'Suco de Acerola (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1613479227194-1b54b2e3b3a7?w=800&q=80' },
      { id: 's4', name: 'Suco de Acerola (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1613479227194-1b54b2e3b3a7?w=800&q=80' },
      { id: 's5', name: 'Suco de Cupuaçu (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's6', name: 'Suco de Cupuaçu (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's7', name: 'Suco de Goiaba (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's8', name: 'Suco de Goiaba (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's9', name: 'Suco de Graviola (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's10', name: 'Suco de Graviola (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's11', name: 'Suco de Laranja (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's12', name: 'Suco de Laranja (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's13', name: 'Suco de Limão (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's14', name: 'Suco de Limão (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's15', name: 'Suco de Mamão & Laranja (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's16', name: 'Suco de Mamão & Laranja (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's17', name: 'Suco de Morango (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's18', name: 'Suco de Morango (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's19', name: 'Suco de Taperebá (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's20', name: 'Suco de Taperebá (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's21', name: 'Suco de Tangerina (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's22', name: 'Suco de Tangerina (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's23', name: 'Suco Turbinado (300ml)', price: 10.00, category: 'default', description: 'Suco natural 300ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' },
      { id: 's24', name: 'Suco Turbinado (500ml)', price: 15.00, category: 'default', description: 'Suco natural 500ml.', imageUrl: 'https://images.unsplash.com/photo-1600271886074-6284b3de3b0f?w=800&q=80' }
    ]
  },
  {
    category: 'Vitaminas',
    icon: '🥛',
    products: [
      { id: 'v1', name: 'Vitamina de Abacate (500ml)', price: 15.00, category: 'default', description: 'Vitamina 500ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v2', name: 'Vitamina de Abacate (300ml)', price: 13.00, category: 'default', description: 'Vitamina 300ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v3', name: 'Vitamina de Banana (500ml)', price: 15.00, category: 'default', description: 'Vitamina 500ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v4', name: 'Vitamina de Banana (300ml)', price: 10.00, category: 'default', description: 'Vitamina 300ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v5', name: 'Vitamina de Mamão (500ml)', price: 15.00, category: 'default', description: 'Vitamina 500ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v6', name: 'Vitamina de Mamão (300ml)', price: 10.00, category: 'default', description: 'Vitamina 300ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v7', name: 'Vitamina de Morango (500ml)', price: 15.00, category: 'default', description: 'Vitamina 500ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v8', name: 'Vitamina de Morango (300ml)', price: 10.00, category: 'default', description: 'Vitamina 300ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v9', name: 'Vitamina Mista (500ml)', price: 15.00, category: 'default', description: 'Abacate, banana & mamão.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v10', name: 'Vitamina Mista (300ml)', price: 10.00, category: 'default', description: 'Abacate, banana & mamão.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v11', name: 'Vitamina Mista & Cereal (500ml)', price: 15.00, category: 'default', description: 'Abacate, banana, mamão, granola & amendoim.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v12', name: 'Vitamina Mista & Cereal (300ml)', price: 10.00, category: 'default', description: 'Abacate, banana, mamão, granola & amendoim.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v13', name: 'Vitamina Mista & Morango (500ml)', price: 20.00, category: 'default', description: 'Vitamina mista com morango 500ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' },
      { id: 'v14', name: 'Vitamina Mista & Morango (300ml)', price: 15.00, category: 'default', description: 'Vitamina mista com morango 300ml.', imageUrl: 'https://images.unsplash.com/photo-1505252585461-1c901e2059cd?w=800&q=80' }
    ]
  },
  {
    category: 'Bebidas',
    icon: '🧃',
    products: [
      { id: 'b1', name: 'Coca-Cola (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'b2', name: 'Coca-Cola Zero Açúcar (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'b3', name: 'Guaraná Antártica (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b4', name: 'Baré (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b5', name: 'Fanta Laranja (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b6', name: 'Fanta Uva (2 Litros)', price: 20.00, category: 'default', description: 'Refrigerante 2L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b7', name: 'Coca-Cola (1 Litro)', price: 13.00, category: 'default', description: 'Refrigerante 1L.', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a4ef4?w=800&q=80' },
      { id: 'b8', name: 'Baré (1 Litro)', price: 13.00, category: 'default', description: 'Refrigerante 1L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b9', name: 'Guaraná Antártica (1 Litro)', price: 13.00, category: 'default', description: 'Refrigerante 1L.', imageUrl: 'https://images.unsplash.com/photo-1625772299840-731f9de35b8b?w=800&q=80' },
      { id: 'b10', name: 'Coca-Cola Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'b11', name: 'Coca-Cola Zero Açúcar Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'b12', name: 'Guaraná Antártica Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'b13', name: 'Baré Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'b14', name: 'Fanta Laranja Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' },
      { id: 'b15', name: 'Fanta Uva Lata', price: 8.00, category: 'default', description: 'Refrigerante Lata 350ml.', imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80' }
    ]
  },
  {
    category: 'Sobremesas',
    icon: '🍫',
    products: [
      { id: 'so1', name: 'Brownie', price: 5.00, category: 'default', description: 'Brownie de chocolate.', imageUrl: 'https://images.unsplash.com/photo-1548366079-438c1e7bcd0c?w=800&q=80' },
      { id: 'so2', name: 'Brigadeiro', price: 1.00, category: 'default', description: 'Brigadeiro.', imageUrl: 'https://images.unsplash.com/photo-1548366079-438c1e7bcd0c?w=800&q=80' },
      { id: 'so3', name: 'Beijinho', price: 1.00, category: 'default', description: 'Beijinho.', imageUrl: 'https://images.unsplash.com/photo-1548366079-438c1e7bcd0c?w=800&q=80' },
      { id: 'so4', name: 'Moranguinho', price: 1.00, category: 'default', description: 'Moranguinho.', imageUrl: 'https://images.unsplash.com/photo-1548366079-438c1e7bcd0c?w=800&q=80' }
    ]
  }
];