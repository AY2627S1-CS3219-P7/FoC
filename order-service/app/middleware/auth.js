const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const { unauthorized, forbidden } = require("../utils/httpError");

// Verifies the bearer token and sets req.user = { id, roles }.
// Thrown errors are forwarded to the error handler by Express 5.
const authenticate = (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
        throw unauthorized("Missing or malformed Authorization header");
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    } catch (err) {
        throw unauthorized("Invalid or expired token");
    }

    if (!payload.sub) {
        throw unauthorized("Token has no subject");
    }

    req.user = {
        id: String(payload.sub),
        roles: Array.isArray(payload.roles) ? payload.roles : [],
    };
    next();
};

// Allows the request if the user holds at least one of the given roles.
const requireRoles =
    (...allowed) =>
        (req, res, next) => {
            if (!req.user.roles.some((role) => allowed.includes(role))) {
                throw forbidden(`Requires one of the roles: ${allowed.join(", ")}`);
            }
            next();
        };

module.exports = { authenticate, requireRoles };
