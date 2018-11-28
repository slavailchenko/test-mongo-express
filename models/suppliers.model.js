const mongoose = require('mongoose');
const valid = require('validator');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const supplierSchema = new Schema({
    company: {
        type: String,
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
        required: 'Email address is required',
        validate: {
            validator: valid.isEmail,
            message: 'Is not a valid email',
            isAsync: false
        },
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
        validate: {
            validator: valid.isURL,
            message: 'Is not a valid URL',
            isAsync: false
        },
        trim: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('supplier', supplierSchema);