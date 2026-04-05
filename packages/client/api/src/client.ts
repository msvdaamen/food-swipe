export type AuthApiClientOptions = {
  /** Called when the server responds with 401. Use for sign-out, refresh, or redirect. */
  onUnauthorized?: (response: Response) => void | Promise<void>;
  /** Defaults to `"include"` (browser cookie sessions). Use `"omit"` with manual Cookie headers on native. */
  credentials?: RequestCredentials;
  /** Adjust headers or init before fetch (e.g. inject Cookie on React Native). */
  transformInit?: (init: RequestInit) => RequestInit | Promise<RequestInit>;
};

export class AuthApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly options: AuthApiClientOptions = {},
  ) {}

  async fetch(endpoint: string, init?: RequestInit): Promise<Response> {
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    const baseInit: RequestInit = {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      credentials: this.options.credentials ?? "include",
    };

    const finalInit = this.options.transformInit
      ? await this.options.transformInit(baseInit)
      : baseInit;

    const response = await fetch(url, finalInit);

    if (response.status === 401 && this.options.onUnauthorized) {
      await this.options.onUnauthorized(response);
    }

    return response;
  }
}
