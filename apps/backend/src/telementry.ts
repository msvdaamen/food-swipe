import * as Sentry from "@sentry/bun";

Sentry.init({
	dsn: "https://117d3997737743ad20ecae61632b4aef@o4509168904896512.ingest.de.sentry.io/4510416101376080",
	// skipOpenTelemetrySetup: true,
	enableLogs: true,
	tracesSampleRate: 1.0, // Capture 100% of the transactions
});
