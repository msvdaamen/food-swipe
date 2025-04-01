import { create, ExtractState } from "zustand";
import { immer } from "zustand/middleware/immer";
import { combine } from "zustand/middleware";
import { SignInRequest } from "./requests/sign-in.request";
import { authApi } from "./api";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

type State = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: State = {
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
};

type AuthState = ExtractState<typeof useAuthStore>;

export const useAuthStore = create(
  immer(
    combine(initialState, (set) => ({
      async signIn(payload: SignInRequest) {
        const response = await authApi.login(payload.email, payload.password);
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      },
      setAccessToken(accessToken: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        set({ accessToken });
      },
      setRefreshToken(refreshToken: string) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        set({ refreshToken });
      },
    }))
  )
);
