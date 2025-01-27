import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { SignInRequest } from '@/modules/auth/requests/sign-in.request'
import { useAuthApi } from '@/modules/auth/auth.api'
import type { AuthUser } from '@/modules/auth/models/auth.user.type'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const useAuthStore = defineStore('auth', () => {
  const authApi = useAuthApi();

  const user = ref<AuthUser | null>(null)
  const accessToken = ref(localStorage.getItem(ACCESS_TOKEN_KEY) || '')
  const refreshToken = ref(localStorage.getItem(REFRESH_TOKEN_KEY) || '')

  watch(accessToken, (newAccessToken) => localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken))
  watch(refreshToken, (newRefreshToken) => localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken))

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
  }

  function removeTokens() {
    accessToken.value = ''
    refreshToken.value = ''
  }

  async function signIn(payload: SignInRequest) {
    const response = await authApi.signIn(payload)
    const data = response.data
    setTokens(data.accessToken, data.refreshToken)
    user.value = data.user
  }

  async function me() {
    const response = await authApi.me()
    user.value = response.data
  }

  return {
    user,
    accessToken,
    refreshToken,
    setTokens,
    removeTokens,
    signIn,
    me,
  }
})
