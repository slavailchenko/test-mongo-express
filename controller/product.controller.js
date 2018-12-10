const productModel = require ('../models/products.model');
const supplierModel = require ('../models/suppliers.model');
const ServerError = require('../lib/errors');
const log = require('../service/log.service')(module);

const redisClient = require('redis').createClient;
const redis = redisClient();
const bluebird = require('bluebird');

const { check, validationResult } = require('express-validator/check');

redis.on('connect', () => {
  log.info('Redis client connected');
  bluebird.promisifyAll(redis)
});

redis.on('error', (err) => {
  log.error('Something went wrong ' + err);
});

module.exports = {

  arrayOfValidation: [check('title').not().isEmpty(),
                      check('article').not().isEmpty().trim(),
                      check('description').not().isEmpty().trim(),
                      check('price').not().isEmpty(),
                      check('days').not().isEmpty(),
                      check('url').isURL(),
                      check('supplier_id').isMongoId()
                      ],

  validationFields: (req, res, next) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    } else next();
  },

  newProduct: (req, res, next) => {
    productModel.create(req.body)
    .then(productSaved => res.status(201).json({product: productSaved}))
    .catch(next);
  },

  getAllProducts: (req, res, next) => {
    const query = req.query.title || '';
    productModel.find({ title: { $regex: query.toLowerCase().trim(),  $options: 'ig' }})
    .then(products => {
      if (!products.length) throw new ServerError(404, 'Products not founded');
      res.json(products);
    })
    .catch(next);
  },

  getProductById: (req, res, next) => {
    productModel.findById({_id: req.params.id})
    .then(product => {
      if (!product) throw new ServerError(404, 'Product not found');
      res.json (product);
    })
    .catch(next);
  },

  getProductByTitleCache: (req, res, next) => {
    const query = req.query.title || '';
    redis.getAsync(query)
    .then((reply) => {
      if (reply) {
        reply = JSON.parse(reply);
        res.json(reply);
      } else { 
        productModel.find({ title: { $regex: query.toLowerCase().trim(),  $options: 'ig' }})
        .then(product => {
          if (!product) return next (ServerError(404, 'Products not founded'));
          res.json(product);
          redis.setAsync(query, JSON.stringify(product))
            .then(result => log.info(`Key "${query}" added in Redis cache`))
            .catch(next);
        })
      }
    })
    .catch(next);
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
      productModel.findByIdAndUpdate({_id: req.params.id}, req.body)
      .then(product => {
        if (!product) throw new ServerError(404, 'Product not found');
        res.status(200).json(`Product with id=${req.params.id} updated`)
      })
      .catch(next);
    })
    .catch(next);
  },

  removeProduct: (req, res, next) => {
    productModel.findByIdAndRemove({_id: req.params.id})
    .then(product => {
      if (!product) throw new ServerError(404, 'Product not found');
      res.json(`Product with id=${req.params.id} deleted`);
    })
    .catch(next);
  }
}