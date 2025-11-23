import { HttpRouter, HttpServerResponse } from "@effect/platform";
import { Effect } from "effect";
import { UserService2 } from "./user.service";

export const userRouter = HttpRouter.empty.pipe(
	HttpRouter.get(
		"/",
		Effect.gen(function* () {
			const userService = yield* UserService2;
			return HttpServerResponse.text(
				"Hello from users " + (yield* userService.test),
			);
		}),
	),
);
