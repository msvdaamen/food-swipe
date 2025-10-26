import { useAuth, useUser } from "@clerk/clerk-react"


export function useClerkAuth() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  console.log({isSignedIn, user})

  return {
    isAuthenticated: !!isSignedIn,
    user: user
      ? {
          id: user.id,
          username:
            user.username || user.primaryEmailAddress?.emailAddress || '',
          email: user.primaryEmailAddress?.emailAddress || '',
        }
      : null,
    isLoading: !isLoaded,
  }
}
