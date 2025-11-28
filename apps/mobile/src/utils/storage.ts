import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const storage = {
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving token', error);
    }
  },

  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  },

  getTokenSync(key: string) {
    try {
      return SecureStore.getItem(key);
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  },

  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting token', error);
    }
  },

  async setAccessToken(token: string) {
    await this.saveToken(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken() {
    return await this.getToken(ACCESS_TOKEN_KEY);
  },

  getAccessTokenSync() {
    return this.getTokenSync(ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string) {
    await this.saveToken(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken() {
    return await this.getToken(REFRESH_TOKEN_KEY);
  },

  getRefreshTokenSync() {
    return this.getTokenSync(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await Promise.all([
      this.deleteToken(ACCESS_TOKEN_KEY),
      this.deleteToken(REFRESH_TOKEN_KEY),
    ]);
  },
};
