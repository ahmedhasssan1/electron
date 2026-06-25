import { parsePagination, PaginationParams } from '../../utils/pagination';

describe('parsePagination', () => {
  it('should return defaults when given an empty query', () => {
    const result = parsePagination({});
    expect(result).toEqual<PaginationParams>({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'ASC',
    });
  });

  it('should Parse  valid query parameters', () => {
    const result = parsePagination({
      page: '3',
      limit: '25',
      sortBy: 'name',
      sortOrder: 'desc',
    });
    expect(result).toEqual<PaginationParams>({
      page: 3,
      limit: 25,
      sortBy: 'name',
      sortOrder: 'DESC',
    });
  });

  it('should clamp page to minimum 1', () => {
    const result = parsePagination({ page: '-5' });
    expect(result.page).toBe(1);
  });

  it('should clamp limit between 1 and 100', () => {
    const tooLow = parsePagination({ limit: '0' });
    expect(tooLow.limit).toBe(10);

    const tooHigh = parsePagination({ limit: '200' });
    expect(tooHigh.limit).toBe(100);

    const negative = parsePagination({ limit: '-5' });
    expect(negative.limit).toBe(1);
  });

  it('should default sortOrder to ASC for invalid values', () => {
    const result = parsePagination({ sortOrder: 'invalid' });
    expect(result.sortOrder).toBe('ASC');
  });

  it('should handle NaN gracefully by falling back to defaults', () => {
    const result = parsePagination({ page: 'abc', limit: 'xyz' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
