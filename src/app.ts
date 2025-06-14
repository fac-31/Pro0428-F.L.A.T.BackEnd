import express from 'express';
import cors from 'cors';

import { userRoutes } from './routes/userRoutes.js';
import { houseRoutes } from './routes/houseRoutes.js';
import { tenureRoutes } from './routes/tenureRoutes.js';
import { emailRoutes } from './routes/emailRoutes.js';
import { contentednessRoutes } from './routes/contentednessRoutes.js';
import { cleaningRoutes } from './routes/cleaningRoutes.js';
import { billRoutes } from './routes/billRoutes.js';
import { loginRoutes } from './routes/loginRoutes.js';
import { welcomeRoutes } from './routes/welcomeRoutes.js';
import { testDBRoutes } from './routes/testDBRoutes.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/houses', houseRoutes);
app.use('/tenures', tenureRoutes);
app.use('/emails', emailRoutes);
app.use('/contentedness', contentednessRoutes);
app.use('/api', cleaningRoutes);
app.use('/api', billRoutes);
app.use('/api', loginRoutes);
app.use('/api', testDBRoutes);
app.use('/api', welcomeRoutes);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/', (_req, res) => {
  res.send('API is running');
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Give the logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

export default app;
