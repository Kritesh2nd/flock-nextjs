import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  roles: string[];
  profileUrl?: string;
  newUser?: boolean;
  redirectUrl?: string;
  expiryDate?: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  accessToken?: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("auth-storage");
      },
      setAccessToken: (token) => set({ accessToken: token }),
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
