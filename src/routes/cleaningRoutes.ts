import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
const router = express.Router();

import { createCleaningTask } from '../controllers/createcleaningtaskController.ts';
import { fetchCleaningTasks } from '../controllers/fetchcleaningtaskController.ts';
import { fetchSingleUserCleaningTasks } from '../controllers/fetchcleaningSingleUserTaskController.ts';
import { updateCleaningTaskStatus } from '../controllers/updateCleaningTaskController.ts';

router.get('/fetch-cleaning', authenticate, fetchCleaningTasks);
router.get('/fetch-cleaning-user', authenticate, fetchSingleUserCleaningTasks);
router.post('/update-cleaning-user', authenticate, updateCleaningTaskStatus);
router.post('/create-cleaning', createCleaningTask);

export { router as cleaningRoutes };
