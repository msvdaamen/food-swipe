import { NotFoundError } from "./not-found.error";

export function isNotFoundError(e: unknown): e is NotFoundError {
  return e instanceof NotFoundError;
}
