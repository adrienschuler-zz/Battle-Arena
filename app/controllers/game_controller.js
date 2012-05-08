/**
 * Game controller
 */

var controller = {}
	, app
	, io
	, connect = require('connect')
	, ParseCookie = connect.utils.parseCookie
	, Session = connect.middleware.session.Session;
	// , db;


module.exports = function (_app, _io, _sessionStore) {
	app = _app;
	io = _io;
	sessionStore = _sessionStore;
	// db  = app.set('db')
	return controller;
};


function _time() {
	var d = new Date(), 
			h = d.getHours(), 
			m = d.getMinutes(),
			h = h.toString().length > 1 ? h : '0' + h,
			m = m.toString().length > 1 ? m : '0' + m;
	return '[' + h + ':' + m + '] ';
}


// GET
controller.index = function(req, res) {

	io.set('authorization', function(data, accept) {
		if (data.headers.cookie) {
			data.cookie = ParseCookie(data.headers.cookie);
			data.sessionID = data.cookie['express.sid'];
			data.sessionStore = sessionStore;

			sessionStore.get(data.sessionID, function (err, session) {
				if (err || !session) {
					accept('Error', false);
				} else {
					data.session = new Session(data, session);
					accept(null, true);
				}
			});
		} else {
			return accept('No cookie transmitted.', false);
		}
	});

	var chat = io
		.of('/game')
		.on('connection', function(socket) {

			var hs = socket.handshake;

console.log('A socket with sessionID ' + hs.sessionID + ' connected!');

			var intervalID = setInterval(function() {
				hs.session.reload(function() { 
					hs.session.touch().save();
				});
			}, 60 * 1000);

			socket.emit('updatechat', _time() + 'Welcome ' + hs.session.user.username);

			chat.emit('userjoin', req.session.user.username);

			socket.broadcast.emit('updatechat', _time() + hs.session.user.username + ' entered the chat');

			socket.on('disconnect', function() {
				socket.broadcast.emit('updatechat', hs.session.user.username + ' disconnected.');
				clearInterval(intervalID);

console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
			});

		});

	res.render('game/index', {
		title: 'BATTLE ARENA', 
		username: req.session.user.username
	});

};