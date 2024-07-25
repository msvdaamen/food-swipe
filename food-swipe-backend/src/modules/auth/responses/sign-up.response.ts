import { type AuthUser } from '../models/auth-user.interface';

export type SignUpResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
