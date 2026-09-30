import "dotenv/config";
import express, { type Express, type Request, type Response } from 'express';
import router from './routes/supplierRoutes.ts';
import dotenv from "dotenv";
import errorHandling from "./middleware/errorHandler.ts";
import cors from 'cors';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3001

app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/api/suppliers/', router)

app.use(errorHandling)

// Server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});