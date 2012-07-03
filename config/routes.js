/**
 * Routes
 */

function checkAuthentication(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/user/login');
	}
}

module.exports = function(app, client) {

	// Controllers
	var user 			= require('../app/controllers/user_controller')(app, client)
		, game 			= require('../app/controllers/game_controller')(app)
		, character	= require('../app/controllers/character_controller')(app);
	
	// Root
	app.get('/', [checkAuthentication], game.index);
	
	// User
	app.get('/user/login', user.login);
	app.get('/user/signup', user.signup);
	app.get('/user/logout', user.logout);
	app.get('/user/profile', [checkAuthentication], user.profile);
	app.get('/user/rankings', [checkAuthentication], user.rankings);
	app.get('/user/spells/:id?', [checkAuthentication], user.spells);
	
	app.post('/user/create', user.create);
	app.post('/user/authenticate', user.authenticate);

	// Game
	app.get('/tchat', [checkAuthentication], game.index);
	app.get('/game/:id?', [checkAuthentication], game.game);

	// Character
	app.post('/character/upstat/:stat?', [checkAuthentication], character.upstat);
};