var _			= require('underscore')
	, User 	= require('../models/user');

// Set all global variables 

var controller = {}
	, app
	, everyone
	, db;

// Constructor

module.exports = function (_app, _everyone) {
	app = _app;
	everyone = _everyone;
	db = app.set('db');

	return controller;
};


controller.login = function(req, res, next) {
	if ( ! _.isUndefined(req.body.user)) {	
		var u = new User();

		db.User.find({ 
				login: req.body.user.login
			, password_hash: u.encryptPassword(req.body.user.password)
		}, function(err, complete) {
			console.log(this);
			console.log(err);
			console.log(complete);
		});

	}

	res.render('users/login', { 
		title: 'Login - BATTLE ARENA'
	});
};


controller.signup = function(req, res, next) {
	if ( ! _.isUndefined(req.body.user)) {

		var u = new db.User({
				login: req.body.user.login
			, email: req.body.user.email
			, password: req.body.user.password
		}).save(function(err) {
			console.log(this);
		});

	}

  res.render('users/signup', {
		title: 'Register - BATTLE ARENA' 
	});
};