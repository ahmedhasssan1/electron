export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function parsePagination(query: Record<string, any>): PaginationParams {
  return {
    page: Math.max(1, Number(query.page) || 1),
    limit: Math.min(100, Math.max(1, Number(query.limit) || 10)),
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'desc' ? 'DESC' : 'ASC',
  };
}
