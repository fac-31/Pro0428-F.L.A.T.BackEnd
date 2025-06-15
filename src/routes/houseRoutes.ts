import express from 'express';
const router = express.Router();

import { createHouse } from '../controllers/createhouseController.ts';
import { fetchHouseInfo, fetchAllHouses } from '../controllers/fetchhouseController.ts';
import { joinHouse } from '../controllers/joinhouseController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/create', authenticate, createHouse);
router.post('/join', authenticate, joinHouse);
router.get('/info', authenticate, fetchHouseInfo);
router.get('/list', authenticate, fetchAllHouses);

export { router as houseRoutes };
