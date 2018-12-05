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