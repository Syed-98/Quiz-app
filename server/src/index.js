import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './utils/db.js';
import questionRoutes from './routes/questionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`); // eslint-disable-line no-console
    });
  } catch (error) {
    console.error('Failed to start server', error); // eslint-disable-line no-console
    process.exit(1);
  }
};

startServer();

