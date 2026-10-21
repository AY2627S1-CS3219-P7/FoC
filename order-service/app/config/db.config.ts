import { required } from "./env.ts";

export default {
  HOST: process.env.DB_HOST || "localhost",
  PORT: Number(process.env.DB_PORT) || 5432,
  USER: required("DB_USER"),
  PASSWORD: required("DB_PASSWORD"),
  DB: required("DB_DATABASE"),
  dialect: "postgres" as const,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
