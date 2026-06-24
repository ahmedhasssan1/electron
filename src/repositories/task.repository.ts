import { Repository, FindOptionsWhere } from 'typeorm';
import { Task } from '../models/Task';
import { IBaseRepository } from './interfaces/base-repository.interface';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { AppDataSource } from '../config/database';

export interface ITaskRepository extends IBaseRepository<Task> {
  findAllByProject(
    projectId: number,
    filters: FindOptionsWhere<Task>,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>>;
}

export class TaskRepository implements ITaskRepository {
  private readonly repo: Repository<Task>;

  constructor() {
    this.repo = AppDataSource.getRepository(Task);
  }

  async findAll(
    filters: FindOptionsWhere<Task> = {},
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
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

  async findAllByProject(
    projectId: number,
    filters: FindOptionsWhere<Task>,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
    const where: FindOptionsWhere<Task> = {
      project: { id: projectId },
      ...filters,
    };

    const [data, total] = await this.repo.findAndCount({
      where,
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

  async findById(id: number): Promise<Task | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Task>): Promise<Task> {
    const task = this.repo.create(data);
    return this.repo.save(task);
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const task = await this.repo.findOneBy({ id });
    if (!task) return null;
    this.repo.merge(task, data);
    return this.repo.save(task);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
