import { Repository, FindOptionsWhere } from 'typeorm';
import { Project } from '../models/Project';
import { IBaseRepository } from './interfaces/base-repository.interface';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { AppDataSource } from '../config/database';

export class ProjectRepository implements IBaseRepository<Project> {
  private readonly repo: Repository<Project>;

  constructor() {
    this.repo = AppDataSource.getRepository(Project);
  }

  async findAll(
    filters: FindOptionsWhere<Project> = {},
    params: PaginationParams,
  ): Promise<PaginatedResult<Project>> {
    const [data, total] = await this.repo.findAndCount({
      where: filters,
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

  async findById(id: number): Promise<Project | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Project>): Promise<Project> {
    const project = this.repo.create(data);
    return this.repo.save(project);
  }

  async update(id: number, data: Partial<Project>): Promise<Project | null> {
    const project = await this.repo.findOneBy({ id });
    if (!project) return null;
    this.repo.merge(project, data);
    return this.repo.save(project);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
