import { createFactory } from "hono/factory";
import { NotFoundError } from "../../common/errors/not-found.error";
import { authMiddleware, type AuthContext } from "./auth.middleware";
import { uploadProfilePictureDto } from "./dto/upload-profile-picture";
import { createAuthService } from "./auth.service";
import { kvStorage } from "../../providers/kvstore.provider";
import { setupMiddleware } from "../../middlewares/setup.middleware";

export const authRouterFactory = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(setupMiddleware, authMiddleware);
  }
});

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const authService = createAuthService(c.get("db"), kvStorage, c.get("storage"));
  const { id } = c.get("user");
  try {
    const user = await authService.getAuthUser(id);
    return c.json(user);
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.status(500);
  }
});

app.post("/profile-picture", async (c) => {
  const authService = createAuthService(c.get("db"), kvStorage, c.get("storage"));
  const body = await c.req.parseBody();
  const validated = await uploadProfilePictureDto.safeParseAsync(body["file"]);
  if (!validated.success) {
    return c.json({ error: validated.error }, 400);
  }
  const user = c.get("user");
  const file = validated.data;
  try {
    const filename = await authService.uploadProfilePicture(user.id, file);
    return c.json({ filename });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return c.json({ message: e.message }, 404);
    }
    return c.status(500);
  }
});

export const authRouter = app;
