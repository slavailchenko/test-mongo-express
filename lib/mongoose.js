const mongoose = require('mongoose');

const config = require('../config/app.config');
const log = require('../service/log.service')(module);

mongoose.Promise = config.database.promise;

module.exports.connect = () => mongoose
    .connect(config.database.uri, config.database.options)
    .then(db => {
        log.info('mongoose connected');
        return db;
    });