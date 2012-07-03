var connect 		= require('connect')
	, crypto 			= require('crypto')
	, $						= require('underscore')
	, ParseCookie = connect.utils.parseCookie;


module.exports = function(_app, _io, sessionStore) {
	var app = _app
		, io 	= _io
		, connected_users = []
		, games = [];


	io.set('authorization', function(hsData, accept) {
		if (hsData.headers.cookie) {
			var	cookie = require('connect').utils.parseCookie(hsData.headers.cookie), 
					sid = cookie['connect.sid'];

			sessionStore.load(sid, function(err, session) {
				if(err || !session) {
					console.error(err);
					return accept('Error retrieving session!', false);
				}
				hsData.session = session;
				return accept(null, true);
			});
		} else {
			return accept('No cookie transmitted.', false);
		}
	});

	var tchat = io
		.of('/tchat')
		.on('connection', function(socket) {
			var hs = socket.handshake,
					session = hs.session;

			connected_users.push({
				id: socket.id,
				username: session.user.username
			});

			tchat.emit('updateusers', connected_users);

			socket.emit('welcome', { 
				username: session.user.username 
			});

			socket.broadcast.emit('userjoin', { 
				username: session.user.username 
			});

			// message event
			socket.on('message', function(msg) {
				tchat.emit('message', { 
					username: session.user.username, 
					message: msg 
				});
			});

			// disconnect event
			socket.on('disconnect', function() {
				var disconnected_user = session.user.username;
				$.each(connected_users, function(u, i) {
					if (u.username === disconnected_user) {
						connected_users.splice(i, 1);
					}
				});

				socket.broadcast.emit('disconnect', {
					username: disconnected_user
				});

				tchat.emit('updateusers', connected_users);
			});

			// search opponent event
			socket.on('searchopponent', function() {
				var available = [];
				$.each(connected_users, function(u) {
					if (u.username !== session.user.username) {
						available.push(u);
					}
				});

				var fighters = [{
						id: socket.id,
						username: session.user.username
					}];
				fighters.push(available[0]);

console.log(fighters);

				this.emit('opponentsavailable', available[0]);
				io.of('/tchat').sockets[available[0].id].emit('fightproposition', fighters);
			});

			// fight accepted
			socket.on('fightaccepted', function(fighters) {
				console.log('fightaccepted');
				console.log(fighters);

				var hash = crypto.createHash('sha1').update(fighters[0].id + fighters[1].id).digest('hex');

				$.each(fighters, function(fighter) {
					io.of('/tchat')
						.sockets[fighter.id]
						.emit('redirect', hash);

					io.of('/tchat')
						.sockets[fighter.id]
						// .broadcast.to('/game/' + hash);
						.broadcast.to('/game');
				});
				
			});

			// fight refused
			socket.on('fightrefused', function(fighters) {
				console.log('fightrefused');
				console.log(fighters);
			});

		});

	var game = io
		.of('/game')
		.on('connection', function(socket) {

			var hs = socket.handshake,
					session = hs.session;

			socket.broadcast.emit('opponentdata', {
				username: session.user.username,
				hitpoints: session.character.hitpoints,
				manapoints: session.character.manapoints,
				level: 1,
				avatar: session.character.avatar
			});

	});
};
