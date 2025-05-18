import express from 'express';
const router = express.Router();

import { createTenure } from '../controllers/tenureController.ts';

router.get('/create-tenure', createTenure);

export { router as tenureRoutes };
