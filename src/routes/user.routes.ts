import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', requireRole(UserRole.ADMIN), userController.getAll);
router.get('/:id', requireRole(UserRole.ADMIN), userController.getById);
router.post('/', requireRole(UserRole.ADMIN), userController.create);
router.patch('/:id', requireRole(UserRole.ADMIN), userController.update);
router.delete('/:id', requireRole(UserRole.ADMIN), userController.delete);

export default router;
