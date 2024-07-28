import { type AuthUser } from '../models/auth-user.interface';

export type SignUpResponse = {
  user: Omit<AuthUser, 'scopes'>;
  accessToken: string;
  refreshToken: string;
}
