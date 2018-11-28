const mongoose = require('mongoose');

const config = require('../config/app.config');

mongoose.Promise = config.database.promise;

module.exports.connect = () => mongoose
    .connect(config.database.uri, config.database.options)
    .then(db => {
        console.log('mongoose connected');
        return db;
    });