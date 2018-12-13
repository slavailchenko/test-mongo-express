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
        secretKey: 'my-secret-key',
        refreshSecretKey: 'refresh-secret-key',
        refreshTokenExpirationTimeSec: 2592000
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
        tokenExpirationTimeSec: process.env.PROD_EXP_TIME_TKN || 2000,
        version: 1,
        secretKey: process.env.PROD_SC_KEY ||'test-secret-key',
        refreshSecretKey: process.env.PROD_RF_SC_KEY || 'refresh-secret-key',
        refreshTokenExpirationTimeSec: process.env.PROD_EXP_TIME_RF_TKN || 2592000
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