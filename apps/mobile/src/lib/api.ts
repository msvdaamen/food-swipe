import { getAccessToken } from "@/features/auth/api/set-tokens";

export class Api {
  public apiUrl: string = process.env.EXPO_PUBLIC_API_URL!;

  public async get<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.request(`${this.apiUrl}${path}`, init);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  public async post<T>(
    path: string,
    data?: object,
    init?: RequestInit
  ): Promise<T> {
    const response = await this.request(`${this.apiUrl}${path}`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...init,
    });
    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  public async put<T>(
    path: string,
    data?: object,
    init?: RequestInit
  ): Promise<T> {
    const response = await this.request(`${this.apiUrl}${path}`, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...init,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }

  public async delete<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.request(`${this.apiUrl}${path}`, {
      method: "DELETE",
      ...init,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return json as T;
    } catch {
      return text as unknown as T;
    }
  }

  private async request(
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response> {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string>),
    };

    const accessToken = await getAccessToken();

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const response = await fetch(input, {
      ...init,
      headers,
    });
    // if (!response.ok && response.status === 401) {
    //   const refreshToken = useAuthStore.getState().refreshToken;
    //   if (!refreshToken) {
    //     window.location.replace("/auth/sign-in");
    //     return response;
    //   }
    //   await this.refreshTokens(refreshToken);
    //   return this.request(input, init);
    // }
    return response;
  }

  //   activeReq: Promise<void> | null = null;
  //   private async refreshTokens(refreshToken: string) {
  //     if (this.activeReq) {
  //       return this.activeReq;
  //     }
  //     this.activeReq = fetch(`${this.apiUrl}/v1/auth/refresh-token`, {
  //       method: "POST",
  //       body: JSON.stringify({ refreshToken }),
  //     }).then(async (res) => {
  //       if (res.ok) {
  //         const { accessToken, refreshToken } = (await res.json()) as {
  //           accessToken: string;
  //           refreshToken: string;
  //         };
  //         localStorage.setItem("accessToken", accessToken);
  //         localStorage.setItem("refreshToken", refreshToken);
  //         this.activeReq = null;
  //         return;
  //       }
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("refreshToken");
  //       window.location.replace("/auth/sign-in");
  //       throw new Error("Failed to refresh tokens");
  //     });
  //     return this.activeReq;
  //   }
}

export const api = new Api();
