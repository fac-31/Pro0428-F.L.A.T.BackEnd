import express from 'express';
const router = express.Router();

import { createEmail } from '../controllers/emailController.ts';

router.get('/create-email', createEmail);

export { router as emailRoutes };
