import { StrictMode } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <StrictMode>{children}</StrictMode>;
}
