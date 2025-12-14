import { createFactory } from "hono/factory";
import {
  authMiddleware,
  type AuthContext,
} from "./auth.middleware";

export const authRouterFactory = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(authMiddleware);
  },
});
