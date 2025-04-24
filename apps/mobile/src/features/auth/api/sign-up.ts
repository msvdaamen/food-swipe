import { api } from "@/lib/api";
import { AuthResponse } from "../types/auth.response";
import { useMutation } from "@tanstack/react-query";
import { setTokens } from "./set-tokens";

type SignUpInput = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const signUp = (payload: SignUpInput) => {
  return api.post<AuthResponse>("/v1/auth/sign-up", payload);
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
    },
  });
};
