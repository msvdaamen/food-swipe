import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { signUp, SignUpInput } from '../api/sign-up';
import { signIn, SignInput } from '../api/sign-in';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  signIn: (data: SignInput) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  signIn: async (data) => {
    const { accessToken, refreshToken } = await signIn(data);
    set({ accessToken, refreshToken, isAuthenticated: true });
    await get().setTokens(accessToken, refreshToken);
  },

  signUp: async (data) => {
    const { accessToken, refreshToken } = await signUp(data);
    await get().setTokens(accessToken, refreshToken);
  },

  signOut: async () => {
    await storage.clearTokens();
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  initialize: () => {
    const accessToken = storage.getAccessTokenSync();
    const refreshToken = storage.getRefreshTokenSync();

    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
    }

  },

  setTokens: async (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    await Promise.all([
      storage.setAccessToken(accessToken),
      storage.setRefreshToken(refreshToken),
    ]);
  },
}));
