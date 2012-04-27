var controller = {}
	, app
	, db
	, io;

module.exports = function (_app, _io) {
	app = _app;
	io = _io;
	db = app.set('db');
	return controller;
};


// POST
controller.create = function(req, res) {
	var u = req.body.user || null;
	var UserModel = db.main.model('User');
	var User = new UserModel();

	if (u && u.login) {
		console.log(u);

		db.User.find({ 
				login: u.login
			, password_hash: User.encryptPassword(u.password)
		}, function(error, success) {

			if (error) {
				console.log(error);
			}

			if (success[0] && success[0].login) {
				req.session.user = {
						_id: success[0]._id
					, login: success[0].login
					, email: success[0].email
					// , entered: false
				};
				res.redirect('/game');
			} else {
				req.flash('error', 'User not found.');
				res.redirect('/user/login');
			}

		});

	} else {
		req.flash('error', 'Fill the fucking fields...');
		res.redirect('/user/login');
	}

};

// GET
controller.destroy = function(req, res) {
	delete req.session.user;
	res.redirect('/');
};

