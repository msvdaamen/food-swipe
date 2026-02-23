import { useMutation } from "@tanstack/react-query";
import { SocialAuthProvider } from "../types/social-auth-provider";

export type SignInSocialInput = {
  provider: SocialAuthProvider;
};

export type SignInSocialResponse = {
  authorizationUrl: string;
};

export async function signInSocial(payload: SignInSocialInput) {
  console.log(import.meta.env);
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/auth/sign-in-social`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URL,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("SignIn social failed");
  }

  return response.json() as Promise<SignInSocialResponse>;
}

export const useSignInSocial = () =>
  useMutation({
    mutationFn: signInSocial,
    onSuccess: (response) => {
      window.location.href = response.authorizationUrl;
    },
  });
