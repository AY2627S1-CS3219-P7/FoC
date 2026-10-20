require("./app/config/env");

const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const outboxRelay = require("./app/events/outboxRelay");
const { notFoundHandler, errorHandler } = require("./app/middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Liveness probe, used by the Docker healthcheck (intentionally unauthenticated)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

require("./app/routes/orderRoutes")(app);


app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

// Only accept traffic once the database is reachable and the schema exists.
// If that fails, exit non-zero so the container visibly fails instead of
// running in a half-working state.
async function start() {
  let server;
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log("Database connected and synced.");

    outboxRelay.start();

    server = app.listen(PORT, () => {
      console.log(`Order service listening on port ${PORT}.`);
    });
  } catch (err) {
    console.error("Failed to start: " + err.message);
    process.exit(1);
  }


  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(); // stop accepting new connections
    await outboxRelay.stop();
    await db.sequelize.close();
    process.exit(0);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start();