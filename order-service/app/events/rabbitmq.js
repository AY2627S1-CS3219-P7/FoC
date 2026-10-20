/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: RabbitMQ connection management and confirmed publishing
 *
 * - Topic exchange (default name "orders", durable). Routing key is the event
 *   type lower-cased with dots, e.g. ORDER_COMPLETED -> "order.completed".
 * - Publisher confirms: publish() resolves only once the broker has accepted
 *   the message.
 * - `mandatory`: if NO queue is bound to the routing key the broker returns
 *   the message and publish() rejects, so the event stays in the outbox
 *   instead of being silently dropped. (Consumers must declare + bind their
 *   queue before events can be delivered; see README.)
 * - Reconnects lazily: if the connection drops, the next publish reconnects.
 */

const amqp = require("amqplib");
const { RABBITMQ_URL, RABBITMQ_EXCHANGE } = require("../config/env");

const PUBLISH_TIMEOUT_MS = 10000;

let connection = null;
let channel = null;
let connecting = null;
const returned = new Set(); // messageIds the broker could not route

async function connect() {
  const conn = await amqp.connect(RABBITMQ_URL);
  conn.on("error", (err) => console.error(`RabbitMQ connection error: ${err.message}`));
  conn.on("close", () => {
    connection = null;
    channel = null;
  });

  const ch = await conn.createConfirmChannel();
  ch.on("error", (err) => console.error(`RabbitMQ channel error: ${err.message}`));
  ch.on("close", () => {
    channel = null;
  });
  ch.on("return", (msg) => returned.add(msg.properties.messageId));

  await ch.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });

  connection = conn;
  channel = ch;
  return ch;
}

function getChannel() {
  if (channel) return Promise.resolve(channel);
  if (!connecting) {
    connecting = connect().finally(() => {
      connecting = null;
    });
  }
  return connecting;
}

const routingKeyFor = (eventType) => eventType.toLowerCase().replace(/_/g, ".");

// Resolves once the broker confirms; rejects if it nacks, can't route, or times out.
async function publishEvent(event) {
  const ch = await getChannel();
  const routingKey = routingKeyFor(event.event_type);

  const confirmed = new Promise((resolve, reject) => {
    ch.publish(
      RABBITMQ_EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true, // survive a broker restart
        mandatory: true,
        contentType: "application/json",
        messageId: event.event_id, // consumers de-duplicate on this
        type: event.event_type,
        timestamp: Math.floor(Date.now() / 1000)
      },
      (err) => (err ? reject(err) : resolve())
    );
  });

  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Timed out waiting for broker confirmation")),
      PUBLISH_TIMEOUT_MS
    );
  });

  try {
    await Promise.race([confirmed, timeout]);
  } finally {
    clearTimeout(timer);
  }

  // The 'return' event arrives before the confirm for unroutable messages
  if (returned.delete(event.event_id)) {
    throw new Error(
      `No queue is bound to "${routingKey}" on exchange "${RABBITMQ_EXCHANGE}" (is the credit service consuming yet?)`
    );
  }
}

async function close() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
  } catch (err) {
    // Already closed; nothing to do on shutdown
  } finally {
    channel = null;
    connection = null;
  }
}

module.exports = { publishEvent, close, routingKeyFor };