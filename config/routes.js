/**
 * Routes
 */

module.exports = function(app, io, sessionStore) {

	// Controllers
	var session = require('../app/controllers/session_controller')(app, io)
		, user 		= require('../app/controllers/user_controller')(app)
		, game 		= require('../app/controllers/game_controller')(app, io, sessionStore);


	function checkSession(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/user/login');
		}
	}
	
	// Root
	app.get('/', function(req, res) {
		if (req.session.user) {
			res.redirect('/game');
		} else {
			res.redirect('/user/login');
		}
	});
	
	// Session
	app.post('/session/create', session.create);
	app.get('/session/destroy', session.destroy);

	// User
	app.get('/user/login', user.login);
	app.get('/user/signup', user.signup);
	app.get('/user/profile', [checkSession], user.profile);
	app.post('/user/create', user.create);

	// Game
	app.get('/game', [checkSession], game.index);
	

};