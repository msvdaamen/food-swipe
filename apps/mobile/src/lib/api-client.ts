import { router } from "expo-router";
import { authClient } from "./auth";

const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export class AuthApiClient {
  constructor(private readonly baseUrl: string) {}

  async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const cookies = authClient.getCookie();

    if (cookies) {
      if (!options) {
        options = {};
      }
      options.headers = {
        ...options.headers,
        Cookie: cookies,
      };
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      credentials: "omit",
    });

    if (response.status === 401) {
      router.replace("/sign-in");
    }

    return response;
  }
}

export const api = new AuthApiClient(url);
