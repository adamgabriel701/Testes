import { StateCreator } from 'zustand';
import type { CartSlice } from './cartSlice'; // Importa o Cart para poder fechar o carrinho ao finalizar

export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl?: string;
  category?: string;
}

export interface DeliveryInfo {
  name: string;
  address: string;
  payment: string;
}

export interface FoodSlice {
  activeProduct: FoodProduct | null;
  orderStatus: 'cart' | 'checkout' | 'preparing' | 'delivering' | 'delivered';
  orderId: string | null;
  deliveryInfo: DeliveryInfo;
  
  openProductModal: (product: FoodProduct) => void;
  closeProductModal: () => void;
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  checkout: () => void;
  resetOrder: () => void;
}

// O StateCreator aqui avisa que o FoodSlice pode ler e alterar o CartSlice também
export const createFoodSlice: StateCreator<FoodSlice & CartSlice, [], [], FoodSlice> = (set) => ({
  activeProduct: null,
  orderStatus: 'cart',
  orderId: null,
  deliveryInfo: { name: '', address: '', payment: 'Cartão de Crédito' },
  
  openProductModal: (product) => set({ activeProduct: product }),
  closeProductModal: () => set({ activeProduct: null }),
  
  setDeliveryInfo: (info) => set((state) => ({ deliveryInfo: { ...state.deliveryInfo, ...info } })),
  
  checkout: () => {
    const orderNumber = '#' + Math.floor(Math.random() * 90000 + 1000);
    set({ orderStatus: 'preparing', orderId: orderNumber, isCartOpen: false });
    setTimeout(() => set({ orderStatus: 'delivering' }), 4000);
    setTimeout(() => set({ orderStatus: 'delivered' }), 8000);
  },
  
  resetOrder: () => set({ orderStatus: 'cart', orderId: null, items: [] }),
});