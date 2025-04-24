import { Hono } from "hono";
import { signInDtoSchema } from "./dto/sign-in.dto";
import { authService } from "./auth.service";
import { refreshTokenDtoSchema } from "./dto/refresh-token.dto";
import { createFactory, createMiddleware } from "hono/factory";
import {
  authMiddleware,
  type AuthContext,
} from "./middlewares/auth.middleware";
import { Webhook } from "svix";

const app = new Hono();

app.post("/sign-in", async (c) => {
  const payload = signInDtoSchema.parse(await c.req.json());
  try {
    const response = await authService.signIn(payload);
    return c.json(response);
  } catch (error) {
    return c.json({}, 401);
  }
});

app.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  return c.json({
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  });
});

app.post("/refresh-token", async (c) => {
  const { refreshToken } = refreshTokenDtoSchema.parse(await c.req.json());
  try {
    const response = await authService.refreshTokens(refreshToken);
    return c.json(response);
  } catch (error) {
    return c.json({}, 401);
  }
});

app.post("/sign-out", authMiddleware, async (c) => {
  const user = c.get("user");
  await authService.signOut(user.id);
  return c.json({ message: "Sign out successfully" });
});

app.get("/webhook/created", async (c) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;
  const wh = new Webhook(webhookSecret);
  const payload = wh.verify(await c.req.json(), c.req.header());
});

export const authRouter = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(authMiddleware);
  },
});

export const registerAuthController = (instance: Hono) => {
  instance.route("/v1/auth", app);
};
