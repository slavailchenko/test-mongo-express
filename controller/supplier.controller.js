const supplierModel = require ('../models/suppliers.model')
const ServerError = require('../lib/errors');
const log = require('../service/log.service');

module.exports = {

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