var controller = {}
	, app
	, db
	, UserModel
	, User;


module.exports = function (_app) {
	app 			= _app;
	db 				= app.set('db');
	UserModel = db.main.model('User');
	User 			= new UserModel();
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
	User.create(req.body.user, function(user) {
		if (user) {
			req.flash('success', 'Your account has been successfully created.');
			req.session.user = user;
			res.redirect('/game');
		} else {
			req.flash('error', 'Fill the required fields...');
			res.redirect('/user/signup');
		}
	});
};

// POST
controller.authenticate = function(req, res) {
	var user = req.body.user;
	if (user && user.username && user.password) {
		UserModel.find({ 
				username: user.username
			, password_hash: User.encryptPassword(user.password)
		}, function(error, data) {
			if (error || !data.length) {
				console.error(error);
				req.flash('error', 'User not found.');
				res.redirect('/user/login');
			} else {
				req.session.user = data[0];
				res.redirect('/game');
			}
		});
	} else {
		req.flash('error', 'Fill the required fields...');
		res.redirect('/user/login');
	}
};

// GET
controller.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/');
};
