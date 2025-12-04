import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { databaseProvider } from "../providers/database.provider";
import { username, admin } from "better-auth/plugins"
import { expo } from "@better-auth/expo";
import { cacheProvider } from "../providers/cache.provider";


export const auth = betterAuth({
  basePath: "/v1/auth",
  database: drizzleAdapter(databaseProvider, {
      provider: "pg",
      usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => Bun.randomUUIDv7(),
    }
  },
  secondaryStorage: {
      get: async (key) => await cacheProvider.get(key),
      set: async (key, value, ttl) => {
        await cacheProvider.set(key, value);
        await cacheProvider.expire(key, ttl!);
      },
      delete: async (key) => await cacheProvider.del(key).then(() => Promise.resolve())
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
      refreshCache: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        return await Bun.password.hash(password)
      },
      verify: async ({ password, hash }) => {
        return await Bun.password.verify(password, hash)
      },
    },
  },
  plugins: [expo(), username(), admin()],
  trustedOrigins: [
    "food-swipe://",
    "https://food-swipe.app",
    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(import.meta.env.ENVIREMENT !== "production"
      ? [
          'http://localhost:5173',

          "exp://*/*", // Trust all Expo development URLs
          "exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
          "exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
          "exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
          "exp://localhost:*/*", // Trust localhost
        ]
      : []),
  ],
});
