import { User } from '@supabase/supabase-js';

// Database types
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'PAID' | 'CANCELLED';
  total_cents: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price_cents: number;
  quantity: number;
  products?: Product;
}

// Form types
export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface ProfileFormData {
  username: string;
  avatar_url?: string;
}

// API response types
export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface OrderResponse {
  order: Order;
  items: OrderItem[];
}

// Constants
export const CATEGORIES = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Living',
  'Books & Media',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Collectibles',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

// Utility types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: {
          owner_id: string;
          title: string;
          description: string;
          category: string;
          price_cents: number;
          images: string[];
          is_active?: boolean;
        };
        Update: Partial<{
          title: string;
          description: string;
          category: string;
          price_cents: number;
          images: string[];
          is_active: boolean;
        }>;
      };
      carts: {
        Row: Cart;
        Insert: Omit<Cart, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Cart, 'id' | 'created_at' | 'updated_at'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id'>;
        Update: Partial<Omit<CartItem, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'>;
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
    };
  };
};

// Auth context type
export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (data: SignUpFormData) => Promise<void>;
  signIn: (data: SignInFormData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileFormData) => Promise<void>;
}

// Store types
export interface AuthStore {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, 'id' | 'cart_id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (isOpen: boolean) => void;
}

export interface AppStore {
  currentPage: string;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
}
