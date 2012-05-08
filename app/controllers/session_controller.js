var controller = {}
	, app
	, db
	, io
	, sessionStore;

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

	if (u && u.username) {
		db.User.find({ 
				username: u.username
			, password_hash: User.encryptPassword(u.password)
		}, function(error, data) {

			if (error) console.log(error);

			if (data[0] && data[0].username) {
				req.session.user = {
						_id: data[0]._id
					, username: data[0].username
					, email: data[0].email
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

