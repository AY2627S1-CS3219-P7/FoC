const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: process.env.DB_LOGGING === "true" ? console.log : false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Order = require("./orderModel.js")(sequelize, Sequelize);
db.OutboxEvent = require("./outboxEventModel.js")(sequelize, Sequelize);

module.exports = db;
