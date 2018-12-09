const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ServerError = require('../lib/errors');

const validateEmail = (email) => {
    let r = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return r.test(email)
};

const valuesStatus_reg = {
    values: ['Full', 'Express'],
    message: `Please select correct value`
};

const valuesStatus = {
    values: ['Junior', 'Junior Plus', 'Middle', 'Middle Plus'],
    message: `Please select correct value`
};

const clientSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        index: true,
        required: true,
        trim: true
    },    
    email: {
        type: String,        
        index: {unique: true},
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        'Please fill a valid email address'],
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
    date_regastration: {
    	type: Date,
    	required: true,
        trim: true
    },
    exp_date_regastration: {
    	type: Date,
    	required: false,
        trim: true
    },
    status: {
        type: String,
        required: true, 
        enum: valuesStatus,
        default: 'Junior',
    },
    discount: {
        type: Number,
        default: '0.00',
        trim: true
    },
    status_reg: {
        type: String,
        required: true,
        enum: valuesStatus_reg,
        default: 'Full',
    },
}, 
{
    timestamps: true,
    versionKey: false
});

clientSchema.pre('findOne', function() {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`)
    }
})

clientSchema.pre('findOneAndUpdate', function(next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
})

clientSchema.pre('findOneAndRemove', function (next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
});

module.exports = mongoose.model('client', clientSchema);