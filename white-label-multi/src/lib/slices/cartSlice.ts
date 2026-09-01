import { StateCreator } from 'zustand';

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
  variant?: string;
}

export interface CartSlice {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  total: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set, get) => ({
  items: [],
  isCartOpen: false,
  
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) => set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
});