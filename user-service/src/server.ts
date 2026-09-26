import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { env } from "./config/env.js";
import { query } from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app: Express = express();

app.use(express.json());

app.get("/health", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await query("SELECT 1");

    res.status(200).json({
      status: "UP",
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`Server running on PORT ${env.port}`);
});