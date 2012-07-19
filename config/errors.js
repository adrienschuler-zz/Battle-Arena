module.exports = function(app) {
	
	function NotFound(msg) {
		this.name = 'NotFound';
		Error.call(this, msg);
		Error.captureStackTrace(this, arguments.callee);
	}

	NotFound.prototype.__proto__ = Error.prototype;
	
	//  Catch all
	
	app.all('*', function notFound(req, res, next) {
	 	throw new NotFound;
	});
	
	//  Load 404 page
	
	app.error(function(err, req, res, next) {
			if (err instanceof NotFound) {
				res.render('404', {
					title: '404 - BATTLE ARENA' 
				});
			} else {
				next(err);
			}
	});

	//  Load 500 page
	
	app.error(function(err, req, res) {
		res.render('500', {
			title: '500 - BATTLE ARENA' 
		});
	});
	
	return app;
	
};