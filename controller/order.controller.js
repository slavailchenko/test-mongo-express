const orderModel = require ('../models/orders.model');
const productModel = require ('../models/products.model');

const ServerError = require('../lib/errors');
const log = require('../service/log.service');

module.exports = {

  newOrder: (req, res, next) => {
    orderModel.create(req.body)
    .then(orderSaved => res.status(201).json({order: orderSaved}))
    .catch(next);
  },

  getAllOrders: (req, res, next) => {
    orderModel.find({})
    .then(orders => {
      if (!orders.length) throw new ServerError(404, 'Orders not founded');
        res.json(orders);
      })
    .catch(next);
  },

  getOrderById: (req, res, next) => {

    orderModel.findById({_id: req.params.id})
      .populate([{
        path: 'productIds',
        model: 'product',
        select: 'title price'
      } , {
        path: 'client_id',
        model: 'client',
        select: 'first_name last_name email phone'
      }])
      .exec((err, result) => {
        if (err) return next (ServerError(404, 'Order not founded'));
          res.json (result);
        });
  },

  updateOrder: (req, res, next) => {
    orderModel.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(order => {
      res.json(`Order with id=${req.params.id} updated`);
    }).catch(next);
  },

  removeOrder: (req, res, next) => {
    orderModel.findOneAndDelete({_id: req.params.id})
    .then(order => {
      res.json(`Order with id=${req.params.id} deleted`);
    })
    .catch(next);
  }

}