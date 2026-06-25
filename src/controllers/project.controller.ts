import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { projectService } from '../services';
import {
  createProjectSchema,
  updateProjectSchema,
  projectFilterSchema,
} from '../dto/project';
import { parsePagination } from '../utils/pagination';

export const projectController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    const filterResult = projectFilterSchema.safeParse(req.query);
    const filters = filterResult.success ? filterResult.data : {};

    const pagination = parsePagination(req.query, [
      'id',
      'title',
      'status',
      'createdAt',
      'updatedAt',
    ]);
    const result = await projectService.findAll(
      { ...filters, userId: req.user!.id } as any,
      pagination,
    );
    res.json(result);
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const project = await projectService.findById(Number(req.params.id));
    if (!project || project.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const project = await projectService.create({
      ...result.data,
      user: { id: req.user!.id },
    } as any);
    res.status(201).json(project);
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const result = updateProjectSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const existingProject = await projectService.findById(
      Number(req.params.id),
    );
    if (!existingProject || existingProject.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const project = await projectService.update(
      Number(req.params.id),
      result.data,
    );
    res.json(project);
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const existingProject = await projectService.findById(
      Number(req.params.id),
    );
    if (!existingProject || existingProject.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await projectService.delete(Number(req.params.id));
    res.status(200).json({ message: 'Project deleted successfully' });
  },
};
