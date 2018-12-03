const mongoose = require('mongoose');
const valid = require('validator');
const productModel = require ('../models/products.model');
const clientModel = require ('../models/clients.model');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const valuesPayment = {
    values: ['Cash', 'Mastercard'],
    message: `Please select correct value`
};

const valuesDelivery = {
    values: ['In shop', 'Post'],
    message: `Please select correct value`
};

const orderSchema = new Schema({
    client_id: {
        type: Schema.ObjectId,
        ref: 'client',
        required: true,
        trim: true
    },
    productIds: [{
        type: Schema.ObjectId,
        ref: 'product',
        required: true,
        trim: true
    }],
    payment: {
        type: String,
        required: true,
        enum: valuesPayment,
        trim: true
    },
    delivery: {
        type: String,
        required: true,
        enum: valuesDelivery,
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
        trim: true
    }
}, 
{
    timestamps: true,
    versionKey: false
});

orderSchema.pre('save', function (next) {

    productModel.find({
        '_id': { $in: this.productIds }
    }, (err, docs) => {

        let arr = docs.map(item => item._id.toString()),
        isCheck = false;

        for (let i=0; i<this.productIds.length; i++) {
            if (arr.indexOf(this.productIds[i].toString()) >= 0) {
                isCheck = true;
            } else {
                isCheck = false;
                break;
            }
        }

        (isCheck) ? next() : next (new Error(`ProductId don't exist in products`));
    });

});

orderSchema.pre('save', function (next) {

    clientModel.findById({
        _id: this.client_id.toString()
    }, (err, docs) => {
        (docs._id.toString() == this.client_id) ? next() : next (new Error(`Client ${this.client_id} don't exist in clients`));
    });

});

module.exports = mongoose.model('order', orderSchema);