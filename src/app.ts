import express from 'express';
import cors from 'cors';

import { userRoutes } from './routes/userRoutes.ts';
import { houseRoutes } from './routes/houseRoutes.ts';
import { tenureRoutes } from './routes/tenureRoutes.ts';
import { emailRoutes } from './routes/emailRoutes.ts';
import { contentednessRoutes } from './routes/contentednessRoutes.ts';
import { cleaningRoutes } from './routes/cleaningRoutes.ts';
import { billRoutes } from './routes/billRoutes.ts';

import { testDBRoutes } from './routes/testDBRoutes.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/houses', houseRoutes);
app.use('/tenures', tenureRoutes);
app.use('/emails', emailRoutes);
app.use('/contentedness', contentednessRoutes);
app.use('/cleaning', cleaningRoutes);
app.use('/bills', billRoutes);


app.use('/api', testDBRoutes);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/', (_req, res) => {
  res.send('API is running');
});

export default app;
