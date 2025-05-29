import express from 'express';
const router = express.Router();

import { createBill } from '../controllers/createbillController.ts';
import { fetchBills } from '../controllers/fetchbillController.ts';

router.post('/', createBill);
router.get('/', fetchBills);

export { router as billRoutes };
