import { api } from "@/lib/api-client";
import { AuthUser } from "../types/auth-user";

export async function me(): Promise<AuthUser> {
  const response = await api.fetch(`/v1/auth/me`);

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return response.json();
}
