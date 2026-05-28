import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, quantity: number, color?: string) => void;
  removeItem: (productId: string, size: string, color?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string) => void;
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
      addItem: (product, size, quantity, color) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          set({ items: [...currentItems, { ...product, selectedSize: size, selectedColor: color, quantity }], isDrawerOpen: true });
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
          ),
        });
      },
      updateQuantity: (productId, size, quantity, color) => {
        const updatedItems = get().items.map((item) => {
          if (item.id === productId && item.selectedSize === size && item.selectedColor === color) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, item) => {
        const itemPrice = item.quantity >= 100 ? item.price * 0.9 : item.price;
        return acc + itemPrice * item.quantity;
      }, 0),
    }),
    {
      name: 'uniform-kart-cart',
      // Only persist items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
