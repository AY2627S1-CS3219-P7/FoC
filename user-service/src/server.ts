import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

// Server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});