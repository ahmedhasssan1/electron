import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', requireRole(UserRole.ADMIN), projectController.create);
router.patch('/:id', requireRole(UserRole.ADMIN), projectController.update);
router.delete('/:id', requireRole(UserRole.ADMIN), projectController.delete);

export default router;
