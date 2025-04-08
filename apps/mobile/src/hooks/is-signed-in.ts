import { useAuth } from "@clerk/clerk-expo";

export function useIsSignedIn(): boolean {
  const { isSignedIn } = useAuth();
  return !!isSignedIn;
}
export function useIsSignedOut(): boolean {
  const { isSignedIn } = useAuth();
  return !isSignedIn;
}
