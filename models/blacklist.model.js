const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ServerError = require('../lib/errors');

const blackListSchema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String,
        required: true,
        trim: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('blackList', blackListSchema);