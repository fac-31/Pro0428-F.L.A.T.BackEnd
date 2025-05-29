import express from 'express';
const router = express.Router();

import { createCleaningTask } from '../controllers/createcleaningtaskController.ts';
import { fetchCleaningTasks } from '../controllers/fetchcleaningtaskController.ts';

router.post('/', createCleaningTask);
router.get('/', fetchCleaningTasks);

export { router as cleaningRoutes };
