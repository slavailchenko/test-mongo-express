const productModel = require ('../models/products.model');
const supplierModel = require ('../models/suppliers.model');
const ServerError = require('../lib/errors');
const log = require('../service/log.service');

const redisClient = require('redis').createClient;
const redis = redisClient();
const bluebird = require('bluebird');

redis.on('connect', () => {
  console.log('Redis client connected');
  bluebird.promisifyAll(redis)
});

redis.on('error', (err) => {
  console.log('Something went wrong ' + err);
});

module.exports = {

  newProduct: (req, res, next) => {
    supplierModel.findById({_id: req.body.supplier_id})
    .then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not founded');
      productModel.create(req.body)
      .then(productSaved => res.status(201).json({product: productSaved}))
    }).catch(next);
  },

  getAllProducts: (req, res, next) => {
    const query = req.query.title || '';
    productModel.find({ title: { $regex: query.toLowerCase().trim(),  $options: 'ig' }})
    .then(products => {
      if (!products.length) throw new ServerError(404, 'Products not founded');
      res.json(products);
    }).catch(next);
  },

  getProductById: (req, res, next) => {
    productModel.findById({_id: req.params.id})
    .then(product => {
      res.json (product);
    }).catch(next);
  },

  getProductByTitleCache: (req, res, next) => {
    const query = req.query.title || '';
    redis.getAsync(query)
    .then((reply) => {
      if (reply) {
        reply = JSON.parse(reply);
        res.json(reply);
      }
      else { 
        productModel.find({ title: { $regex: query.toLowerCase().trim(),  $options: 'ig' }}).
        then(product => {
          if (!product) return next (ServerError(404, 'Products not founded'));
          res.json(product);
          redis.setAsync(query, JSON.stringify(product))
          .then(result => console.log(`Key "${query}" added in Redis cache`))
          .catch(next);
        })
      }
    }).catch(next);
  },

  getCompany: (req, res, next) => {
    productModel.findOne({_id: req.params.id})
    .populate('supplier_id', 'company manager')
    .exec((err, supplier) => {
      if (err) return next (ServerError(404, 'Supplier not founded'));
      res.json (`Product with id=${req.params.id} provide company ${supplier.supplier_id.company}, manager ${supplier.supplier_id.manager}`);
    });
  },

  updateProduct: (req, res, next) => {
    supplierModel.findById({_id: req.body.supplier_id})
    .then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not founded');
      productModel.update({_id: req.params.id}, req.body)
      .then(product => {
        res.status(200).json(`Product with id=${req.params.id} updated`)
      })
    }).catch(next);
  },

  removeProduct: (req, res, next) => {
    productModel.findByIdAndRemove({_id: req.params.id})
    .then(product => {
      res.json(`Product with id=${req.params.id} deleted`);
    }).catch(next);
  }
}