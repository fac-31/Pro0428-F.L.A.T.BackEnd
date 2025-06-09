import express from 'express';
const router = express.Router();

import { loginUser, logoutUser } from '../controllers/loginController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser);

export { router as loginRoutes };
