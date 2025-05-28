import express from 'express';
const router = express.Router();

import { loginUser } from '../controllers/loginController.ts';

router.post('/login', loginUser);

export { router as loginRoutes };
