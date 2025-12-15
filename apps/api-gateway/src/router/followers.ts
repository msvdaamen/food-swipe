import { authRouterFactory } from "../modules/auth/auth.controller";
import { Followers } from "@food-swipe/grpc";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createClient } from "@connectrpc/connect";
import { Hono } from "hono";

const transport = createGrpcTransport({
  baseUrl: "http://localhost:3001",
});

const client = createClient(Followers.FollowerService, transport);

const app = new Hono();
app.get("/followers", async (c) => {
  const response = await client.getFollowing({
    userId: "1a630366-f38c-4b51-8ed7-0a2181e0cc92",
  });
  return c.json(response.following);
});

export const followersRouter = app;
