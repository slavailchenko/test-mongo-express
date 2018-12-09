const log = require('../service/log.service')(module);

class ServerError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static handle404Error(req, res, next) {
        next(new ServerError(404, 'Page not found'));
    }

    static errorLogger(error, req, res, next) {
        log.error(`${error.message}, url: ${req.url}, method: ${req.method}`);
        next(error);
    }

    static errorHandler(error, req, res, next) {
        const status = error.status || 500;
        if (error.name == 'ValidationError') {
            res.status(422).json(error.message)
        } else {
            res.status(status).json(error.message);
        }
    }
}

module.exports = ServerError;