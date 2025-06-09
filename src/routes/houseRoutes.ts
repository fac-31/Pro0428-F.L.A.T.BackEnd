import express from 'express';
const router = express.Router();

import { createHouse } from '../controllers/createhouseController.ts';
import { fetchHouseInfo, fetchAllHouses } from '../controllers/fetchhouseController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/create', authenticate, createHouse);
router.get('/info', authenticate, fetchHouseInfo);
router.get('/list', authenticate, fetchAllHouses);

export { router as houseRoutes };
