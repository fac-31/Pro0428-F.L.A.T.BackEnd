import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
const router = express.Router();

import { createContentedness } from '../controllers/contentednessController.ts';

router.get('/create-contentedness', authenticate, createContentedness);

export { router as contentednessRoutes };
