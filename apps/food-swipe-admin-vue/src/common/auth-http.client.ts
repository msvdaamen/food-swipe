import axios from 'axios'

import { useAuthStore } from '@/modules/auth/auth.store'
import { useRouter } from 'vue-router'
import { useAuthApi } from '@/modules/auth/auth.api'

const authHttpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  adapter: 'fetch',
})

export function useAuthHttpClient() {
  return authHttpClient;
}

authHttpClient.interceptors.request.use((value) => {
  const store = useAuthStore()

  const accessToken = store.accessToken
  if (accessToken) {
    value.headers.Authorization = `Bearer ${accessToken}`
  }
  return value
})

authHttpClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const store = useAuthStore()
    const router = useRouter()

    if (err.url?.includes('auth/refresh-token')) {
      console.log('Refresh token error')
      store.removeTokens()
      router.push('/auth/sign-in')
      return err
    }
    if (err.url?.includes('auth/') && !err.url?.includes('auth/me')) {
      console.log('Auth error')
      return err
    }
    if (!store.refreshToken) {
      console.log('No refresh token')
      return err
    }
    if (err.status === 401) {
      console.log('try Refreshing token')
      try {
        const { accessToken, refreshToken } = await fetchNewTokens(store.refreshToken)
        store.setTokens(accessToken, refreshToken)
        return authHttpClient(err.config)
      } catch {
        console.log(err)
        return err
      }
    }
    return err
  },
)

let activeReq: Promise<{ accessToken: string; refreshToken: string }> | null = null
async function fetchNewTokens(refreshToken: string) {
  const authApi = useAuthApi();
  if (activeReq) {
    return activeReq
  }
  activeReq = authApi
    .refreshToken(refreshToken)
    .then((r) => r.data)
    .then((data) => {
      activeReq = null
      return data
    })
  return activeReq
}
