/**
 * Routes
 */

module.exports = function(app, io) {

	// Controllers
	var session = require('../app/controllers/session_controller')(app, io)
		, user 		= require('../app/controllers/user_controller')(app)
		, game 		= require('../app/controllers/game_controller')(app, io);

	
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
	app.post('/user/create', user.create);

	// Game
	app.get('/game', game.index);

};