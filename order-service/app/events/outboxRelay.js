/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: Background relay that publishes outbox rows to RabbitMQ
 *
 * Polls the outbox table and publishes unpublished events in order.
 * - Safe to run on several instances at once (cloud scaling): rows are
 *   claimed with FOR UPDATE SKIP LOCKED, so two instances never send the
 *   same row concurrently.
 * - kick() triggers an immediate flush after a status change so events go
 *   out in milliseconds; the poll interval is only the safety net.
 * - If RabbitMQ is down the API keeps working; events accumulate in the
 *   outbox and are sent when the broker returns.
 */

const { sequelize, OutboxEvent } = require("../models");
const { publishEvent, close: closeBroker } = require("./rabbitmq");
const { OUTBOX_POLL_MS, OUTBOX_BATCH_SIZE } = require("../config/env");

let timer = null;
let running = null; // promise of the in-flight run
let rerun = false;
let stopped = false;
let failing = false; // used to log only on state changes, not every poll

async function flushBatch() {
  return sequelize.transaction(async (t) => {
    const rows = await OutboxEvent.findAll({
      where: { published_at: null },
      order: [["created_at", "ASC"]],
      limit: OUTBOX_BATCH_SIZE,
      lock: t.LOCK.UPDATE,
      skipLocked: true,
      transaction: t
    });

    let sent = 0;
    for (const row of rows) {
      try {
        await publishEvent(row.payload);
      } catch (err) {
        // Stop here to preserve ordering; commit what was already sent.
        if (!failing) {
          console.error(`Outbox publish failing, will retry: ${err.message}`);
          failing = true;
        }
        return { sent, hadFailure: true };
      }
      row.published_at = new Date();
      await row.save({ transaction: t });
      sent += 1;
    }

    if (failing && sent > 0) {
      console.log("Outbox publishing recovered.");
    }
    if (sent > 0 || rows.length === 0) failing = false;
    return { sent, hadFailure: false };
  });
}

async function runLoop() {
  do {
    rerun = false;
    const { sent, hadFailure } = await flushBatch();
    // A full batch means there may be more waiting
    if (!hadFailure && sent === OUTBOX_BATCH_SIZE) rerun = true;
  } while (rerun && !stopped);
}

function run() {
  if (running) {
    rerun = true; // pick up anything recorded while we were busy
    return running;
  }
  running = runLoop()
    .catch((err) => {
      console.error(`Outbox relay error: ${err.message}`);
    })
    .finally(() => {
      running = null;
    });
  return running;
}

function start() {
  stopped = false;
  timer = setInterval(run, OUTBOX_POLL_MS);
  timer.unref();
  run();
}

// Call after committing a transaction that recorded an event
function kick() {
  if (!stopped) run();
}

async function stop() {
  stopped = true;
  if (timer) clearInterval(timer);
  if (running) await running;
  await closeBroker();
}

module.exports = { start, kick, stop };