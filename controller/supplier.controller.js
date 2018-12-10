const supplierModel = require ('../models/suppliers.model')
const ServerError = require('../lib/errors');
const log = require('../service/log.service');

const { check, validationResult } = require('express-validator/check');

module.exports = {

  arrayOfValidation: [check('company').not().isEmpty(),
                      check('manager').not().isEmpty().trim(),
                      check('email').isEmail().normalizeEmail(),
                      check('phone').not().isEmpty().trim(),
                      check('adress').not().isEmpty(),
                      check('url').isURL()
                      ],

  validationFields: (req, res, next) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    } else next();
  },

  newSupplier: (req, res, next) => {
    supplierModel.create(req.body)
    .then(supplierSaved => res.status(201).json({supplier: supplierSaved}))
    .catch(next);
  },

  getAllSuppliers: (req, res, next) => {
    const query = req.query.email || '';
    supplierModel.find({ email: { $regex: query.toLowerCase().trim(),  $options: 'ig' }})
    .then(suppliers => {
      if (!suppliers.length) throw new ServerError(404, 'Suppliers not founded');
      res.json(suppliers);
    })
    .catch(next);
  },

  getSupplierById: (req, res, next) => {
    supplierModel.findById({_id: req.params.id})
    .then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not found');
      res.json(supplier);
    })
    .catch(next);
  },

  updateSupplier: (req, res, next) => {
    supplierModel.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not found');
      res.status(200).json(`Supplier with id=${req.params.id} updated`);
    })
    .catch(next);
  },

  removeSupplier: (req, res, next) => {
    supplierModel.findByIdAndRemove({_id: req.params.id})
    .then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not found');
      res.json(`Supplier with id=${req.params.id} deleted`);
    })
    .catch(next);
  }

}