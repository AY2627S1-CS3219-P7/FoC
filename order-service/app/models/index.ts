import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.ts";
import defineOrder from "./orderModel.ts";
import defineOutboxEvent from "./outboxEventModel.ts";

export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
});

export const Order = defineOrder(sequelize);
export const OutboxEvent = defineOutboxEvent(sequelize);