module.exports = function(app) {

	var user 				= require('../app/controllers/users_controller')(app);
	// var chatroom  = require('../app/controllers/chatrooms_controller')(app);
	
	//  Load database and pass it down to the controllers
	
	// var db = app.set('db');

	//  Load Root
	
	app.get('/', user.index); // *Root
	
	//  Load User Controller + Routes
	
	app.get('/users/login', user.login);
	app.get('/users/signup', user.signup);
	// app.post('/users/signup', user.signup);

};