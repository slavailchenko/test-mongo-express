module.exports = {
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
    node_env: process.env.NODE_ENV || 'production',
    database: {
        uri: 'mongodb://localhost:27017/shop',
        promise: Promise,
        options: {
            useNewUrlParser: true,
            useCreateIndex : true
        }
    },
}