import { storage } from '@/utils/storage';
import { router } from 'expo-router';
import { authApi } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { refreshTokens } from '@/features/auth/api/refresh-token';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

export const api = {
  async fetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
    const token = await storage.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshToken = await storage.getRefreshToken();

      if (!refreshToken) {
        await useAuthStore.getState().signOut();
        router.replace('/sign-in');
        return response;
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);

          await useAuthStore.getState().setTokens(accessToken, newRefreshToken);

          onRefreshed(accessToken);
        } catch (error) {
          console.error('Token refresh failed', error);
          await useAuthStore.getState().signOut();
          router.replace('/sign-in');
          onRefreshed(null);
          return response;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber(async (newToken) => {
          if (!newToken) {
            resolve(response);
            return;
          }
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
          resolve(retryResponse);
        });
      });
    }

    return response;
  }
};
