import { authClient } from "@/lib/auth";

export type AuthUser = typeof authClient.$Infer.Session.user;
