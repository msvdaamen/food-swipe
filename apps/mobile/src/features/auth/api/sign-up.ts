import { api } from "@/lib/api-client";
import { AuthResponse } from "./refresh-token";

export type SignUpInput = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function signUp(data: SignUpInput): Promise<AuthResponse> {
  const response = await api.fetch(`/auth/sign-up`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Sign up failed');
  }

  return response.json();
}
