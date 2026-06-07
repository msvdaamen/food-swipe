import { Context } from "hono";
import { NotFoundError2 } from "./not-found.error";
import { isTaggedError, matchError } from "better-result";

type AppErrors = NotFoundError2;
export function httpErrorHandler(err: AppErrors, c: Context): Response {
  if (!isTaggedError(err)) {
    console.error(err);
    return c.text("Internal Server Error", 500);
  }
  return matchError(err, {
    NotFoundError: (e) => c.text(e.message, 404)
  });
}
