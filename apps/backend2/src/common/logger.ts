import {logger} from "@sentry/bun";

export class Logger {
  constructor(private readonly name?: string) {}

  info(message: string, attributes?: Record<string, unknown>): void {
    logger.info(this.createMessage(message), attributes);
  }

  debug(message: string, attributes?: Record<string, unknown>): void {
    logger.debug(this.createMessage(message), attributes);
  }

  warning(message: string, attributes?: Record<string, unknown>): void {
    logger.warn(this.createMessage(message), attributes);
  }

  error(message: string, attributes?: Record<string, unknown>): void {
    logger.error(this.createMessage(message), attributes);
  }

  private createMessage(message: string): string {
    if (!this.name) {
      return message;
    }
    return `[${this.name}] ${message}`;
  }
}
