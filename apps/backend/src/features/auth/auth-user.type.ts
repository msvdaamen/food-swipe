import { createAuthProvider } from "../../providers/auth.provider";

export type AuthUser = ReturnType<typeof createAuthProvider>["$Infer"]["Session"]["user"];
