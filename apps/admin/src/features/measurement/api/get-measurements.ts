import { api } from "@/lib/api";
import { Measurement } from "../types/measurement.type";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getMeasurements = () => {
    return api.get<Measurement[]>("/v1/measurements");
}

export const getMeasurementsQueryOptions = () => {
    return queryOptions({
        queryKey: ["measurements"],
        queryFn: getMeasurements
    });
}
export const useMeasurements = () => useQuery(getMeasurementsQueryOptions())