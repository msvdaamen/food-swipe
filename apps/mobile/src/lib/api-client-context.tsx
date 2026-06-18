import { createContext, useContext, type ReactNode } from "react";
import type { AuthApiClient } from "@food-swipe/client-api";

const ApiClientContext = createContext<AuthApiClient | null>(null);

type ApiClientProviderProps = {
  client: AuthApiClient;
  children: ReactNode;
};

export function ApiClientProvider({ client, children }: ApiClientProviderProps) {
  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>;
}

export function useApiClient(): AuthApiClient {
  const client = useContext(ApiClientContext);
  if (!client) {
    throw new Error("useApiClient must be used within ApiClientProvider");
  }
  return client;
}
