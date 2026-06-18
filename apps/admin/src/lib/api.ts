import { router } from "@/app/router";
import { HttpClient } from "../../../../packages/client/api/src/client";

const url = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class AuthApiClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  async fetch(endpoint: string, init?: RequestInit): Promise<Response> {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;

    const baseInit: RequestInit = {
      ...init,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers
      },
      credentials: "include"
    };

    const response = await fetch(url, baseInit);

    if (response.status === 401) {
      await router.navigate({ to: "/auth/sign-in", replace: true });
    }

    return response;
  }
}

export const api = new AuthApiClient(url);
