import type { AuthUser } from '../models/auth.user.type'

export type AuthResponse = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}
