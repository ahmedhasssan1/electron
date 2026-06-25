import { Router } from 'express';
import { taskController } from '../controllers/task.controller';

const router = Router({ mergeParams: true });

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.get('/projects/:projectId', taskController.getProjectTasks);
router.post(
  '/projects/:projectId',
  taskController.create,
);
router.patch('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
