import { create } from 'zustand';

interface UserState {
  userId: string | null;
  accessToken: string | null;
  email: string | null;
  setUser: (user: { id: string; accessToken: string; email: string }) => void;
  setAccessToken: (token: string) => void;
  setUserId: (id: string) => void;

  clearUser: () => void;
}


export const useUserStore = create<UserState>((set) => ({
  userId: null,
  accessToken: null,
  email: null,
  setUser: ({ id, accessToken, email }) => set({ userId:id, accessToken, email }),
  setAccessToken: (token) => set((state) => ({ ...state, accessToken: token })),
  setUserId: (id) => set((state) => ({ ...state, id: id })),

  clearUser: () => set({ userId: null, accessToken: null, email: null }),
}));
