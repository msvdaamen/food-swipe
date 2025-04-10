import { z } from "zod";

export const getQueryLogsDto = z.object({
  sort: z
    .enum(["totalExecTime", "calls", "maxExecTime"])
    .default("totalExecTime"),
});

export type GetQueryLogsDto = z.infer<typeof getQueryLogsDto>;
