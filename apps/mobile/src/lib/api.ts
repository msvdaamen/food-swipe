import { signOut } from "@/features/auth/api/sign-out";
import { authClient } from "./auth";


class Api {

  constructor(
    private readonly baseUrl: string
  ) {}

  async fetch(endpoint: string, init?: RequestInit): Promise<Response> {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    const cookies = authClient.getCookie();

    const baseInit: RequestInit = {
      ...init,
      headers: {
        "Cookie": cookies,
        ...init?.headers,
      },
      credentials: "omit",
    };

    const response = await fetch(url, baseInit);

    if (response.status === 401) {
      await signOut();
    }

    return response;
  }
}

const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8787";
export const api = new Api(url);
