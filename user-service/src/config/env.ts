import "dotenv/config";
import type { StringValue } from "ms";

export const env = {
  port: Number(process.env.PORT) || 3002,
  nodeEnv: process.env.NODE_ENV || "development",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_DATABASE || "user_service_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as StringValue,
  },
};
