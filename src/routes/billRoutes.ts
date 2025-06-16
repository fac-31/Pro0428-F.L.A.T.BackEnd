import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
const router = express.Router();

import { fetchBills } from '../controllers/fetchbillController.ts';
import { createBill } from '../controllers/createbillController.ts';

router.get('/fetch-bill', authenticate, fetchBills);
router.post('/create-bill', authenticate, createBill);

export { router as billRoutes };
