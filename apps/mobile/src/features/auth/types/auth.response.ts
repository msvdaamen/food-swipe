import { AuthUser } from "../types/auth-user.type";


export type AuthResponse = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}