import { Pagination } from './pagination';

export type PaginatedData<T> = {
  data: T[];
  pagination: Pagination;
};
