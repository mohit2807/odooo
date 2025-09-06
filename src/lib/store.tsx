import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Product, CartItem, Profile } from '../utils/supabase/client';

// Auth store
interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Cart store
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find(i => i.product_id === item.product_id);
    
    if (existingItem) {
      set({
        items: items.map(i => 
          i.product_id === item.product_id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({ items: [...items, item] });
    }
  },
  removeItem: (itemId) => {
    set({ items: get().items.filter(item => item.id !== itemId) });
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
    } else {
      set({
        items: get().items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      });
    }
  },
  clearCart: () => set({ items: [] }),
  toggleCart: () => set({ isOpen: !get().isOpen }),
  setOpen: (isOpen) => set({ isOpen }),
}));

// App state store
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

// Admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@ecofinds.com',
  password: 'AdminEco2024!'
};