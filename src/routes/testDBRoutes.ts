import express from 'express';
const router = express.Router();

import { testDBConnection } from '../controllers/dbtestController.ts';

router.get('/test-db', testDBConnection);

export { router as testDBRoutes };