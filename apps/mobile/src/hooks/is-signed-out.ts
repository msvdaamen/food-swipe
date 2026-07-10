import { authClient } from "@/lib/auth";
import { useMemo } from "react";

export function useIsSignedOut(): boolean {
  const { data: session } = authClient.useSession();
  const value = useMemo(() => !session, [session]);
  return value;
}
