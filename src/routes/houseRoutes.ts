import express from 'express';
const router = express.Router();

import { createHouse } from '../controllers/createhouseController.ts';
import { fetchHouseInfo } from '../controllers/fetchhouseController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/', authenticate, createHouse);
router.get('/', authenticate, fetchHouseInfo);

export { router as houseRoutes };
