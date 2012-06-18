/**
 * Routes
 */

module.exports = function(app) {

	// Controllers
	var user 		= require('../app/controllers/user_controller')(app)
		, game 		= require('../app/controllers/game_controller')(app);


	function checkAuthentication(req, res, next) {
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
	
	// User
	app.get('/user/login', user.login);
	app.get('/user/signup', user.signup);
	app.get('/user/logout', user.logout);
	app.get('/user/profile', [checkAuthentication], user.profile);
	app.get('/user/rankings', [checkAuthentication], user.rankings);
	
	app.post('/user/create', user.create);
	app.post('/user/authenticate', user.authenticate);

	// Game
	app.get('/game', [checkAuthentication], game.index);
	

};