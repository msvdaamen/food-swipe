import { useMutation } from "@tanstack/react-query";
import { SocialAuthProvider } from "../types/social-auth-provider";
import { AuthResponse } from "../types/auth.response";
import { useAuthStore } from "../auth.store";

export type SignInSocialCallbackInput = {
  provider: SocialAuthProvider;
  code: string;
  state: string;
};

export async function signInSocialCallback(payload: SignInSocialCallbackInput) {
  console.log(import.meta.env);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/auth/sign-in-social-callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("SignIn social failed");
  }

  return response.json() as Promise<AuthResponse>;
}

export const useSignInSocialCallback = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: signInSocialCallback,
    onSuccess: (response) => {
      authStore.setTokens(response.accessToken, response.refreshToken);
    },
  });
};
