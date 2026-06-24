import { IBaseRepository } from '../repositories/interfaces/base-repository.interface';
import { Project } from '../models/Project';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilterDTO,
} from '../dto/project';
import { FindOptionsWhere } from 'typeorm';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

export class ProjectService {
  constructor(private readonly projectRepo: IBaseRepository<Project>) {}

  async findAll(
    filters: ProjectFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Project>> {
    const where: FindOptionsWhere<Project> = {};

    if (filters.status) {
      Object.assign(where, { status: filters.status });
    }

    return this.projectRepo.findAll(where, params);
  }

  async findById(id: number): Promise<Project | null> {
    return this.projectRepo.findById(id);
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    return this.projectRepo.create(data as Partial<Project>);
  }

  async update(id: number, data: UpdateProjectDTO): Promise<Project | null> {
    return this.projectRepo.update(id, data as Partial<Project>);
  }

  async delete(id: number): Promise<boolean> {
    return this.projectRepo.delete(id);
  }
}
