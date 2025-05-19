import express from 'express';
const router = express.Router();

import { createBill } from '../controllers/billController.ts';

router.get('/create-bill', createBill);

export { router as billRoutes };
