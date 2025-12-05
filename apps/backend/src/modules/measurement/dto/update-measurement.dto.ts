import { type } from "arktype";

export const updateMeasurementDto = type({
    "name?": "string",
    "abbreviation?": "string",
});

export type UpdateMeasurementDto = typeof updateMeasurementDto.infer;
