/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: Centralised, validated environment configuration
 *
 * Every setting the service needs beyond the database lives here, so a
 * missing variable fails at startup with a clear message instead of
 * surfacing later as a confusing runtime error.
 * (Database settings stay in db.config.js, unchanged.)
 */

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const int = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`);
  }
  return n;
};

module.exports = {
  // Must match the secret the user service signs tokens with
  JWT_SECRET: required("JWT_SECRET"),

  // RabbitMQ (e.g. amqp://user:pass@rabbitmq:5672)
  RABBITMQ_URL: required("RABBITMQ_URL"),
  RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE || "orders",

  // Credit service, called directly (and only) for reservations
  CREDIT_SERVICE_URL: required("CREDIT_SERVICE_URL").replace(/\/+$/, ""),
  CREDIT_TIMEOUT_MS: int("CREDIT_TIMEOUT_MS", 5000),
  // Optional shared secret proving the caller is the order service
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || "",

  // Outbox relay tuning
  OUTBOX_POLL_MS: int("OUTBOX_POLL_MS", 2000),
  OUTBOX_BATCH_SIZE: int("OUTBOX_BATCH_SIZE", 50)
};