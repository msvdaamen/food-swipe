import { TaggedError } from "better-result";

export class NotFoundError extends TaggedError("NotFound")<{
  id: string;
  message: string;
}>() {}
