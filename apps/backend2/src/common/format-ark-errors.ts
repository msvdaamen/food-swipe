import type { ArkErrors } from "arktype";

type ValidationError = {
    [prop: string]: string[];
}

export function FormatArkErrors(err: ArkErrors) {
    const format: ValidationError = {};

    for (const error of err) {
        const key = error.path.join('.');
        if (!format[key]) {
            format[key] = [];
        }
        format[key].push(error.message);
    }

    return format;
}
