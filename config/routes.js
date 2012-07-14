/**
 * Routes
 */

function checkAuthentication(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

module.exports = function(app) {

	// Controllers
	var user 			= require('../app/controllers/user_controller')(app)
		, game 			= require('../app/controllers/game_controller')(app)
		, character	= require('../app/controllers/character_controller')(app);
	
	// Root
	app.get('/', [checkAuthentication], game.index);
	
	// User
	app.get('/login', user.login);
	app.get('/signup', user.signup);
	app.get('/logout', user.logout);
	app.get('/profile', [checkAuthentication], user.profile);
	app.get('/rankings', [checkAuthentication], user.rankings);
	app.get('/spells/:id?', [checkAuthentication], user.spells);
	
	app.post('/user/create', user.create);
	app.post('/user/authenticate', user.authenticate);

	// Game
	app.get('/tchat', [checkAuthentication], game.index);
	app.get('/game', [checkAuthentication], game.game);

	// Character
	app.post('/character/upstat/:stat?', [checkAuthentication], character.upstat);
	app.post('/character/gainExperience', [checkAuthentication], character.gainExperience);
};