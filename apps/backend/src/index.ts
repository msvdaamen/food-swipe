import { Hono } from "hono";
import { cors } from "hono/cors";
import { users } from "./schema";
import { setupMiddleware } from "./middlewares/setup.middleware";
import type { AppContext } from "./app-context";
import { userRouter } from "./features/user/router";
import { authRouter } from "./features/auth/router";
import { measurementRouter } from "./features/measurement/router";
import { ingredientRouter } from "./features/ingredient/router";
import { recipeBookRouter } from "./features/recipe-book/router";
import { recipeRouter } from "./features/recipe/router";

export type { AppContext } from "./app-context";

const app = new Hono<AppContext>();

app.use(
  cors({
    origin: (_, ctx) => ctx.env.WEB_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
  }),
);

app.get("/", (c) => c.text("Hello World!"));

app.use("/v1/*", setupMiddleware);

app.on(["POST", "GET"], "/v1/auth/*", async (c) => {
  return c.get("auth").handler(c.req.raw);
});

app.route("/v1/users", userRouter);
app.route("/v1/measurements", measurementRouter);
app.route("/v1/ingredients", ingredientRouter);
app.route("/v1/recipe-books", recipeBookRouter);
app.route("/v1/recipes", recipeRouter);
app.route("/v1/me", authRouter);

app.get("/v1/test", async (c) => {
  const session = await c.get("db").select().from(users);
  return c.json(session);
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
