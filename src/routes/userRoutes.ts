import express from 'express';
const router = express.Router();

import { createUser } from '../controllers/userController.ts';

router.get('/create-user', createUser);

export { router as userRoutes };
