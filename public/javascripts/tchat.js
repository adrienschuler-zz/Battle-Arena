$(function() {
	var tchat_container = $('.tchat-container');
	var tchat_input = $('#tchat-input');
	var tchat_side = $('.tchat-side');
	var welcomeTmpl = $('#welcomeTemplate');
	var userJoinTmpl = $('#userJoinTemplate');
	var messageTmpl = $('#messageTemplate');
	var disconnectTmpl = $('#disconnectTemplate');
	var activeUsersTmpl = $('#activeUsersTemplate');

	var socket = io
		.connect()
		.of('/tchat')
		.on('connect', function() {

		})
		.on('welcome', function(data) {
			console.log(data);
			$('<input type="hidden" name="socketID" id="socketID" value="'+data.socketID+'">').appendTo('body');
			render(welcomeTmpl, tchat_container, data);
		})
		.on('userjoin', function(data) {
			render(userJoinTmpl, tchat_container, data);
		})
		.on('disconnect', function(data) {
			render(disconnectTmpl, tchat_container, data);
		})
		.on('message', function(data) {
			render(messageTmpl, tchat_container, data);
			tchat_container.animate({ 
				scrollTop: 99999
			}, 500);
		})
		.on('updateusers', function(data) {
			$.each(data, function(key, user) {
				user.me = user.username === username ? 1 : 0;
			});
			tchat_side.html('');
			render(activeUsersTmpl, tchat_side, data);
		})
		.on('opponentsavailable', function(opponent) {
			$.mobile.showPageLoadingMsg('a', 'Waiting for ' + opponent.username + ' response...', true);
		})
		.on('fightproposition', function(fighters) {
			$('<div>').simpledialog2({
				mode: 'button',
				headerText: 'Confirmation',
				buttonPrompt: '<div style="padding:10px;"><p>' + fighters[0].username + ' wants to fight against you !</p></div>',
				buttons : {
					"Let's fight !": {
						click: function() {
							socket.emit('fightaccepted', fighters);
						}
					},
					'Refuse': { 
						icon: "delete", 
						theme: "c",
						click: function() {
							socket.emit('fightrefused', fighters);
						}
					}
				}
			});
		})
		.on('redirect', function(hash) {
			$(document).attr('location', '/game?' + hash);
		});

	tchat_input.bind('keyup', function(key) {
		if (key.keyCode === 13) {
			key.preventDefault();
			socket.emit('message', tchat_input.val());
			tchat_input.val('');
		}
	});

	$('.nav-logout, .nav-profile, .nav-ranking').bind('click', function() {
		socket.disconnect();
	});

	$('.nav-search').bind('click', function() {
		socket.emit('searchopponent');
	});

	$('.tchat-side a').live('click', function() {
		socket.emit('fightproposition', {
			from: +$('#socketID').val(),
			to: +$(this).data('socket-id')
		});
	});

});