import { Hono } from "hono";
import { DatabaseProvider } from "./providers/database.provider";
import { AuthProvider } from "./providers/auth.provider";
import { users } from "./schema";
import { setupMiddleware } from "./middlewares/setup.middleware";

export type AppContext = {
  Bindings: Env;
  Variables: {
    db: DatabaseProvider;
    auth: AuthProvider;
  };
};

const app = new Hono<AppContext>();

app.get("/", (c) => c.text("Hello World"));

app.on(["POST", "GET"], "/v1/auth/*", setupMiddleware, async (c) => {
  return c.get("auth").handler(c.req.raw);
});

app.get("/test", setupMiddleware, async (c) => {
  const session = await c.get("db").select().from(users);
  return c.json(session);
});

export default {
  fetch: app.fetch
} satisfies ExportedHandler<Env>;
