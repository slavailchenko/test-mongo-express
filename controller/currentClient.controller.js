const _ = require('lodash');

const clientModel = require('../models/clients.model');
const orderModel = require('../models/orders.model');
const ServerError = require('../lib/errors');

module.exports = {

    currentClient: (req, res, next) => {
        clientModel.findById({_id: req.currentClient.clientId}).lean().
        then(client => {
            if (!client) throw new ServerError(404, 'Client not found');
            res.status(200).json({me: client})
        })
        .catch(next);
    },

    getOrdersClient: (req, res, next) => {

        if (!req.currentClient) {
            return next(404, 'No current client was found');
        }

        orderModel.find({client_id: req.currentClient.clientId.toString()})
        .populate([{
            path: 'productIds',
            model: 'product',
            select: 'title price'
        }])
        .then(result => {
            if (!result) throw new ServerError(404, 'Orders not found');
            let data = [];
            result.forEach((item) => {
              data.push({
                orderId: item._id,
                products: item.productIds,
                delivery: item.delivery,
                payment: item.payment
            });
          });
            res.status(200).json(data);
        })
        .catch(next);
    },

    newOrderClient: (req, res, next) => {

        if (!req.currentClient) {
            return next(404, 'No current client was found');
        }

        let data = req.body;
        orderModel.create(_.merge(data,{client_id: req.currentClient.clientId.toString()}))
        .then(orderSaved => res.json({order: orderSaved}))
        .catch(next);
    },
}