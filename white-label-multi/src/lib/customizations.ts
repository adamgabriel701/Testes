export interface CustomizationOption { id: string; label: string; price?: number; }
export interface CustomizationGroup { id: string; title: string; type: 'single' | 'multiple'; required: boolean; options: CustomizationOption[]; }

export const customizations: Record<string, CustomizationGroup[]> = {
  default: [{ id: 'cutlery', title: 'Deseja talheres?', type: 'single', required: false, options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] }],
  burger: [
    { id: 'meat_point', title: 'Ponto da carne', type: 'single', required: true, options: [{ id: 'medium', label: 'Ao ponto' }, { id: 'well', label: 'Bem passada' }] },
    { id: 'extras', title: 'Adicionais', type: 'multiple', required: false, options: [{ id: 'bacon', label: 'Bacon', price: 4 }, { id: 'cheddar', label: 'Cheddar', price: 3.5 }] }
  ],
  pizza: [{ id: 'crust', title: 'Borda', type: 'single', required: true, options: [{ id: 'traditional', label: 'Tradicional' }, { id: 'catupiry', label: 'Catupiry', price: 8 }] }]
};

export function getCustomizations(category: string): CustomizationGroup[] {
  if (category === 'burger') return customizations.burger;
  if (category === 'pizza') return customizations.pizza;
  return customizations.default;
}
