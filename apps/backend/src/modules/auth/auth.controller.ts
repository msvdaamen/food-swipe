import { createFactory } from "hono/factory";
import {
  authMiddleware,
  type AuthContext,
} from "./auth.middleware";

export const authRouter = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(authMiddleware);
  },
});
