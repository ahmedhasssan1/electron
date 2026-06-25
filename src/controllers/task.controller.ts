import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { taskService, projectService } from '../services';
import {
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
} from '../dto/task';
import { parsePagination } from '../utils/pagination';

export const taskController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    const filterResult = taskFilterSchema.safeParse(req.query);
    const filters = filterResult.success ? filterResult.data : {};
    const pagination = parsePagination(req.query, [
      'id',
      'title',
      'status',
      'priority',
      'dueDate',
      'createdAt',
      'updatedAt',
    ]);

    const result = await taskService.findAll(filters, pagination);
    res.json(result);
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const task = await taskService.findById(Number(req.params.id));
    if (!task || task.project?.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    const projectId = Number(req.params.projectId);
    const project = await projectService.findById(projectId);
    if (!project || project.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const task = await taskService.create(projectId, result.data);
    res.status(201).json(task);
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const existingTask = await taskService.findById(Number(req.params.id));
    if (!existingTask || existingTask.project?.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const task = await taskService.update(Number(req.params.id), result.data);
    res.json(task);
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const existingTask = await taskService.findById(Number(req.params.id));
    if (!existingTask || existingTask.project?.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await taskService.delete(Number(req.params.id));
    res.status(204).send();
  },

  async getProjectTasks(req: AuthRequest, res: Response): Promise<void> {
    const projectId = Number(req.params.projectId);
    const project = await projectService.findById(projectId);
    if (!project || project.user?.id !== req.user!.id) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const filterResult = taskFilterSchema.safeParse(req.query);
    const filters = filterResult.success ? filterResult.data : {};
    const pagination = parsePagination(req.query, [
      'id',
      'title',
      'status',
      'priority',
      'dueDate',
      'createdAt',
      'updatedAt',
    ]);

    const result = await taskService.findAllByProject(
      projectId,
      filters,
      pagination,
    );
    res.json(result);
  },
};
