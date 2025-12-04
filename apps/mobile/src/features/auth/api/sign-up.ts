import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";

export type SignUpInput = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function signUp(input: SignUpInput) {
  return authClient.signUp.email({
    ...input,
    name: `${input.firstName} ${input.lastName}`,
  });
}

export const useSignUp = () =>
  useMutation({
    mutationFn: (payload: SignUpInput) => signUp(payload),
  });
