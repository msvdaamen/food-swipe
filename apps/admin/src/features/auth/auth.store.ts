import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { combine } from "zustand/middleware";

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

export const useAuthStore = create(
  immer(
    combine(initialState, (set) => ({
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
