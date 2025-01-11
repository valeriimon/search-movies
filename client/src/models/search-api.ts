export interface SearchRequest {
  query: string;
  page: number;
  page_size: number;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
}