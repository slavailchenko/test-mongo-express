const winston = require('winston');
const { splat, combine, timestamp, printf } = winston.format;
const node_env = require('../config/app.config').node_env;

function myLogger(module) {

	const myFormat = printf(({ timestamp, level, message }) => {
		return `{timestamp: ${timestamp}; level: ${level}; message: ${message}}`;
	});

	const logger = winston.createLogger({
		format: combine(
			timestamp(),
			splat(),
			myFormat
			),
		transports: [
		new winston.transports.File({
			level: 'info',
			timestamp: true,
			filename: 'info.log',
			handleException: true,
			json: true,
			maxSize: 5242880,
			colorize: true
		}),
		new winston.transports.File({
			level: 'error',
			timestamp: true,
			filename: 'error.log',
			label: getFilePath(module),
			handleException: true,
			json: true,
			colorize: true
		})
		],
		exitOnError: false
	});

	if (node_env !== 'production') {
		logger.add(new winston.transports.Console({
			format: winston.format.simple()
		}));
	};

	return logger;

}

function getFilePath (module) {
	return module.filename.split('/').slice(-2).join('/');
}

module.exports = myLogger;