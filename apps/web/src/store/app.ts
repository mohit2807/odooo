import { create } from 'zustand';

interface AppState {
  currentPage: string;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'feed',
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'created_at_desc',
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
