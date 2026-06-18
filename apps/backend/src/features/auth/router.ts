import { createFactory } from "hono/factory";
import { authMiddleware, type AuthContext } from "./auth.middleware";
import { uploadProfilePictureDto } from "./dto/upload-profile-picture";
import { createAuthService } from "./auth.service";
import { kvStorage } from "../../providers/kvstore.provider";
import { setupMiddleware } from "../../middlewares/setup.middleware";
import { httpErrorHandler } from "../../common/errors/errot-http-handler";

export const authRouterFactory = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(setupMiddleware, authMiddleware);
  }
});

const app = authRouterFactory.createApp();

app.get("/", async (c) => {
  const authService = createAuthService(c.get("db"), kvStorage, c.get("storage"));
  const { id } = c.get("user");
  const result = await authService.getAuthUser(id);
  if (result.isErr()) {
    return httpErrorHandler(result.error, c);
  }
  return c.json(result.value);
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
  const result = await authService.uploadProfilePicture(user.id, file);
  if (result.isErr()) {
    return httpErrorHandler(result.error, c);
  }
  return c.json({ filename: result.value });
});

export const authRouter = app;
