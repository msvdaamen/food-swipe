export type CursorPagination<T, C extends string | number | null> = {
  data: T[];
  cursor: C;
};
