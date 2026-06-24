import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router({ mergeParams: true });

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.get('/projects/:projectId', taskController.getProjectTasks);
router.post(
  '/projects/:projectId',
  requireRole(UserRole.ADMIN),
  taskController.create,
);
router.patch('/:id', requireRole(UserRole.ADMIN), taskController.update);
router.delete('/:id', requireRole(UserRole.ADMIN), taskController.delete);

export default router;
