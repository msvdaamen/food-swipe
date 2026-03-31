import { createMiddleware } from "hono/factory";
import { AppContext } from "../..";
import { AuthUser } from "./auth-user.type";

export type AuthContext = {
  Variables: {
    user: AuthUser;
  };
} & AppContext;

export const authMiddleware = createMiddleware<AuthContext>(async (c, next) => {
  const session = await c.get("auth").api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({}, 401);
  }

  const { user } = session;
  c.set("user", user)!;
  await next();
});
