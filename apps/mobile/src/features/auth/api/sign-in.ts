import { api } from "@/lib/api-client";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AuthResponse } from "../types/auth.response";

export type SignInInput = {
  email: string;
  password: string;
};

export async function signIn(data: SignInInput): Promise<AuthResponse> {
  const response = await api.fetch(`/v1/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Sign in failed");
  }

  return response.json();
}

export const useSignIn = () =>
  useMutation({
    mutationFn: (payload: SignInInput) => signIn(payload),
  });
