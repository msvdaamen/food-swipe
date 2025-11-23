import { z } from "zod";

export const updateMeasurementDto = z.object({
	name: z.string().optional(),
	abbreviation: z.string().optional(),
});

export type UpdateMeasurementDto = z.infer<typeof updateMeasurementDto>;
