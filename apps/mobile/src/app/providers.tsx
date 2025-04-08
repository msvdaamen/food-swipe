import { StrictMode } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <ClerkProvider>{children}</ClerkProvider>
    </StrictMode>
  );
}
