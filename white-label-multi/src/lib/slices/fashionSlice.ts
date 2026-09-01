import { StateCreator } from 'zustand';

export interface FashionProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
}

export interface FashionSlice {
  activeFashion: FashionProduct | null;
  selectedSize: string;
  openFashionModal: (product: FashionProduct) => void;
  closeFashionModal: () => void;
  setSelectedSize: (size: string) => void;
}

export const createFashionSlice: StateCreator<FashionSlice, [], [], FashionSlice> = (set) => ({
  activeFashion: null,
  selectedSize: '',
  
  openFashionModal: (product) => set({ activeFashion: product, selectedSize: '' }),
  closeFashionModal: () => set({ activeFashion: null }),
  setSelectedSize: (size) => set({ selectedSize: size }),
});