import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { secureHeaders } from "hono/secure-headers";
import { registerRecipeController } from "./modules/recipe/recipe.controller.ts";
import { registerUserController } from "./modules/user/user.controller.ts";
import { registerMeasurementsController } from "./modules/measurement/measurement.controller.ts";
import { registerIngredientController } from "./modules/ingredient/ingredient.controller.ts";
import { registerToolsController } from "./modules/tools/tools.controller.ts";
import { registerRecipeBookController } from "./modules/recipe-book/recipe-book.controller.ts";
import { auth } from "./lib/auth.ts";

const app = new Hono();

app.use(secureHeaders());
app.use(cors({
  origin: ["http://localhost:5173"],
  allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
	exposeHeaders: ["Content-Length"],
	maxAge: 600,
	credentials: true,
}));

const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minutes
  limit: 120, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => {
    const info = getConnInfo(c);
    const cfConnectingIp = c.req.header()["cf-connecting-ip"];
    const realIp = c.req.header()["x-forwarded-for"];
    return cfConnectingIp || realIp || (info.remote.address as string);
  },
});

app.use(limiter);

app.get("/", (c) => c.text("Hello Bun!"));

app.on(["POST", "GET"], "/v1/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
});

// registerAuthController(app);
registerUserController(app);
registerRecipeController(app);
registerMeasurementsController(app);
registerIngredientController(app);
registerToolsController(app);
registerRecipeBookController(app);

export default {
  port: process.env.APP_PORT || 3000,
  fetch: app.fetch,
};
