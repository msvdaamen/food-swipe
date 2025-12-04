import { createAuthClient } from "better-auth/react"
import { usernameClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL! || "http://localhost:3000",
    basePath: "/v1/auth",
    plugins: [
      usernameClient(),
      adminClient()
    ]
})
