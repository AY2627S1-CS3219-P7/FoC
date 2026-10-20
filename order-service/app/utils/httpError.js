class HttpError extends Error {
    constructor(status, message, { code, errors } = {}) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.code = code;
        this.errors = errors;
    }
}

module.exports = {
    HttpError,
    badRequest: (message, errors) => new HttpError(400, message, { errors }),
    unauthorized: (message) => new HttpError(401, message),
    forbidden: (message) => new HttpError(403, message),
    notFound: (message) => new HttpError(404, message),
    conflict: (message, code) => new HttpError(409, message, { code }),
    serviceUnavailable: (message) => new HttpError(503, message)
};