import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  basePath: "/v1/auth",
  plugins: [
    expoClient({
      scheme: "food-swipe",
      storagePrefix: "food-swipe",
      storage: SecureStore,
    }),
    usernameClient(),
    adminClient(),
  ],
});
