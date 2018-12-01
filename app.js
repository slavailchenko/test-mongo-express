const express = require('express');
const bodyParser = require('body-parser');
const clientsRouter = require('./route/clients.route');
const supplierRouter = require('./route/suppliers.route');
const productsRouter = require('./route/products.route');
const ordersRouter = require('./route/orders.route');
const config = require('./config/app.config');
const log = require('./service/log.service');
const ServerError = require('./lib/errors');
const mongoose = require('./lib/mongoose');

let app;

mongoose.connect().then(()=> new Promise ((res, rej) => {
	
  app = express ();

  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

  app.use(log.logger);

  app.use('/clients', clientsRouter);
  app.use('/suppliers', supplierRouter);
  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);

  app.use(ServerError.handle404Error);
  app.use(ServerError.errorLogger);
  app.use(ServerError.errorHandler);

  app.listen(config.server.port, config.server.host, err => {
    if (err) {
      console.log('Server creation error: ' + err);
      return;
    }
    console.log(`server started on ${config.server.host}:${config.server.port}`);
  });
  res();
})
)
.catch((err) => console.log(err));

module.exports = app;