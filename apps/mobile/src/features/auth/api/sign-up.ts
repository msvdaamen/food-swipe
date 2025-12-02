import { api } from "@/lib/api-client";
import { AuthResponse } from "../types/auth.response";
import { useMutation } from "@tanstack/react-query";

export type SignUpInput = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function signUp(data: SignUpInput): Promise<AuthResponse> {
  const response = await api.fetch(`/v1/auth/sign-up`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return response.json();
}

export const useSignUp = () =>
  useMutation({
    mutationFn: (payload: SignUpInput) => signUp(payload),
  });
