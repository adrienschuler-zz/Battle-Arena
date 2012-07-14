/**
 * User controller
 */

var	mongoose		= require('mongoose')
	,	$						= require('underscore')
	, controller	= {}
	, db
	, UserModel
	, CharacterModel
	, SpellModel
	, User
	, Character
	, Spell;


module.exports = function (_app) {
	db 							= _app.set('db');
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


// GET
controller.spells = function(req, res) {
	console.log(req.params.id);
	SpellModel
		.find(function(error, s) {
			if (error) console.log(error);
			if (!s) {
				req.flash('error', "An error occured while retrieving this spell.");
				res.redirect('/profile');
			} else {
				res.render('user/spells', {
						title: 'BATTLE ARENA - Spells'
					, all_spells: s
					, current_id: req.params.id
				});
			}
	});
};


// GET
controller.rankings = function(req, res) {
	var datas = [];
	UserModel.find({
		is_active: 1
	})
	.populate('_characters')
	.run(function(error, users) {
		if (error) console.error(error);
		$.each(users, function(user) {
			datas.push({
					username: user.username
				, experience: user.character.experience
				, avatar: user.character.avatar
			});
		});

		res.render('user/rankings', { 
				title: 'BATTLE ARENA - Rankings'
			, datas: datas
		});
	});
};


// POST
controller.create = function(req, res) {
	var user = req.body.user;
	if (user.username && user.password) {
		UserModel.findOne({ username: user.username }, function(error, user_data) {
			if (error || user_data) {
				console.error(error);
				req.flash('error', 'This username is not availabe.');
				res.redirect('/signup');
			} else {
				User.create(req.body.user, UserModel, SpellModel, CharacterModel, function(user) {
					authenticate(req, user.username, user.password, function(success) {
						if (success) {
							req.flash('success', 'Your account has been successfully created.');
							res.redirect('/tchat');
						} else {
							req.flash('error', 'An error occurred during the authentication process, retry later.');
							res.redirect('/signup');
						}
					});
				});
			}
		});
	} else {
		req.flash('error', 'Fill the required fields...');
		res.redirect('/signup');
	}
};


// POST
controller.authenticate = function(req, res) {
	var user = req.body.user;
	if (user && user.username && user.password) {
		authenticate(req, user.username, user.password, function(success) {
			if (success) {
				res.redirect('/tchat');
			} else {
				req.flash('error', 'User not found.');
				res.redirect('login');
			}
		});
	} else {
		req.flash('error', 'Fill the required fields...');
		res.redirect('/login');
	}
};


// GET
controller.logout = function(req, res) {
	delete req.session.user;
	delete req.session.character;
	delete req.session.spells;
	res.redirect('/');
};


// authenticate function
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
				_id: user_data.character
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
