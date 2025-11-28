import { api } from "@/lib/api-client";
import { AuthResponse } from "./refresh-token";

export type SignInput = {
  email: string;
  password: string;
}

export async function signIn(data: SignInput): Promise<AuthResponse> {
  const response = await api.fetch(`/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Sign in failed');
  }

  return response.json();
}
