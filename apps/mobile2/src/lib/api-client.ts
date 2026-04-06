import { AuthApiClient } from "@food-swipe/client-api";
import { router } from "expo-router";
import { authClient } from "./auth";

const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const api = new AuthApiClient(url, {
  credentials: "omit",
  transformInit: (init) => {
    const cookies = authClient.getCookie();
    if (!cookies) return init;
    const headers = new Headers(init.headers);
    headers.set("Cookie", cookies);
    return { ...init, headers };
  },
  onUnauthorized: () => {
    router.replace("/sign-in");
  },
});
