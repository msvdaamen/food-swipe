import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";
import { getMeasurementsQueryOptions } from "./get-measurements";


export const deleteMeasurement = async (id: number) => {
    const response = await api.fetch(`/v1/measurements/${id}`, {
        method: 'DELETE',
    });
    return response.json() as Promise<Measurement>;
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
