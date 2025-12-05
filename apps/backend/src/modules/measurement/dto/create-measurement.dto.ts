import { type } from "arktype";

export const createMeasurementDto = type({
    name: "string",
    abbreviation: "string",
});

export type CreateMeasurementDto = typeof createMeasurementDto.infer;
