export type GetIngredientsRequest = {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page: number;
  amount: number;
};
