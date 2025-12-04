import { queryOptions, useQuery } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { api } from "@/lib/api";


export const getMeasurement = async (id: number) => {
    const response = await api.fetch(`/v1/measurements/${id}`);
    return response.json() as Promise<Measurement>;
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
