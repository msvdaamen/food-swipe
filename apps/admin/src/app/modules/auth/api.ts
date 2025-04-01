import { httpApi } from "@/common/api";
import { AuthResponse } from "./responses/auth.response";

export class AuthApi {
  public async login(email: string, password: string) {
    const response = await httpApi.post<AuthResponse>("/v1/auth/sign-in", {
      email,
      password,
    });
    return response;
  }
}

export const authApi = new AuthApi();
