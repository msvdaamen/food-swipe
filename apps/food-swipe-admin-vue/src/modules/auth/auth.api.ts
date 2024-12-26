import axios from 'axios'
import type { SignInRequest } from '@/modules/auth/requests/sign-in.request'
import type { AuthResponse } from '@/modules/auth/responses/auth.response'
import type { AuthUser } from '@/modules/auth/models/auth.user.type'
import { authHttpClient } from '@/common/auth-http.client'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  adapter: 'fetch',
})

function signIn(payload: SignInRequest) {
  return http.post<AuthResponse>('/auth/sign-in', payload)
}

function me() {
  return authHttpClient.get<AuthUser>(`/auth/me`)
}

function refreshToken(refreshToken: string) {
  return http.post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', {
    refreshToken,
  })
}

export const authApi = {
  signIn,
  me,
  refreshToken,
}
