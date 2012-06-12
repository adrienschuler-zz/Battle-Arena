/**
 * Game controller
 */

var controller = {}
	, app;
	// , db;


module.exports = function (_app) {
	app = _app;
	// db  = app.set('db')
	return controller;
};


// GET
controller.index = function(req, res) {
	res.render('game/index', {
		title: 'BATTLE ARENA', 
		username: req.session.user.username
	});

};