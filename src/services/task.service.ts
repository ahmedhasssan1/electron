import { ITaskRepository } from '../repositories/task.repository';
import { Task } from '../models/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilterDTO } from '../dto/task';
import { FindOptionsWhere } from 'typeorm';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

export class TaskService {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async findAll(
    filters: TaskFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
    const where: FindOptionsWhere<Task> = {};

    if (filters.status) Object.assign(where, { status: filters.status });
    if (filters.priority) Object.assign(where, { priority: filters.priority });

    return this.taskRepo.findAll(where, params);
  }

  async findAllByProject(
    projectId: number,
    filters: TaskFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Task>> {
    const where: FindOptionsWhere<Task> = {};

    if (filters.status) Object.assign(where, { status: filters.status });
    if (filters.priority) Object.assign(where, { priority: filters.priority });

    return this.taskRepo.findAllByProject(projectId, where, params);
  }

  async findById(id: number): Promise<Task | null> {
    return this.taskRepo.findById(id);
  }

  async create(projectId: number, data: CreateTaskDTO): Promise<Task> {
    return this.taskRepo.create({
      ...data,
      project: { id: projectId },
    } as Partial<Task>);
  }

  async update(id: number, data: UpdateTaskDTO): Promise<Task | null> {
    return this.taskRepo.update(id, data as Partial<Task>);
  }

  async delete(id: number): Promise<boolean> {
    return this.taskRepo.delete(id);
  }
}
