export const measurementKeys = {
  all: () => ["measurements"] as const,
  list: () => measurementKeys.all(),
  detail: (id: number) => [...measurementKeys.all(), id] as const
};
