import {z} from "zod";

export const createMeasurementDto = z.object({
    name: z.string(),
    abbreviation: z.string(),
})

export type CreateMeasurementDto = z.infer<typeof createMeasurementDto>