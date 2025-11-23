import { Hono } from "hono";
import { registerQueryLogController } from "./query-log/query-log.controller";
import { authRouter } from "../auth/auth.controller";

const app = authRouter.createApp();

export function registerToolsController(instance: Hono) {
	registerQueryLogController(app);
	const router = instance.route("/v1/tools", app);
}
