import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
const router = express.Router();

import { createCleaningTask } from '../controllers/createcleaningtaskController.ts';
import { fetchCleaningTasks } from '../controllers/fetchcleaningtaskController.ts';

router.get('/fetch-cleaning', authenticate, fetchCleaningTasks);
router.post('/create-cleaning', createCleaningTask);

export { router as cleaningRoutes };
