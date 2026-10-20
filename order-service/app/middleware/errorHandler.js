const { HttpError } = require("../utils/httpError");

const notFoundHandler = (req, res) => {
    res.status(404).json({ status: 404, message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        const body = { status: err.status, message: err.message };
        if (err.code) body.code = err.code;
        if (err.errors) body.errors = err.errors;
        return res.status(err.status).json(body);
    }

    if (err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ status: err.status, message: err.message });
    }

    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
};

module.exports = { notFoundHandler, errorHandler };