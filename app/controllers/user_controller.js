var controller = {}
	, app
	, db;

module.exports = function (_app) {
	app = _app;
	db = app.set('db');
	return controller;
};


// GET
controller.login = function(req, res) {
	res.render('user/login', { 
		title: 'BATTLE ARENA - Login'
	});
};

// GET
controller.signup = function(req, res) {
	res.render('user/signup', {
		title: 'BATTLE ARENA - Register' 
	});
};

// GET
controller.profile = function(req, res) {
	res.render('user/profile', {
		title: 'BATTLE ARENA - profile' 
	});
};

// POST
controller.create = function(req, res) {
	var u = req.body.user || null;
	if (u && u.username) {
		console.log(u);

		var User = new db.User({
				username: u.username
			, email: u.email
			, password: u.password
		}).save(function(error, success) {
			
			if (error) console.log(error);

			if (success) {
				console.log(success);
				req.session.user = User;
				res.redirect('/game');
			}

		});
	} else {
		req.flash('error', 'Fill the required fields...');
		res.redirect('/user/signup');
	}
};