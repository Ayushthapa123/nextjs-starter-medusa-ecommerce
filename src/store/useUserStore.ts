import { create } from 'zustand';

interface UserState {
  id: string | null;
  accessToken: string | null;
  email: string | null;
  setUser: (user: { id: string; accessToken: string; email: string }) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  accessToken: null,
  email: null,
  setUser: ({ id, accessToken, email }) => set({ id, accessToken, email }),
  setAccessToken: (token) => set((state) => ({ ...state, accessToken: token })),
  clearUser: () => set({ id: null, accessToken: null, email: null }),
}));
