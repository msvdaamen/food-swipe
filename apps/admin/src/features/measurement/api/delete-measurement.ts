import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";


export const deleteMeasurement = (id: number) => {
    return api.delete(`/v1/measurements/${id}`);
}

export const useDeleteMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMeasurement,
        onSuccess: (_, id) => {
            queryClient.setQueriesData<Measurement[]>(
                {
                    queryKey: getMeasurementsQueryOptions().queryKey,
                },
                (old) => old?.filter((measurement) => measurement.id !== id)
            );
        }
    });
}