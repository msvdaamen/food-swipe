export const ingredientKeys = {
  all: ["ingredients"] as const,
  list: (payload: unknown) => [...ingredientKeys.all, payload] as const,
};
