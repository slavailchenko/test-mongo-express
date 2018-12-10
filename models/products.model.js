const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ServerError = require('../lib/errors');
const supplierModel = require ('../models/suppliers.model');

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

productSchema.pre('findOne', function() {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`)
    }
})

productSchema.pre('findOneAndUpdate', function(next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
})

productSchema.pre('findOneAndRemove', function (next) {
    let id = this._conditions._id._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next (new ServerError(422, `Invalid ${id}. Must be a single String of 12 bytes or a string of 24 hex characters`))
    } else next();
});

productSchema.pre('save', function (next) {
    supplierModel.findById({
        _id: this.supplier_id.toString()
    }, (err, docs) => {
        (docs._id.toString() === this.supplier_id) ? next() : next (new ServerError(404, `Supplier ${this.supplier_id} don't exist in suppliers`));
    });

});


module.exports = mongoose.model('product', productSchema);