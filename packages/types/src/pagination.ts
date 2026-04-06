export type Pagination = {
  perPage: number;
  totalPages: number;
  currentPage: number;
  total: number;
};

export type PaginatedData<T> = {
  data: T[];
  pagination: Pagination;
};
