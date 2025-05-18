import express from 'express';
import cors from 'cors';

import { userRoutes } from './routes/userRoutes.ts';
import { testDBRoutes } from './routes/testDBRoutes.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/api', testDBRoutes);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;
