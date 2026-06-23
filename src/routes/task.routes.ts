import { Router } from 'express';
import { taskController } from '../controllers/task.controller';

const router = Router({ mergeParams: true });

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/projects/:projectId', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
