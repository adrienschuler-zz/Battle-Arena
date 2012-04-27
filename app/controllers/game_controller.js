// var _	= require('underscore');

var controller = {}
	, app
	, io;
	// , db;


module.exports = function (_app, _io) {
	app = _app;
	io = _io;
	// db  = app.set('db')
	return controller;
};


// GET
controller.index = function(req, res) {
	console.log(req.session);

	if (req.session.user) {

		// if (req.session.user.entered === false) {
			
			// req.session.user.entered = true;

			io.sockets.on('connection', function(socket) {
				
				io.sockets.emit('join', { login: req.session.user.login });

				socket.on('disconnect', function() {
					io.sockets.emit('user disconnected');
				});

				io.sockets.on('message', function(message) {
					io.sockets.emit('message', message);
				});

			});

		// }


		res.render('game/index', {
			title: 'BATTLE ARENA'
		});
	} else {
		res.redirect('/user/login');
	}

};