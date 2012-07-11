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
					session = hs.session,
					current_user = { 
						socketID: socket.id,
						userID: session.user._id,
						username: session.user.username,
						avatar: session.character.avatar
			};

			var intervalID = setInterval(function() {
				session.reload(function() { 
					session.touch().save();
				});
			}, 60 * 1000);

			connected_users.push(current_user);

			tchat.emit('updateusers', connected_users);

			socket.emit('welcome', current_user);

			socket.broadcast.emit('userjoin', { 
				username: session.user.username,
				avatar: session.character.avatar
			});

			// message event
			socket.on('message', function(msg) {
				tchat.emit('message', { 
					username: session.user.username, 
					message: msg,
					avatar: session.character.avatar
				});
			});

			// disconnect event
			socket.on('disconnect', function() {
				clearInterval(intervalID);

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
						socketID: socket.id,
						userID: session.user._id,
						username: session.user.username
					}];
					
				fighters.push(available[0]);

console.log(fighters);

				this.emit('opponentsavailable', available[0]);
				io.of('/tchat')
					.sockets[available[0].socketID]
					.emit('fightproposition', fighters);
			});

			// fight accepted
			socket.on('fightaccepted', function(fighters) {
				var hash = 'u1=' + fighters[0].userID + '&u2=' + fighters[1].userID;

				$.each(fighters, function(fighter) {
					io.of('/tchat')
						.sockets[fighter.socketID]
						.emit('redirect', hash);

					io.of('/tchat')
						.sockets[fighter.socketID]
						.broadcast.to('/game');
				});
			});

			// fight refused
			socket.on('fightrefused', function(fighters) {
console.log('fightrefused');
console.log(fighters);
			});

		});


	var fighters = [],
			game_turn = 0,
			player_turn = 0;


	var game = io
		.of('/game')
		.on('connection', function(socket) {

			var hs = socket.handshake,	
					session = hs.session;


			socket.on('join', function(fighter) {
				fighter.socketID = socket.id;
				fighters.push(fighter);

				if (fighters.length === 2) {
					console.log(fighters);
					game.emit('joinsuccess', fighters);

					io.of('/game')
						.sockets[fighters[0].socketID]
						.emit('play');

					io.of('/game')
						.sockets[fighters[1].socketID]
						.emit('wait');

					// $.each(fighters, function(f) {
					// 	console.log(f);
					// 	console.log(f.agility);
					// 	if (f.agility > first) {
					// 		first = f;
					// 	}
					// });

				}
			});

			socket.on('launchspell', function(spell) {
				console.log(spell);
				socket.broadcast.emit('attack', spell);
			});

			socket.on('play', function() {
				socket.emit('play');
			});

			socket.on('wait', function() {
				socket.emit('wait');
			});
	});
};
