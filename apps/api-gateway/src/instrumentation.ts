import * as Sentry from "@sentry/bun";

if (process.env.SENTRY_DNS) {
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    // Send structured logs to Sentry
    enableLogs: true,
    // Tracing
    tracesSampleRate: 1.0, // Capture 100% of the transactions
  });
}
