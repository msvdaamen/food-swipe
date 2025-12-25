import { createFactory } from "hono/factory";
import { authMiddleware, type AuthContext } from "./auth.middleware";
import { uploadProfilePictureDto } from "./dto/upload-profile-picture";
import { authService } from "./auth.service";
import { createClient } from "@connectrpc/connect";
import { grpcTransport } from "../../lib/grpc-transport";
import { User } from "@food-swipe/grpc";

export const authRouterFactory = createFactory<AuthContext>({
  initApp: (app) => {
    app.use(authMiddleware);
  },
});

const app = authRouterFactory.createApp();

const grpcClient = createClient(User.UserService, grpcTransport);

app.get("/", async (c) => {
  const { id } = c.get("user");
  const user = await authService.getAuthUser(id);
  return c.json(user);
});

app.post("/profile-picture", async (c) => {
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
