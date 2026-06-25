import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../models/User';
import { IBaseRepository } from './interfaces/base-repository.interface';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { AppDataSource } from '../config/database';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updateRefreshToken(userId: number, token: string | null): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private readonly repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async findAll(
    _filters: FindOptionsWhere<User> = {},
    params: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    const [data, total] = await this.repo.findAndCount({
      order: { [params.sortBy]: params.sortOrder },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    });

    const totalPages = Math.ceil(total / params.limit);

    return {
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (!user) return null;
    this.repo.merge(user, data);
    return this.repo.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }

  async updateRefreshToken(
    userId: number,
    token: string | null,
  ): Promise<void> {
    await this.repo.update(userId, { refreshToken: token } as Partial<User>);
  }
}
