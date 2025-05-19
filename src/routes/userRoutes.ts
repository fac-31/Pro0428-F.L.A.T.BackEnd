import express from 'express';
const router = express.Router();

import { getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.ts';

router.get('/:id', getUserById);
router.get('/create-user', createUser);
router.get('/:id/update-user', updateUser);
router.get('/:id/delete-user', deleteUser);

export { router as userRoutes };
