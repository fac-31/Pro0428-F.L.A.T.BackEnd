import express from 'express';
const router = express.Router();

import { createTask } from '../controllers/cleaningController.ts';

router.get('/create-task', createTask);

export { router as cleaningRoutes };
