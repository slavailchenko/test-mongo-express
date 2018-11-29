const mongoose = require('mongoose');
const valid = require('validator');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const valuesCategories = {
    values: ['Phones', 'Tablet'],
    message: `Please select correct value`
};

const valuesBrands = {
    values: ['Apple', 'Samsung', 'Xiaomi', 'Sony'],
    message: `Please select correct value`
};

const valuesStatus = {
    values: ['availability', 'pre-order', 'not availability'],
    message: `Please select correct value`
};

const valuesConditions = {
    values: ['New', 'CPO', 'CPO-'],
    message: `Please select correct value`
};

const productSchema = new Schema({
    title: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    article: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },  
    url: {
    	type: String,
        validate: {
            validator: valid.isURL,
            message: 'Is not a valid URL',
            isAsync: false
        },
        trim: true
    },
    name_sub_category: {
        type: String,
        required: true,
        enum: valuesCategories,
        trim: true
    },
    brand_name: {
        type: String,
        required: true,
        enum: valuesBrands,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: valuesStatus,
        trim: true
    },
    state: {
        type: String,
        required: true,
        enum: valuesConditions,
        trim: true
    },
    days: {
        type: Number,
        required: true,
        trim: true
    },
    supplier_id: {
        type: Schema.ObjectId,
        ref: 'supplier',
        trim: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model('product', productSchema);