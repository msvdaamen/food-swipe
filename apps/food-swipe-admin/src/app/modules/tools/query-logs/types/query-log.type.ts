export type QueryLog = {
  queryid: number;
  user: string;
  query: string;
  calls: number;
  totalExecTime: number;
  rows: number;
};
