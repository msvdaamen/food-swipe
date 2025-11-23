import type { Pagination } from "./types/pagination.ts";

export function CreatePagination(
	total: number,
	limit: number,
	currentPage: number,
): Pagination {
	return {
		perPage: limit,
		totalPages: Math.ceil(total / limit),
		currentPage,
		total,
	};
}
