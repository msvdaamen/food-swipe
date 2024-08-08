export type CursorPagination<T, CT = number, C = CT | null> = {
  data: T[];
  cursor: C;
};
