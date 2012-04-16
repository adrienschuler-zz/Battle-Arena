var _	= require('underscore');

// Set all global variables 

var controller = {}
	, app
	, everyone;
	// , db;

// Constructor

module.exports = function (_app, _everyone) {
	app = _app;
	everyone = _everyone;

	// db  = app.set('db')
	return controller;
};

controller.home = function(req, res, next) {

	everyone.now.distribute = function(message) {
		everyone.now.receive('anonymous', message);
	};

	res.render('chatrooms/home', { 
		title: 'Home - BATTLE ARENA'
	});
};
