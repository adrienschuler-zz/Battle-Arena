var connect 		= require('connect')
	, ParseCookie = connect.utils.parseCookie
	, Session 		= connect.middleware.session.Session;


function _time() {
	var d = new Date(), 
			h = d.getHours(), 
			m = d.getMinutes(),
			h = h.toString().length > 1 ? h : '0' + h,
			m = m.toString().length > 1 ? m : '0' + m;
	return '<span class="time">[' + h + ':' + m + ']</span> ';
}


module.exports = function(_app, _io, _sessionStore) {

	var app = _app
		, io 	= _io
		, sessionStore = _sessionStore
		, users = [];


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

			var intervalID = setInterval(function() {
				hs.session.reload(function() { 
					hs.session.touch().save();
				});
			}, 60 * 1000);


			socket.emit(
				'updatechat', 
				_time() + '<span class="srv-msg">Welcome</span> <span class="username">' + hs.session.user.username + '</span> !'
			);

			socket.broadcast.emit(
				'updatechat', 
				_time() + '<span class="username">' + hs.session.user.username + '</span> <span class="srv-msg">entered the chat.</span>'
			);

			socket.on('userjoin', function(user) {
				users.push(user);
				chat.emit('updateusers', users);
			});

			socket.on('message', function(msg) {
				chat.emit(
					'updatechat',
					_time() + ' <span class="username">' + hs.session.user.username + '</span> : <span class="user-msg">' + msg + '</span>'
				)
			});

			socket.on('disconnect', function() {
				clearInterval(intervalID);

				for (var i = 0; i < users.length; i++) {
					if (users[i] == hs.session.user.username) {
						users.splice(i, 1);
						break;
					}
				}

				chat.emit('updateusers', users);

				socket.broadcast.emit(
					'updatechat', 
					_time() + '<span class="username">' + hs.session.user.username + '</span> <span class="srv-msg">disconnected.</span>'
				);
			});

		});

};