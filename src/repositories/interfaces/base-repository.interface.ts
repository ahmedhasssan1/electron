import { PaginationParams, PaginatedResult } from '../../utils/pagination';
import { FindOptionsWhere } from 'typeorm';

/**
 * Interface Segregation Principle: split into read/write focused interfaces.
 * Clients should not depend on methods they don't use.
 */

export interface IReadRepository<T> {
  findAll(
    filters?: FindOptionsWhere<T>,
    params?: PaginationParams,
  ): Promise<PaginatedResult<T>>;
  findById(id: number): Promise<T | null>;
}

export interface IWriteRepository<T> {
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

export interface IBaseRepository<T>
  extends IReadRepository<T>, IWriteRepository<T> {}
