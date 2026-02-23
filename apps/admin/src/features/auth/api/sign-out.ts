import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

type SignOutInput = {
  refreshToken: string;
};

export async function signOut(input: SignOutInput) {
  const response = await api.fetch("/v1/auth/sign-out", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to sign out");
  }
}

export const useSignOut = () =>
  useMutation({
    mutationFn: signOut,
    onSuccess: () => {},
  });
