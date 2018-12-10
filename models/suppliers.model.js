const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ServerError = require('../lib/errors');

const supplierSchema = new Schema({
    company: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    manager: {
        type: String,
        required: true,
        trim: true
    },    
    email: {
        type: String,        
        unique: true,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    adress: {
        type: String,
        required: true,
        trim: true
    },
    url: {
    	type: String,
        required: false,
        trim: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

supplierSchema.pre('findOne', function() {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`)
    }
})

supplierSchema.pre('findOneAndUpdate', function(next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
})

supplierSchema.pre('findOneAndRemove', function (next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
});

module.exports = mongoose.model('supplier', supplierSchema);