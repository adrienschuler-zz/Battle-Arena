var connect 		= require('connect')
	, $						= require('underscore')
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


module.exports = function(_app, _io, MongoStore) {

	var app = _app
		, io 	= _io
		, connected_users = [];


	io.set('authorization', function(data, accept) {
		if (data.headers.cookie) {
			data.cookie = ParseCookie(data.headers.cookie);
			data.sessionID = data.cookie['express.sid'];
			data.sessionStore = MongoStore;

			MongoStore.get(data.sessionID, function (err, session) {
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

			// updatechat
			socket.broadcast.emit(
				'updatechat', 
				_time() + '<span class="username">' + hs.session.user.username + '</span> <span class="srv-msg">entered the chat.</span>'
			);

			// userjoin
			socket.on('userjoin', function(user) {
				connected_users.push({
					id: socket.id,
					username: user
				});
				chat.emit('updateusers', connected_users);
			});

			// message
			socket.on('message', function(msg) {
				chat.emit(
					'updatechat',
					_time() + ' <span class="username">' + hs.session.user.username + '</span> : <span class="user-msg">' + msg + '</span>'
				)
			});

			// disconnect
			socket.on('disconnect', function() {
				clearInterval(intervalID);

				$.each(connected_users, function(u, i) {
					if (u.username === hs.session.user.username) {
						connected_users.splice(i, 1);
					}
				});

				chat.emit('updateusers', connected_users);

				socket.broadcast.emit(
					'updatechat', 
					_time() + '<span class="username">' + hs.session.user.username + '</span> <span class="srv-msg">disconnected.</span>'
				);
			});

			// search opponent
			socket.on('searchopponent', function() {
				var available = [];
				$.each(connected_users, function(u) {
					if (u.username !== hs.session.user.username) {
						available.push(u);
					}
				});

				var fighters = [{
						id: socket.id,
						username: hs.session.user.username
					}, {
						id: available[0].id,
						username: available[0].username
					}
				];
console.log(fighters);
				this.emit('opponentsavailable', available[0]);
				io.of('/game').sockets[available[0].id].emit('fightproposition', fighters);
			});

			// fight accepted
			socket.on('fightaccepted', function(fighters) {
				console.log('fightaccepted');
				console.log(fighters);

			});

			// fight refused
			socket.on('fightrefused', function(fighters) {
				console.log('fightrefused');
				console.log(fighters);
			});

		});
};
