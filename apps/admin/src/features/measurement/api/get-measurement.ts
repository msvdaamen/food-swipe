import { queryOptions, useQuery } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";


export const getMeasurement = (id: number) => {
    return api.get<Measurement>(`/v1/measurements/${id}`);
}

export const getMeasurementQueryOptions = (id: number) => {
    return queryOptions({
        queryKey: ["measurements", id],
        queryFn: () => getMeasurement(id),
    });
}

export const useMeasurement = (id: number) => {
    return useQuery(getMeasurementQueryOptions(id));
}