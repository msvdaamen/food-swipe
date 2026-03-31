import type {Pagination} from "./pagination.ts";

export type PaginatedData<T> = {
    data: T[];
    pagination: Pagination;
};