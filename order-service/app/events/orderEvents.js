/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: Order event envelope and outbox recording
 *
 */

const { randomUUID } = require("crypto");
const { OutboxEvent } = require("../models");

const EVENT_TYPES = Object.freeze({
  ORDER_CANCELLED: "ORDER_CANCELLED", // credit service: release the reservation
  ORDER_COMPLETED: "ORDER_COMPLETED" // credit service: transfer requester -> courier
});

function buildOrderEvent(eventType, order) {
  return {
    event_id: randomUUID(),
    event_type: eventType,
    timestamp: new Date().toISOString(),
    data: {
      order_id: order.order_id,
      requester_id: order.requester_id,
      courier_id: order.courier_id ?? null,
      credit_amount: order.credit_amount
    }
  };
}

// Writes the event to the outbox. Pass the SAME transaction as the order
// status change so both commit or roll back together.
async function recordOrderEvent(eventType, order, transaction) {
  const event = buildOrderEvent(eventType, order);
  await OutboxEvent.create(
    { event_id: event.event_id, event_type: eventType, payload: event },
    { transaction }
  );
  return event;
}

module.exports = { EVENT_TYPES, buildOrderEvent, recordOrderEvent };