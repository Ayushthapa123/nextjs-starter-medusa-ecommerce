import { create } from 'zustand';

interface CartState {
  anonymousCartId: string | null;
  setAnonymousCartId: (id: string) => void;
  clearAnonymousCartId: (id: string) => void;

 
}

export const useAnonymousCartStore = create<CartState>((set) => ({
  anonymousCartId: null,
  setAnonymousCartId: (id) => set({ anonymousCartId: id }),
  clearAnonymousCartId: () => set({ anonymousCartId: null }),
}));
