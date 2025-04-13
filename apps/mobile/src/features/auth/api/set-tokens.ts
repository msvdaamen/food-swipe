import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function setTokens(accessToken: string, refreshToken: string) {
  accessToken = accessToken;
  refreshToken = refreshToken;
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken() {
  if (accessToken) return accessToken;
  accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  return accessToken;
}

export async function getRefreshToken() {
  if (refreshToken) return refreshToken;
  refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return refreshToken;
}

function memo() {}
