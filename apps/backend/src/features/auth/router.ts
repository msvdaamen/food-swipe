import { createFactory } from "hono/factory";
import { authMiddleware, type AuthContext } from "./auth.middleware";
import { uploadProfilePictureDto } from "./dto/upload-profile-picture";
import { createAuthService } from "./auth.service";
import { kvStorage } from "../../providers/kvstore.provider";

export const authRouterFactory = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(authMiddleware);
  }
});

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const authService = createAuthService(c.get("db"), kvStorage);
  const { id } = c.get("user");
  const user = await authService.getAuthUser(id);
  return c.json(user);
});

app.post("/profile-picture", async (c) => {
  const authService = createAuthService(c.get("db"), kvStorage);
  const body = await c.req.parseBody();
  const validated = await uploadProfilePictureDto.safeParseAsync(body["file"]);
  if (!validated.success) {
    return c.json({ error: validated.error }, 400);
  }
  const user = c.get("user");
  const file = validated.data;
  const filename = await authService.uploadProfilePicture(user.id, file);

  return c.json({ filename });
});

export const authRouter = app;
