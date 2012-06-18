var controller = {}
	, app
	, db
	, UserModel
	, User;


var mongoose 	= require('mongoose');

module.exports = function (_app) {
	app 						= _app;
	db 							= app.set('db');
	UserModel 			= db.main.model('User');
	CharacterModel 	= db.main.model('Character');
	SpellModel 			= db.main.model('Spell');
	User 						= new UserModel();
	Character 			= new CharacterModel();
	Spell 					= new SpellModel();
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
	User.create(req.body.user, SpellModel, CharacterModel, function(user) {
		if (user) {
			authenticate(req, user.username, user.password, function(success) {
				if (success) {
					req.flash('success', 'Your account has been successfully created.');
					res.redirect('/game');
				} else {
					req.flash('error', 'An error occurred during the authentication process, retry later.');
					res.redirect('/user/signup');
				}
			});
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
		authenticate(req, user.username, user.password, function(success) {
			if (success) {
				res.redirect('/game');
			} else {
				req.flash('error', 'User not found.');
				res.redirect('/user/login');
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

// GET
controller.rankings = function(req, res) {
	res.render('user/rankings', { 
		title: 'BATTLE ARENA - Rankings'
	});
};


function authenticate(req, username, password, callback) {
	UserModel.findOne({ 
				username: username
			, password_hash: User.encryptPassword(password)
		})
		.run(function(error, user_data) {
			if (error || !user_data) {
				console.error(error);
				return callback(false);
			} else {
				CharacterModel.findOne({
					_id: user_data._characters[0]
				})
				.populate('_spells')
				.run(function(error, character_data) {
					if (error) {
						console.error(error);
						return callback(false);
					}
					req.session.user = user_data;
					req.session.character = character_data;
					req.session.spells = character_data._spells;
					return callback(true);
				});
			}
	});
}