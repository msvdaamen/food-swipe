import { createMiddleware } from "hono/factory";

export const validationLoggerMiddleware = createMiddleware(async (c, next) => {
	try {
		await next();
	} catch (e) {
		console.error(e);
		// throw e;
	}
});
