import { authClient } from "@/lib/auth";


export async function signOut(): Promise<void> {
  await authClient.signOut();
}
