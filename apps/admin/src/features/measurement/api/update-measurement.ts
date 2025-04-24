import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { getMeasurementsQueryOptions } from "./get-measurements";


export type UpdateMeasurementInput = {
    measurementId: number;
    data: {
        name?: string;
        abbreviation?: string;
    }
}

export const updateMeasurement = (payload: UpdateMeasurementInput) => {
    return api.put<Measurement>(`/v1/measurements/${payload.measurementId}`, payload.data);
}

export const useUpdateMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMeasurement,
        onSuccess: (data) => {
            queryClient.setQueriesData<Measurement[]>(
                {
                  queryKey: getMeasurementsQueryOptions().queryKey,
                },
                (old) =>
                  old?.map((measurement) =>
                    measurement.id === data.id ? data : measurement
                  )
              );
        }
    });
}