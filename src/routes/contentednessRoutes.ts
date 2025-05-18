import express from 'express';
const router = express.Router();

import { createContentedness } from '../controllers/contentednessController.ts';

router.get('/create-contentedness', createContentedness);

export { router as contentednessRoutes };
