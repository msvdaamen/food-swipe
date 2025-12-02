import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { me } from "../api/me";
import { refreshTokens } from "../api/refresh-token";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  checkAuthentication: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get, store) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setTokens: async (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  signOut: async () => {
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },

  checkAuthentication: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!accessToken || !refreshToken) {
      return false;
    }
    if (get().isAuthenticated) {
      return true;
    }
    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await refreshTokens(refreshToken);
      get().setTokens(accessToken, newRefreshToken);
      return true;
    } catch {
      return false;
    }
  },
}));
