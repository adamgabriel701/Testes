export type TenantType = 'food' | 'fashion' | 'pharmacy' | 'petshop'; // ADICIONADO petshop

export interface TenantConfig {
  slug: string;
  name: string;
  type: TenantType;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
  };
}

export const tenantsDB: TenantConfig[] = [
  {
    slug: 'hamburgueria',
    name: 'Hamburgueria Premium',
    type: 'food',
    theme: { primary: '#ff4500', secondary: '#1a1a1a', bg: '#f9fafb', surface: '#ffffff' }
  },
  {
    slug: 'pitzaria-do-rei',
    name: 'Pitzaria do Rei',
    type: 'food',
    theme: { primary: '#00875a', secondary: '#d9381e', bg: '#fff8f0', surface: '#ffffff' }
  },
  {
    slug: 'x-piu', // A NOVA LOJA
    name: 'X Piu Hamburgueria Artesanal',
    type: 'food',
    theme: { primary: '#facc15', secondary: '#1f2937', bg: '#f9fafb', surface: '#ffffff' } // Amarelo e Cinza Escuro
  },
  {
    slug: 'loja-urbana',
    name: 'Loja Urbana',
    type: 'fashion',
    theme: { primary: '#111111', secondary: '#ffffff', bg: '#fafafa', surface: '#ffffff' }
  },
  {
    slug: 'farmacia-saude',
    name: 'Farmácia Saúde 24h',
    type: 'pharmacy', // NOVO TIPO
    theme: { primary: '#0d9488', secondary: '#1f2937', bg: '#f0fdf4', surface: '#ffffff' } // Verde claro e Cinza escuro
  },
  {
    slug: 'petshop-patinhas',
    name: 'Petshop Patinhas',
    type: 'petshop', // NOVO TIPO
    theme: { primary: '#7c3aed', secondary: '#1f2937', bg: '#faf5ff', surface: '#ffffff' } // Roxo e Cinza Escuro
  },
];

export function getTenantConfig(slug: string): TenantConfig {
  const config = tenantsDB.find(t => t.slug === slug);
  // Fallback para hamburgueria se não achar
  return config || tenantsDB[0];
}
