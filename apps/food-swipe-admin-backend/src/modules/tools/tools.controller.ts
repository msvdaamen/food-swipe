import { Hono } from "hono";
import { registerQueryLogController } from "./query-log/query-log.controller";

const app = new Hono();

export function registerToolsController(instance: Hono) {
  registerQueryLogController(app);
  const router = instance.route("/v1/tools", app);
}
