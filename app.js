const express = require('express');
const bodyParser = require('body-parser');

const adminRouter = require('./route/admin.route');
const meRouter = require('./route/me.route');
const clientsRouter = require('./route/clients.route');
const supplierRouter = require('./route/suppliers.route');
const productsRouter = require('./route/products.route');
const ordersRouter = require('./route/orders.route');

const config = require('./config/app.config');
const log = require('./service/log.service')(module);
const ServerError = require('./lib/errors');
const mongoose = require('./lib/mongoose');

let app;

mongoose.connect().then(()=> new Promise ((res, rej) => {
	
  app = express ();
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:500}));
  app.disable('x-powered-by');

  app.use('/admin', adminRouter);
  app.use('/client', meRouter);
  app.use('/system/clients', clientsRouter);
  app.use('/system/suppliers', supplierRouter);
  app.use('/system/products', productsRouter);
  app.use('/system/orders', ordersRouter);

  app.use(ServerError.handle404Error);
  app.use(ServerError.errorLogger);
  app.use(ServerError.errorHandler);

  app.listen(config.server.port, config.server.host, err => {
    if (err) {
      log.error(`Server creation error: ${err}`);
      return;
    }
    log.info(`server started on ${config.server.host}:${config.server.port}`);
  });
  res();
})
)
.catch((err) => log.error(err.message));
