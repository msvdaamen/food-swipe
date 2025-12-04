import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";

export type CreateMeasurementInput = {
    name: string;
    abbreviation: string;
}


export const createMeasurement = async (payload: CreateMeasurementInput) => {
    const response = await api.fetch("/v1/measurements", {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json() as Promise<Measurement>;
}

export const useCreateMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeasurement,
        onSuccess: (data) => {
        queryClient.setQueriesData<Measurement[]>(
            {
            queryKey: getMeasurementsQueryOptions().queryKey,
            },
            (old) => [...(old || []), data]
        );
        },
    });
}
