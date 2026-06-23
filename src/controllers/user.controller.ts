import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { createUserSchema, updateUserSchema } from '../dto/user.dto';
import { parsePagination } from '../utils/pagination';

export const userController = {
  async getAll(req: Request, res: Response): Promise<void> {
    const pagination = parsePagination(req.query);
    const result = await userService.findAll(pagination);
    res.json(result);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const user = await userService.findById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  },

  async create(req: Request, res: Response): Promise<void> {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { name, email, password } = result.data;

    const existing = await userService.findByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const user = await userService.create({ name, email, password });
    res.status(201).json(user);
  },

  async update(req: Request, res: Response): Promise<void> {
    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const user = await userService.update(Number(req.params.id), result.data);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  },

  async delete(req: Request, res: Response): Promise<void> {
    const deleted = await userService.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  },
};
