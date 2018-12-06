const env = process.env.NODE_ENV;

const dev = {
    server: {
        port: 8001,
        host: '127.0.0.1',
        cors: {
            all: {
                origin: '*',
                methods: '*',
                exposedHeaders: '*'
            }
        }
    },
    authToken: {
        tokenExpirationTimeSec: 3000,
        version: 1,
        secretKey: 'my-secret-key'
    },
    database: {
        uri: 'mongodb://localhost:27017/shop',
        promise: Promise,
        options: {
            useNewUrlParser: true,
            useCreateIndex : true
        }
    }
};

const production = {
    server: {
        port: parseInt(process.env.PROD_APP_PORT) || 8001,
        host: process.env.PROD_DB_HOST || '127.0.0.1',
        cors: {
            all: {
                origin: '*',
                methods: '*',
                exposedHeaders: '*'
            }
        }
    },
    authToken: {
        tokenExpirationTimeSec: 2000,
        version: 1,
        secretKey: 'test-secret-key'
    },
    database: {
        uri: 'mongodb://localhost:27017/shop',
        promise: Promise,
        options: {
            useNewUrlParser: true,
            useCreateIndex : true
        }
    }
};

const config = {
   dev,
   production
};

module.exports = config[env];