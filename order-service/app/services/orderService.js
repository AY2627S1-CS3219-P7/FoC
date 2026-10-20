const { randomUUID } = require("crypto");
const db = require("../models");
const creditClient = require("../clients/creditClient");
const outboxRelay = require("../events/outboxRelay");
const { EVENT_TYPES, recordOrderEvent } = require("../events/orderEvents");
const { badRequest, forbidden, notFound, conflict } = require("../utils/httpError");

const { Order, Sequelize, sequelize } = db;
const { Op } = Sequelize;

const STATUSES = Order.rawAttributes.status.values;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isAdmin = (user) => user.roles.includes("ADMIN");

// Validation
const isNonEmptyString = (v, max = 255) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= max;


function parseCreateBody(body) {
    const b = body ?? {};
    const errors = [];

    if (!isNonEmptyString(b.title)) errors.push("title is required (max 255 characters)");
    if (b.description !== undefined && (typeof b.description !== "string" || b.description.length > 255)) {
        errors.push("description must be a string (max 255 characters)");
    }

    if (!isNonEmptyString(b.supplierId)) errors.push("supplierId is required");
    if (!isNonEmptyString(b.deliveryLocation)) errors.push("deliveryLocation is required (max 255 characters)");
    if (!Number.isInteger(b.creditAmount) || b.creditAmount < 1) {
        errors.push("creditAmount must be a positive integer");
    }

    const acceptBy = new Date(b.acceptBy);
    if (typeof b.acceptBy !== "string" || Number.isNaN(acceptBy.getTime())) {
        errors.push("acceptBy must be an ISO 8601 date-time string");
    } else if (acceptBy <= new Date()) {
        errors.push("acceptBy must be in the future");
    }

    if (errors.length > 0) throw badRequest("Validation failed", errors);

    return {
        title: b.title.trim(),
        description: b.description ?? "",
        supplier_id: b.supplierId.trim(),
        delivery_location: b.deliveryLocation.trim(),
        credit_amount: b.creditAmount,
        accept_by: acceptBy
    };
}

async function findOrderOrThrow(orderId) {
    if (!UUID_RE.test(orderId)) throw badRequest("Invalid order id");
    const order = await Order.findByPk(orderId);
    if (!order) throw notFound("Order not found");
    return order;
}


// Create Order
async function createOrder(user, body) {
    const fields = parseCreateBody(body);
    const orderId = randomUUID();

  // Throws 409 (rejected) or 503 (service down)
    await creditClient.reserve({
        orderId,
        userId: user.id,
        amount: fields.credit_amount
    });

    try {
        const order = await Order.create({
            order_id: orderId,
            requester_id: user.id, // use token
            status: "OPEN",
            ...fields
        });
        return order;
    } catch (err) {
        await releaseReservation(orderId, user.id, fields.credit_amount);
        throw err;
    }
}

// ORDER_CANCELLED event makes the credit service release the reservation for this order_id.
async function releaseReservation(orderId, userId, amount) {
    try {
        await sequelize.transaction((t) =>
        recordOrderEvent( EVENT_TYPES.ORDER_CANCELLED, 
            { order_id: orderId, requester_id: userId, courier_id: null, credit_amount: amount },
        t));
        outboxRelay.kick();
    } catch (err) {
        console.error(
        `RESERVATION LEAK: credits reserved but order not saved and release not recorded. order_id=${orderId} user_id=${userId} amount=${amount}: ${err.message}`
        );
    }
}

// Get order by id

async function getOrder(user, orderId) {
    const order = await findOrderOrThrow(orderId);

    // OPEN orders are visible to everyone
    // others are only visible to admins and associated requester/courier
    const involved = order.requester_id === user.id || order.courier_id === user.id;
    if (order.status !== "OPEN" && !involved && !isAdmin(user)) {
        throw forbidden("You do not have access to this order");
    }
    return order;
}

// Parsing parameters
const asString = (name, v) => {
    if (v !== undefined && typeof v !== "string") throw badRequest(`${name} must be a single value`);
    return v;
};

const asInt = (name, v, { min, max, fallback }) => {
    if (v === undefined) return fallback;
    const n = Number(v);
    if (!Number.isInteger(n) || n < min || n > max) {
        throw badRequest(`${name} must be an integer between ${min} and ${max}`);
    }
    return n;
};

