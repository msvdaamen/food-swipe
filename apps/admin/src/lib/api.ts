import { router } from "@/app/router";
import { AuthApiClient } from "@food-swipe/client-api";

const url = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = new AuthApiClient(url, {
  onUnauthorized: () => {
    router.navigate({ to: "/auth/sign-in", replace: true });
  }
});
