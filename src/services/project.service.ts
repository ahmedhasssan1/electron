import { AppDataSource } from '../config/database';
import { Project } from '../models/Project';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilterDTO,
} from '../dto/project.dto';
import { FindOptionsWhere } from 'typeorm';
import { PaginationParams, PaginatedResult } from '../utils/pagination';

const projectRepository = AppDataSource.getRepository(Project);

export const projectService = {
  async findAll(
    filters: ProjectFilterDTO,
    params: PaginationParams,
  ): Promise<PaginatedResult<Project>> {
    const where: FindOptionsWhere<Project> = {};

    if (filters.status) {
      Object.assign(where, { status: filters.status });
    }

    const [data, total] = await projectRepository.findAndCount({
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

  async findById(id: number): Promise<Project | null> {
    return projectRepository.findOneBy({ id });
  },

  async create(data: CreateProjectDTO): Promise<Project> {
    const project = projectRepository.create(data as Partial<Project>);
    return projectRepository.save(project);
  },

  async update(id: number, data: UpdateProjectDTO): Promise<Project | null> {
    const project = await projectRepository.findOneBy({ id });
    if (!project) return null;

    projectRepository.merge(project, data as Partial<Project>);
    return projectRepository.save(project);
  },

  async delete(id: number): Promise<boolean> {
    const result = await projectRepository.delete(id);
    return result.affected !== 0;
  },
};
