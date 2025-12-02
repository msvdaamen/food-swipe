import { createMiddleware } from "hono/factory";
import type { AuthUser } from "../models/auth-user.interface";
import { userService } from "../../user/user.service";
import { jwtService } from "../../../providers/jwt.service";
import type { JwtPayload } from "jsonwebtoken";
import { verifyClerkToken } from "../../../providers/auth.provider";

export type AuthContext = {
  Variables: {
    user: AuthUser;
  };
};

export const authMiddleware = createMiddleware<AuthContext>(async (c, next) => {
  const bearer = c.req.header("authorization");
  if (!bearer) {
    return c.json({}, 401);
  }
  const accessToken = bearer.split(" ")[1];
  if (!accessToken) {
    return c.json({}, 401);
  }
  try {
    const { sub } = await jwtService.verify(accessToken);
    if (!sub) {
      return c.json({}, 401);
    }
    const user = await userService.findById(Number(sub));
    if (!user) {
      return c.json({}, 401);
    }
    c.set("user", {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    });
    await next();
  } catch (error) {
    return c.json({}, 401);
  }
});
