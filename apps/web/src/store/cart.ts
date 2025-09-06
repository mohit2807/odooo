import { create } from 'zustand';
import { CartItem } from '@/types';

interface CartState {
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
      set({ items: [...items, { ...item, id: `temp-${Date.now()}`, cart_id: 'temp' }] });
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
