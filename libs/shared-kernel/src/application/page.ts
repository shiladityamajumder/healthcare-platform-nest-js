export interface PageRequest {
  page: number;
  pageSize: number;
}
export interface PageResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}
