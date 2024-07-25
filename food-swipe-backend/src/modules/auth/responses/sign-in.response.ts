import { type AuthUser } from '../models/auth-user.interface';

export type SignInResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
