// src/routes/welcomeRoutes.ts
import express from 'express';
const router = express.Router();
import { saveWelcomePreferences } from '../controllers/welcomePreferencesController.ts';
import { authenticate } from '../middleware/authenticate.ts';

router.post('/save-preferences', authenticate, saveWelcomePreferences);

export { router as welcomeRoutes };
