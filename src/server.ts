import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
