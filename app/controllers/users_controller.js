// Set all global variables 

var controller = {}
	, app;
	// , db;

// Constructor

module.exports = function (_app) {
	app = _app;
	// db  = app.set('db')
	return controller;
};

controller.index = function(req, res, next) {
  res.render('users/index', { 
		title: 'BATTLE ARENA - Login' 
	});
};

controller.login = function(req, res, next) {
  res.render('users/login', { 
		title: 'BATTLE ARENA - Login' 
	});
};

controller.signup = function(req, res, next) {
  res.render('users/signup', {
		title: 'BATTLE ARENA - Register' 
	});
};