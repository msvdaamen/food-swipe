import { router } from "@/app/router";
import { refreshTokens } from "@/features/auth/api/refresh-token";
import { useAuthStore } from "@/features/auth/auth.store";

const url = import.meta.env.VITE_API_URL! || "http://localhost:3000";

export class AuthApiClient {
  constructor(private readonly baseUrl: string) {}

  private refreshPromise: Promise<string> | null = null;

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const data = await refreshTokens(refreshToken);
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private buildHeaders(options?: RequestInit): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) || {}),
    };

    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers: this.buildHeaders(options),
    });
    const refreshToken = useAuthStore.getState().refreshToken;
    if (response.status === 401 && refreshToken) {
      try {
        const newAccessToken = await this.refreshAccessToken(refreshToken);
        response = await fetch(url, {
          ...options,
          headers: {
            ...this.buildHeaders(options),
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch {
        useAuthStore.getState().clearTokens();
        router.navigate({ to: "/auth/sign-in", replace: true });
      }
    }
    if (response.status === 401) {
      router.navigate({ to: "/auth/sign-in", replace: true });
    }

    return response;
  }
}

export const api = new AuthApiClient(url);
