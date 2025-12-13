import { authClient } from "@/lib/auth";

export type User = typeof authClient.$Infer.Session.user;
