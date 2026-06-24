import { Request, Response } from 'express';
import { projectService } from '../services';
import {
  createProjectSchema,
  updateProjectSchema,
  projectFilterSchema,
} from '../dto/project';
import { parsePagination } from '../utils/pagination';

export const projectController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const filterResult = projectFilterSchema.safeParse(req.query);
    const filters = filterResult.success ? filterResult.data : {};
    const pagination = parsePagination(req.query);
    const result = await projectService.findAll(filters, pagination);
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const project = await projectService.findById(Number(req.params.id));
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  },

  async create(req: Request, res: Response): Promise<void> {
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const project = await projectService.create(result.data);
    res.status(201).json(project);
  },

  async update(req: Request, res: Response): Promise<void> {
    const result = updateProjectSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const project = await projectService.update(
      Number(req.params.id),
      result.data,
    );
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const deleted = await projectService.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  },
};
