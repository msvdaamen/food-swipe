import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";
import { getMeasurementsQueryOptions } from "./get-measurements";

export type UpdateMeasurementInput = {
  measurementId: number;
  data: {
    name?: string;
    abbreviation?: string;
  };
};

export const updateMeasurement = async (payload: UpdateMeasurementInput) => {
  const response = await api.fetch(
    `/v1/measurements/${payload.measurementId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<Measurement>;
};

export const useUpdateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMeasurement,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
    },
  });
};
