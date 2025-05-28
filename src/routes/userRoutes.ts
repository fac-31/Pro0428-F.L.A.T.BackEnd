import express from 'express';
const router = express.Router();

import { createUser, updateUser, deleteUser } from '../controllers/userController.ts';
import { fetchUserProfile } from '../controllers/fetchuserController.ts';

router.get('/create-user', createUser);
router.get('/:id/update-user', updateUser);
router.get('/:id/delete-user', deleteUser);
router.get('/get-user',fetchUserProfile);

export { router as userRoutes };
