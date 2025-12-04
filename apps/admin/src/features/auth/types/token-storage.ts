type MaybePromise<T> = Promise<T> | T;

export interface TokenStorage {
  setTokens(accessToken: string, refreshToken: string): MaybePromise<void>;
  getAccessToken(): MaybePromise<string | null | undefined>;
  getRefreshToken(): MaybePromise<string | null | undefined>;
  clearTokens(): MaybePromise<void>;
}
