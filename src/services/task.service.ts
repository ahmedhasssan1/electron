import { AppDataSource } from '../config/database';
import { Task } from '../models/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilterDTO } from '../dto/task.dto';
import { FindOptionsWhere } from 'typeorm';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

const taskRepository = AppDataSource.getRepository(Task);

export const taskService = {
  async findAll(
    filters: TaskFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
    const where: FindOptionsWhere<Task> = {};

    if (filters.status) Object.assign(where, { status: filters.status });
    if (filters.priority) Object.assign(where, { priority: filters.priority });

    const [data, total] = await taskRepository.findAndCount({
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
  },

  async findAllByProject(
    projectId: number,
    filters: TaskFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
    const where: FindOptionsWhere<Task> = {
      project: { id: projectId },
    };

    if (filters.status) Object.assign(where, { status: filters.status });
    if (filters.priority) Object.assign(where, { priority: filters.priority });

    const [data, total] = await taskRepository.findAndCount({
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
  },

  async findById(id: number): Promise<Task | null> {
    return taskRepository.findOne({ where: { id } });
  },

  async create(projectId: number, data: CreateTaskDTO): Promise<Task> {
    const task = taskRepository.create({
      ...data,
      project: { id: projectId },
    } as Partial<Task>);
    return taskRepository.save(task);
  },

  async update(id: number, data: UpdateTaskDTO): Promise<Task | null> {
    const task = await taskRepository.findOneBy({ id });
    if (!task) return null;

    taskRepository.merge(task, data as Partial<Task>);
    return taskRepository.save(task);
  },

  async delete(id: number): Promise<boolean> {
    const result = await taskRepository.delete(id);
    return result.affected !== 0;
  },
};
