export const measurementKeys = {
  all: ["measurements"] as const,
  list: () => [...measurementKeys.all] as const,
  detail: (id: number) => [...measurementKeys.all, id] as const,
};
