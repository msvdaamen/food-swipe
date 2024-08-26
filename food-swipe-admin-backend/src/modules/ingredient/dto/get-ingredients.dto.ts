import {z} from "zod";

export const getIngredientsDto = z.object({
    search: z.string(),
    sort: z.union([z.literal('name'), z.literal('name')]),
    order: z.union([z.literal('asc'), z.literal('desc')]),
    page: z.preprocess((value) => {
        const number = parseInt(value as string);
        return isNaN(number) ? 1 : number
    }, z.number().gte(1)),
    amount: z.preprocess((value) => {
        const number = parseInt(value as string);
        return isNaN(number) ? 10 : number
    }, z.number().gte(1).lte(100))
});

export type GetIngredientsDto = z.infer<typeof getIngredientsDto>;