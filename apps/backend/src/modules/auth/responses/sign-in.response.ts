import { type AuthUser } from "../models/auth-user.interface";

export type SignInResponse = {
	user: Omit<AuthUser, "scopes">;
	accessToken: string;
	refreshToken: string;
};
