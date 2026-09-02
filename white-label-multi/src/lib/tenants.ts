export type TenantType = 'food' | 'fashion' | 'pharmacy' | 'petshop' | 'florist'; // ADICIONADO florist

export interface TenantConfig {
  slug: string;
  name: string;
  type: TenantType;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
    muted?: string; // ADICIONADO AQUI
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
    slug: 'x-piu',
    name: 'X Piu Hamburgueria Artesanal',
    type: 'food',
    theme: { primary: '#facc15', secondary: '#1f2937', bg: '#f9fafb', surface: '#ffffff' }
  },
  {
    slug: 'loja-urbana',
    name: 'Loja Urbana',
    type: 'fashion',
    theme: { primary: '#111111', secondary: '#111111', bg: '#ffffff', surface: '#ffffff', muted: '#6b7280' }
  },
  {
    slug: 'farmacia-saude',
    name: 'Farmácia Saúde 24h',
    type: 'pharmacy',
    theme: { primary: '#0d9488', secondary: '#1f2937', bg: '#f0fdf4', surface: '#ffffff' }
  },
  {
    slug: 'petshop-patinhas',
    name: 'Petshop Patinhas',
    type: 'petshop',
    theme: { primary: '#7c3aed', secondary: '#1f2937', bg: '#faf5ff', surface: '#ffffff' }
  },
  {
    slug: 'floricultura-jardim',
    name: 'Floricultura Jardim',
    type: 'florist', // NOVO TIPO
    theme: { primary: '#db2777', secondary: '#1f2937', bg: '#fdf2f8', surface: '#ffffff' } // Rosa Choque e Cinza Escuro
  },
];

export function getTenantConfig(slug: string): TenantConfig {
  const config = tenantsDB.find(t => t.slug === slug);
  return config || tenantsDB[0];
}