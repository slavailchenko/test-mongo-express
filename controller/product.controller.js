const productModel = require ('../models/products.model');
const supplierModel = require ('../models/suppliers.model');
const ServerError = require('../lib/errors');
const log = require('../service/log.service');

module.exports = {
  
  newProduct: (req, res, next) => {
    supplierModel.findById({_id: req.body.supplier_id}).
    then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not founded');
      console.log(supplier);    
      productModel.create(req.body).
      then(productSaved => res.json({product: productSaved}))
    }).
    catch(next);
  },

  getAllProducts: (req, res, next) => {
    const query = req.query.title || '';
    productModel.find({ title: { $regex: query.toLowerCase().trim(),  $options: 'ig' }}).
    then(products => {
      if (!products.length) throw new ServerError(404, 'Products not founded');
      res.json(products);
    })
    .catch(next);
  },

  getProductById: (req, res, next) => {
    productModel.findOne({_id: req.params.id}).
    then(product => {
      res.json (product);
    }).
    catch(next);
  },

  getCompany: (req, res, next) => {
    productModel.findOne({_id: req.params.id}).
    populate('supplier_id', 'company manager').
    exec((err, supplier) => {
      if (err) return next (ServerError(404, 'Supplier not founded'));
      res.json (`Product with id=${req.params.id} provide company ${supplier.supplier_id.company}, manager ${supplier.supplier_id.manager}`);
    });
  },

  updateProduct: (req, res, next) => {
    supplierModel.findById({_id: req.body.supplier_id}).
    then(supplier => {
      if (!supplier) throw new ServerError(404, 'Supplier not founded');
      console.log(supplier);
      productModel.update({_id: req.params.id}, req.body).
        then(product => {
          res.json(`Product with id=${req.params.id} updated`)
        })
    }).catch(next);
  },

  removeProduct: (req, res, next) => {
    productModel.findByIdAndRemove({_id: req.params.id}).
    then(product => {
      res.json(`Product with id=${req.params.id} deleted`);
    }).
    catch(next);
  }
}