// GET /api/orders?status=&requester_id=&courier_id=&limit=&offset=
async function listOrders(user, query) {
    const status = asString("status", query.status);
    const requesterId = asString("requester_id", query.requester_id);
    const courierId = asString("courier_id", query.courier_id);
    const limit = asInt("limit", query.limit, { min: 1, max: 100, fallback: 50 });
    const offset = asInt("offset", query.offset, { min: 0, fallback: 0 });

    if (status !== undefined && !STATUSES.includes(status)) {
        throw badRequest(`status must be one of: ${STATUSES.join(", ")}`);
    }

    const where = {};
    const scoped = requesterId !== undefined || courierId !== undefined;

    if (requesterId !== undefined) {
        if (requesterId !== user.id && !isAdmin(user)) throw forbidden("You can only list your own orders");
        where.requester_id = requesterId;
    }
    if (courierId !== undefined) {
        if (courierId !== user.id && !isAdmin(user)) throw forbidden("You can only list your own orders");
        where.courier_id = courierId;
    }

    // Without an owner filter this is the public "browse open orders" view
    if (!scoped && !isAdmin(user) && status !== undefined && status !== "OPEN") {
        throw forbidden("Listing non-open orders requires a requester_id or courier_id filter");
    }
    const effectiveStatus = status ?? (scoped ? undefined : "OPEN");
    if (effectiveStatus) where.status = effectiveStatus;
    
    // Browsing OPEN orders: hide ones whose accept-by time has passed
    // (they can no longer be accepted; expiry will mark them EXPIRED later)
    if (effectiveStatus === "OPEN" && requesterId === undefined) {
        where.accept_by = { [Op.gt]: new Date() };
    }
    
    const { rows, count } = await Order.findAndCountAll({
        where,
        order: [["created_at", "DESC"]],
        limit,
        offset
    });
    
    return { data: rows, total: count, limit, offset };
}

// Status transitions 

/**
 * Moves an order to a new status atomically.
 *
 * @param {object}   opts
 * @param {string[]} opts.allowedFrom  statuses the order must currently be in
 * @param {string}   opts.to           new status
 * @param {string}   opts.stampField   timestamp column to set (e.g. "accepted_at")
 * @param {Function} opts.authorize    (order, user) => void, throws 403
 * @param {object}   [opts.set]        extra column values (e.g. courier_id)
 * @param {object}   [opts.extraWhere] extra guard conditions
 * @param {string}   [opts.eventType]  outbox event to record in the same transaction
 */
async function transition(user, orderId, opts) {
    const { allowedFrom, to, stampField, authorize, set = {}, extraWhere = {}, eventType } = opts;

    const order = await findOrderOrThrow(orderId);
    authorize(order, user);

    if (!allowedFrom.includes(order.status)) {
        throw conflict(`Order is ${order.status}; expected ${allowedFrom.join(" or ")}`, "INVALID_STATE");
    }
    
    const now = new Date();
    const updated = await sequelize.transaction(async (t) => {
        // The WHERE clause re-checks the state, so a concurrent change loses cleanly
    const [count, rows] = await Order.update(
        { status: to, [stampField]: now, ...set },
        {
            where: { order_id: orderId, status: { [Op.in]: allowedFrom }, ...extraWhere },
            returning: true,
            transaction: t
        }
    );
    if (count === 0) {
        throw conflict("Order was changed by someone else, please refresh", "INVALID_STATE");
    }
    if (eventType) await recordOrderEvent(eventType, rows[0], t);
    return rows[0];
    });

    if (eventType) outboxRelay.kick();
    return updated;
}

const requireRequester = (order, user) => {
    if (order.requester_id !== user.id) throw forbidden("Only the requester can do this");
};

const accept = (user, orderId) =>
    transition(user, orderId, {
        allowedFrom: ["OPEN"],
        to: "ACCEPTED",
        stampField: "accepted_at",
        set: { courier_id: user.id },
        // Can't be accepted once its accept-by time has passed
        extraWhere: { accept_by: { [Op.gt]: new Date() } },
        authorize: (order, u) => {
            if (order.requester_id === u.id) throw forbidden("You cannot accept your own order");
            if (order.accept_by <= new Date()) {
                throw conflict("This order is past its accept-by time", "ORDER_EXPIRED");
            }
        }
    });

const pickup = (user, orderId) =>
    transition(user, orderId, {
        allowedFrom: ["ACCEPTED"],
        to: "PICKED_UP",
        stampField: "picked_up_at",
        authorize: (order, u) => {
            if (order.courier_id !== u.id) throw forbidden("Only the assigned courier can do this");
        }
    });

const complete = (user, orderId) =>
    transition(user, orderId, {
        allowedFrom: ["PICKED_UP"],
        to: "COMPLETED",
        stampField: "completed_at",
        authorize: requireRequester,
        eventType: EVENT_TYPES.ORDER_COMPLETED // credit service: transfer requester -> courier
    });

// Cancellable until the courier has picked the item up
const cancel = (user, orderId) =>
    transition(user, orderId, {
        allowedFrom: ["OPEN", "ACCEPTED"],
        to: "CANCELLED",
        stampField: "cancelled_at",
        authorize: requireRequester,
        eventType: EVENT_TYPES.ORDER_CANCELLED // credit service: release the reservation
    });

module.exports = { createOrder, getOrder, listOrders, accept, pickup, complete, cancel };
