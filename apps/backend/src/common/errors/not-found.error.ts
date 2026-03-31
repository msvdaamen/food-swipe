export class NotFoundError extends Error {
  readonly id: string;

  constructor(payload: { id: string; message: string }) {
    super(payload.message);
    this.name = "NotFoundError";
    this.id = payload.id;
  }
}
