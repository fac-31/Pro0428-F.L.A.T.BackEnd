import dotenv from 'dotenv';
dotenv.config();

import app from './app.ts';

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
