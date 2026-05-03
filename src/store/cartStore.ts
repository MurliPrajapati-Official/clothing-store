import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      addItem: (product, size, quantity) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === product.id && item.selectedSize === size
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          set({ items: [...currentItems, { ...product, selectedSize: size, quantity }], isDrawerOpen: true });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size)
          ),
        });
      },
      updateQuantity: (productId, size, quantity) => {
        const updatedItems = get().items.map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'uniform-kart-cart',
      // Only persist items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
