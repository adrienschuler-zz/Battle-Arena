module.exports = function(app, everyone) {

	var user 			= require('../app/controllers/users_controller')(app, everyone);
	var chatroom 	= require('../app/controllers/chatrooms_controller')(app, everyone);
	
	//  Load database and pass it down to the controllers
	
	// var db = app.set('db');

	//  Load Root
	
	app.get('/', user.login); // *Root
	
	//  Load User Controller + Routes
	
	app.get('/users/login', user.login);
	app.post('/users/login', user.login);

	app.get('/users/signup', user.signup);
	app.post('/users/signup', user.signup);

	app.get('/chatrooms/home', chatroom.home);

};