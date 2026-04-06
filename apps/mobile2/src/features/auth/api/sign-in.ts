import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";

export type SignInInput = {
  email: string;
  password: string;
};

export async function signIn(input: SignInInput) {
  return authClient.signIn.email(input);
}

export const useSignIn = () =>
  useMutation({
    mutationFn: (payload: SignInInput) => signIn(payload),
  });
