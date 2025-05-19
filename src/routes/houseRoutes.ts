import express from 'express';
const router = express.Router();

import { createHouse } from '../controllers/houseController.ts';

router.get('/create-house', createHouse);

export { router as houseRoutes };
