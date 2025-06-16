import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
const router = express.Router();

import { createContentedness, fetchContentedness } from '../controllers/contentednessController.ts';

router.get('/fetch-contentedness', authenticate, fetchContentedness);
router.post('/create-contentedness', authenticate, createContentedness);

export { router as contentednessRoutes };
