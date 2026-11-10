import "dotenv/config";
import express, { type Express, type Request, type Response } from 'express';
import router from './routes/supplierRoutes.ts';
import dotenv from "dotenv";
import errorHandling from "./middleware/errorHandler.ts";
import cors from 'cors';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 3001

// Match gateway: cropped image_url data URLs can exceed Express's default 100kb JSON limit.
app.use(express.json({ limit: "2mb" }));

app.use(cors({ origin: process.env.CORS_ORIGIN }));

// Routes 
app.use('/api/suppliers/', router)

app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});