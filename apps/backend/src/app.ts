import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { secureHeaders } from "hono/secure-headers";
import { registerRecipeController } from "./modules/recipe/recipe.controller.ts";
import { registerUserController } from "./modules/user/user.controller.ts";
import { registerMeasurementsController } from "./modules/measurement/measurement.controller.ts";
import { registerIngredientController } from "./modules/ingredient/ingredient.controller.ts";
import { registerRecipeBookController } from "./modules/recipe-book/recipe-book.controller.ts";
import { auth } from "./lib/auth.ts";
import type { Context } from "hono";
import { testWebsocket } from "./modules/test.websocket.ts";
import { websocketServer } from "./lib/websocket/server.ts";
import { authRouter } from "./modules/auth/auth.controller.ts";

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

export const getBunServer = (c: Context) =>
  ('server' in c.env ? c.env.server : c.env) as Bun.Server<{userId: string}> | undefined;

app.get('/ws',async c => {
  const server = getBunServer(c)
  if (!server) {
    return new Response("Server not found", { status: 500 });
  }


  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  server.upgrade(c.req.raw, {
    data: {
      userId: session.user.id
    }
  });
  return new Response(null);
})

registerUserController(app);
registerRecipeController(app);
registerMeasurementsController(app);
registerIngredientController(app);
registerRecipeBookController(app);
app.route("/v1/me", authRouter)

const server = Bun.serve({
  port: process.env.APP_PORT || 3000,
  fetch: app.fetch,
  websocket: {
    data: {} as {userId: string},
    maxPayloadLength: 1024 * 1024, // 1 MB
    perMessageDeflate: true,
    message(ws, message) {
      websocketServer.onMessage(ws, message);
    },
    open(ws) {
      const { userId } = ws.data;
      ws.subscribe(`user-${userId}`)
    },
    close(ws, code, message) {},
    drain(ws) {}
  }
});
await websocketServer.start(server);
websocketServer.registerHandler(testWebsocket);

console.log(`Server started url: ${server.url}`);
