import express, { type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/index.js';
// import { errorHandler } from './middleware/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.send('OK');
});

app.use('/api/auth', authRoutes);

export default app;

// app.use(errorHandler);
