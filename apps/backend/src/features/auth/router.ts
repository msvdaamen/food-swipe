import { createFactory } from "hono/factory";
import { matchError } from "better-result";
import { isNotFoundError } from "../../common/errors/is-not-found";
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
  const authService = createAuthService(c.get("db"), kvStorage, c.get("storage"));
  const { id } = c.get("user");
  const userResult = await authService.getAuthUser(id);
  if (userResult.isErr()) {
    if (isNotFoundError(userResult.error)) {
      return c.json({ message: userResult.error.message }, 404);
    }
    return c.status(500);
  }
  return c.json(userResult.value);
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
    if (isNotFoundError(result.error)) {
      return c.json({ message: result.error.message }, 404);
    }
    return matchError(result.error, {
      UnhandledException: () => c.status(500)
    });
  }
  return c.json({ filename: result.value });
});

export const authRouter = app;
