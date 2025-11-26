import { api } from "@/lib/api";
import { AuthResponse } from "../types/auth.response";
import { useMutation } from "@tanstack/react-query";
import { setTokens } from "./set-tokens";

export type SignInInput = {
  email: string;
  password: string;
};

export const signIn = (payload: SignInInput) => {
  return api.post<AuthResponse>("/v1/auth/sign-in", payload);
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
    },
  });
};
