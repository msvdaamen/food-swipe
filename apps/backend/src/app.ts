import "./telementry";

import { NodeSdk } from "@effect/opentelemetry";
import {
	HttpMiddleware,
	HttpRouter,
	HttpServer,
	HttpServerResponse,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import {
	BatchSpanProcessor,
	ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { SentrySpanProcessor } from "@sentry/opentelemetry";
import { Effect, Layer } from "effect";
import { userRouter } from "./modules/user/router";
import { UserServiceLive } from "./modules/user/user.service";

const port = 3000;
const ServerLive = BunHttpServer.layer({ port });

const router = HttpRouter.empty.pipe(
	HttpRouter.get(
		"/",
		Effect.gen(function* () {
			return HttpServerResponse.text("Hello, World!");
		}),
	),
	HttpRouter.mount("/users", userRouter),

	HttpServer.serve(HttpMiddleware.logger),
	HttpServer.withLogAddress,
	Layer.provide(ServerLive),
);

// Set up tracing with the OpenTelemetry SDK

// const NodeSdkLive = NodeSdk.layer(() => ({
// 	resource: { serviceName: "food-swipe" },

// 	// Export span data to the console

// 	spanProcessor: new SentrySpanProcessor(),
// }));

BunRuntime.runMain(
	Layer.launch(router).pipe(
		Effect.provide(UserServiceLive),
		// Effect.provide(NodeSdkLive),
	),
);
