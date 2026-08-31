import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartSelection {
  groupId: string;
  optionId: string;
  label: string;
  price?: number;
}

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  image?: string;
  selections?: CartSelection[];
  notes?: string;
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl?: string;
  category?: string;
}

type AppTheme = 'light' | 'dark';
type OrderStatus = 'cart' | 'checkout' | 'preparing' | 'delivering' | 'delivered';

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  activeProduct: ProductData | null;
  theme: AppTheme;
  searchQuery: string;
  isSearchOpen: boolean;
  orderStatus: OrderStatus;
  orderId: string | null;
  deliveryInfo: { name: string; address: string; payment: string };
  
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  total: () => number;
  
  openCart: () => void;
  closeCart: () => void;
  openProductModal: (product: ProductData) => void;
  closeProductModal: () => void;
  
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  
  setDeliveryInfo: (info: Partial<CartStore['deliveryInfo']>) => void;
  checkout: () => void;
  resetOrder: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      activeProduct: null,
      theme: 'light',
      searchQuery: '',
      isSearchOpen: false,
      orderStatus: 'cart',
      orderId: null,
      deliveryInfo: { name: '', address: '', payment: 'Cartão de Crédito' },
      
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (index) => set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openProductModal: (product) => set({ activeProduct: product }),
      closeProductModal: () => set({ activeProduct: null }),
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      openSearch: () => set({ isSearchOpen: true, searchQuery: '' }),
      closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
      
      setDeliveryInfo: (info) => set((state) => ({ deliveryInfo: { ...state.deliveryInfo, ...info } })),
      
      checkout: () => {
        const orderNumber = '#' + Math.floor(Math.random() * 90000 + 1000);
        set({ orderStatus: 'preparing', orderId: orderNumber, isCartOpen: false });
        setTimeout(() => set({ orderStatus: 'delivering' }), 4000);
        setTimeout(() => set({ orderStatus: 'delivered' }), 8000);
      },
      
      resetOrder: () => set({ orderStatus: 'cart', orderId: null, items: [] }),
    }),
    { name: 'food-cart-storage' }
  )
);