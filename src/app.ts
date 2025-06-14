import express from 'express';
import cors from 'cors';

import { userRoutes } from './routes/userRoutes.ts';
import { houseRoutes } from './routes/houseRoutes.ts';
import { tenureRoutes } from './routes/tenureRoutes.ts';
import { emailRoutes } from './routes/emailRoutes.ts';
import { contentednessRoutes } from './routes/contentednessRoutes.ts';
import { cleaningRoutes } from './routes/cleaningRoutes.ts';
import { billRoutes } from './routes/billRoutes.ts';
import { loginRoutes } from './routes/loginRoutes.ts';
import { welcomeRoutes } from './routes/welcomeRoutes.ts';
import { testDBRoutes } from './routes/testDBRoutes.ts';

const app = express();

app.use(
  cors({
    origin: 'https://pro0428-f-l-a-t-frontend.onrender.com',
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

export default app;
