import { api } from "@/lib/api";
import { AuthResponse } from "../types/auth.response";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../auth.store";

export type SignInInput = {
    email: string;
    password: string;
}

export const signIn = (payload: SignInInput) => {
    return api.post<AuthResponse>("/v1/auth/sign-in", payload);
}

export const useSignIn = () => {
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            authStore.setAccessToken(data.accessToken);
            authStore.setRefreshToken(data.refreshToken);
        }
    });
}