import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";

export type CreateMeasurementInput = {
    name: string;
    abbreviation: string;
}


export const createMeasurement = (payload: CreateMeasurementInput) => {
    return api.post<Measurement>("/v1/measurements", payload);
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