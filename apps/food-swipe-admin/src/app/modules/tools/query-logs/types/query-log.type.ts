export type QueryLog = {
  queryid: number;
  user: string;
  query: string;
  calls: number;
  totalExecTime: number;
  maxExecTime: number;
  minExecTime: number;
  meanExecTime: number;
  rows: number;
};
