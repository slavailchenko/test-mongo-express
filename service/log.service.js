module.exports = {
	
	logger: (error, req, res, next) => {
		const message = {
			date: new Date().toLocaleString(),
			url: req.url,
			method: req.method
		};
		console.log(`Logger message: Date:${message.date}, URL:${message.url}, METHOD:${message.method}`);
		next(error);
	}
}