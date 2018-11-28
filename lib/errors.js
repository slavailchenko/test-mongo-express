const log = require('../service/log.service');

class ServerError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static handle404Error(req, res, next) {
        next(new ServerError(404, 'Page not found'));
    }

    static errorLogger(error, req, res, next) {
        log.logger(error, req, res, next);
        next(error);
    }

    static errorHandler(error, req, res, next) {
        const status = error.status || 500;
        res.status(status).json(error.message);
    }
}

module.exports = ServerError;