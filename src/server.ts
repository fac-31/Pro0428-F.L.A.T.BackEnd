import dotenv from 'dotenv';
dotenv.config();

import app from './app.ts';

// Convert PORT to number, with fallback to 5000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
