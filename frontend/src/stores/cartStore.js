import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
          toast.success(`${product.name} x${existingItem.quantity + 1} au panier`);
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
          toast.success(`${product.name} ajouté au panier`);
        }
      },

      removeItem: (productId) => {
        const product = get().items.find(item => item.id === productId);
        set({ items: get().items.filter(item => item.id !== productId) });
        toast.success(`${product?.name} retiré du panier`);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map(item =>
              item.id === productId ? { ...item, quantity } : item
            )
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
