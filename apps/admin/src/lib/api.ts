import { router } from "@/app/router";

const url = import.meta.env.VITE_API_URL! || "http://localhost:3000";

export class AuthApiClient {

  constructor(
    private readonly baseUrl: string
  ) {}

  async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
    });

    if (response.status === 401) {
      router.navigate({ to: "/auth/sign-in", replace: true });
    }

    return response;
  }
}

export const api = new AuthApiClient(url);
