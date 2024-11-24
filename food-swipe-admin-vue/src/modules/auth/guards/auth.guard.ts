import type { NavigationGuardWithThis } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'

export const authGuard: NavigationGuardWithThis<undefined> = async () => {
  const store = useAuthStore()

  if (!store.accessToken) {
    return '/auth/sign-in'
  }

  if (store.user) {
    return true
  }

  try {
    await store.me()
  } catch {
    return '/auth/sign-in'
  }
  return true
}
