import { api } from "@/lib/api";
import { Measurement } from "../types/measurement.type";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMeasurements = async () => {
    const response = await api.fetch("/v1/measurements");
    return response.json() as Promise<Measurement[]>;
}

export const getMeasurementsQueryOptions = () => {
    return queryOptions({
        queryKey: ["measurements"],
        queryFn: getMeasurements
    });
}
export const useMeasurements = () => useQuery(getMeasurementsQueryOptions())
