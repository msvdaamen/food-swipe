import { type } from "arktype";

export const getIngredientsDto = type({
  "search?": "string",
  "sort?": "'name'",
  "order?": "'asc' | 'desc'",
  page: type("string | number").pipe((value) => {
    const number = typeof value === "string" ? parseInt(value) : value;
    return isNaN(number) ? 1 : number;
  }),
  limit: type("string | number").pipe((value) => {
    const number = typeof value === "string" ? parseInt(value) : value;
    if (isNaN(number)) return 10;
    if (number < 1) return 1;
    if (number > 100) return 100;
    return number;
  }),
});

export type GetIngredientsDto = typeof getIngredientsDto.infer;
