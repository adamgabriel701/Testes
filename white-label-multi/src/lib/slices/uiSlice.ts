import { StateCreator } from 'zustand';

export interface UISlice {
  theme: 'light' | 'dark';
  searchQuery: string;
  isSearchOpen: boolean;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  theme: 'light',
  searchQuery: '',
  isSearchOpen: false,
  
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openSearch: () => set({ isSearchOpen: true, searchQuery: '' }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
});