import express from 'express';
const router = express.Router();

import { loginUser, logoutUser, refreshToken } from '../controllers/loginController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser);
router.post('/refresh-token', authenticate, refreshToken);

export { router as loginRoutes };
