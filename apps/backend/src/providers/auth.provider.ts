import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { v7 as uuid } from "uuid";
import { users } from "../schema/user.schema";
import { accounts, sessions, verifications } from "../schema/auth.schema";
import { DatabaseProvider } from "./database.provider";
import { admin, username } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { KvStoreProvider } from "./kvstore.provider";

export type AuthProvider = ReturnType<typeof createAuthProvider>;

export function createAuthProvider(db: DatabaseProvider, kvStore: KvStoreProvider, env: Env) {
  return betterAuth({
    baseURL: env.API_URL,
    basePath: "/v1/auth",
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      schema: {
        users,
        accounts,
        sessions,
        verifications
      }
    }),
    advanced: {
      database: {
        generateId: () => uuid()
      }
    },
    secondaryStorage: {
      delete: async (key) => await kvStore.removeItem(key),
      get: async (key) => await kvStore.getItem(key),
      set: async (key, value, ttl?: number) => {
        if (ttl) {
          await kvStore.setItem(key, value, { ttl: ttl });
        } else {
          await kvStore.setItem(key, value);
        }
      }
    },
    emailAndPassword: {
      enabled: true
    },
    rateLimit: {
      enabled: false
    },
    plugins: [username(), admin(), expo()],
    trustedOrigins: [
      env.WEB_URL,
      "food-swipe://",
      ...(env.ENVIRONMENT !== "production"
        ? [
            "exp://*/*" // Trust all Expo development URLs
          ]
        : [])
    ]
  });
}
