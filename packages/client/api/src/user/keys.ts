export const userKeys = {
  all: ["users"] as const,
  list: (payload: unknown) => [...userKeys.all, payload] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};
