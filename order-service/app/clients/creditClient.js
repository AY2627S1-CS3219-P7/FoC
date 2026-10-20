/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: HTTP client for the credit service (reserve only)
 *
 *
 * Only POST /api/credit/tx/reserve is a direct call (it must succeed before
 * an order exists). Release and transfer happen via RabbitMQ events instead.
 *
 * The credit service's exact error contract is not documented yet, so:
 *   - network error / timeout / 5xx / 401 / 403  -> 503 (credit service down or misconfigured)
 *   - any other 4xx (e.g. insufficient credits)  -> 409, passing its message through
 * Revisit once the credit service documents its status codes.
 */

const {
  CREDIT_SERVICE_URL,
  CREDIT_TIMEOUT_MS,
  INTERNAL_API_KEY
} = require("../config/env");
const { conflict, serviceUnavailable } = require("../utils/httpError");

async function reserve({ orderId, userId, amount }) {
  const headers = { "Content-Type": "application/json" };
  if (INTERNAL_API_KEY) headers["X-Internal-Api-Key"] = INTERNAL_API_KEY;

  let res;
  try {
    res = await fetch(`${CREDIT_SERVICE_URL}/api/credit/tx/reserve`, {
      method: "POST",
      headers,
      body: JSON.stringify({ order_id: orderId, user_id: userId, amount: amount }),
      signal: AbortSignal.timeout(CREDIT_TIMEOUT_MS)
    });
  } catch (err) {
    console.error(`Credit service unreachable: ${err.message}`);
    throw serviceUnavailable("Credit service is unavailable, please try again");
  }

  if (res.ok) return;

  const body = await res.json().catch(() => ({}));
  const detail = body.message || `HTTP ${res.status}`;

  if (res.status >= 500 || res.status === 401 || res.status === 403) {
    console.error(`Credit service error on reserve (${res.status}): ${detail}`);
    throw serviceUnavailable("Credit service is unavailable, please try again");
  }

  throw conflict(`Could not reserve credits: ${detail}`, "CREDIT_RESERVATION_REJECTED");
}

module.exports = { reserve };