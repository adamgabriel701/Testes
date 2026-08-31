export interface CustomizationOption {
  id: string;
  label: string;
  price?: number; // Opcional (alguns não custam nada, ex: ponto da carne)
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: 'single' | 'multiple'; // Radio button ou Checkbox
  required: boolean;
  options: CustomizationOption[];
}

// Regras por categoria de produto
export const customizations: Record<string, CustomizationGroup[]> = {
  default: [
    {
      id: 'cutlery',
      title: 'Deseja talheres?',
      type: 'single',
      required: false,
      options: [
        { id: 'yes', label: 'Sim, por favor' },
        { id: 'no', label: 'Não precisa' },
      ]
    }
  ],
  burger: [
    {
      id: 'meat_point',
      title: 'Ponto da carne',
      type: 'single',
      required: true,
      options: [
        { id: 'medium', label: 'Ao ponto' },
        { id: 'rare', label: 'Mal passada' },
        { id: 'well', label: 'Bem passada' },
      ]
    },
    {
      id: 'extras',
      title: 'Adicionais',
      type: 'multiple',
      required: false,
      options: [
        { id: 'bacon', label: 'Bacon Crocante', price: 4.00 },
        { id: 'cheddar', label: 'Cheddar Extra', price: 3.50 },
        { id: 'egg', label: 'Ovo', price: 2.50 },
      ]
    }
  ],
  pizza: [
    {
      id: 'crust',
      title: 'Borda da Pizza',
      type: 'single',
      required: true,
      options: [
        { id: 'traditional', label: 'Tradicional' },
        { id: 'catupiry', label: 'Catupiry', price: 8.00 },
        { id: 'chocolate', label: 'Chocolate', price: 10.00 },
      ]
    }
  ]
};

// Função helper para pegar a categoria certa
export function getCustomizations(category: string): CustomizationGroup[] {
  if (category === 'burger' || category === 'Hambúrgueres') return customizations.burger;
  if (category === 'pizza' || category === 'Pizzas') return customizations.pizza;
  return customizations.default;
}
