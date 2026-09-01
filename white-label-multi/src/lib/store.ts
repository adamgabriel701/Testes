import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createCartSlice, CartSlice } from './slices/cartSlice';
import { createUISlice, UISlice } from './slices/uiSlice';
import { createFoodSlice, FoodSlice } from './slices/foodSlice';
import { createFashionSlice, FashionSlice } from './slices/fashionSlice';

// O Store Raiz é a união de todos os Slices
export type RootStore = CartSlice & UISlice & FoodSlice & FashionSlice;

// Exportando os tipos para os componentes poderem usar
export type { CartItem, CartSelection } from './slices/cartSlice';
export type { FoodProduct } from './slices/foodSlice';
export type { FashionProduct } from './slices/fashionSlice';

export const useCart = create<RootStore>()(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createUISlice(...a),
      ...createFoodSlice(...a),
      ...createFashionSlice(...a),
    }),
    { name: 'multi-tenant-cart' }
  )
);