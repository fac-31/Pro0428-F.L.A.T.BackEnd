import express from 'express';
const router = express.Router();

import { getUsers } from '../controllers/userController.ts';

router.get('/', getUsers);

export { router as userRoutes };
