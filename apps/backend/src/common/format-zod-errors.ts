import type { ZodError } from "zod";

type ValidationError = {
	[prop: string]: string[];
};

export function FormatZodErrors(err: ZodError) {
	const errors = err.errors;
	const format: ValidationError = {};

	for (const error of errors) {
		const key = error.path.join(".");
		if (!format[key]) {
			format[key] = [];
		}
		format[key].push(error.message);
	}

	return format;
}
