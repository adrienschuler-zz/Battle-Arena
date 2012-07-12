var Tchat = Class.extend({
	init: function(player) {
		this.player = player;

		// DOM elements
		this.elements = {
			tchat: $('.tchat-container'),
			input: $('#tchat-input'),
			side: $('.tchat-side')
		};

		// jQuery templates
		this.templates = {
			welcome: $('#welcomeTemplate'),
			join: $('#userJoinTemplate'),
			message: $('#messageTemplate'),
			disconnect: $('#disconnectTemplate'),
			users: $('#activeUsersTemplate')
		};

		this.initSocketIO();
		this.bindEvents();
	},

	render: function(tmpl, data, target) {
		if (_.isObject(data)) data.time = now();
		if (!target) target = this.elements.tchat;
		tmpl.tmpl(data).appendTo(target);
	},

	bindEvents: function() {
		this.sendMessage();
		this.leaveTchat();
		this.searchOpponent();
		// this.fightProposition();
	},

	initSocketIO: function() {
		var self = this;
		
		this.socket = io.connect().of('/tchat')

			.on('connect', function() {
				self.socket.emit('join', self.player);
			})

			.on('welcome', function(data) {
				self.render(self.templates.welcome, data);
			})

			.on('userjoin', function(data) {
				self.render(self.templates.join, data);
			})

			.on('disconnect', function(data) {
				self.render(self.templates.disconnect, data);
			})

			.on('message', function(data) {
				self.render(self.templates.message, data);
				self.updateScrollbar();
			})

			.on('updateusers', function(data) {
				$.each(data, function(key, user) {
					user.me = user.username === username ? 1 : 0;
				});
				self.elements.side.html('');
				self.render(self.templates.users, data, self.elements.side);
			})

			.on('opponentsavailable', function(opponent) {
				$.mobile.showPageLoadingMsg('a', 'Waiting for ' + opponent.username + ' response...', true);
			})

			.on('redirect', function(hash) {
				$(document).attr('location', '/game?' + hash);
			})

			.on('fightproposition', function(fighters) {
				$('<div>').simpledialog2({
					mode: 'button',
					headerText: 'Confirmation',
					buttonPrompt: '<div style="padding:10px;"><p>' + fighters[0].username + ' wants to fight against you !</p></div>',
					buttons : {
						"Let's fight !": {
							click: function() {
								self.socket.emit('fightaccepted', fighters);
							}
						},
						'Refuse': { 
							icon: "delete", 
							theme: "c",
							click: function() {
								self.socket.emit('fightrefused', fighters);
							}
						}
					}
				});
			});
	},

	/**
	 * DOM events
	 */

	updateScrollbar: function() {
		this.elements.tchat.animate({ 
			scrollTop: 99999
		}, 200);
	},

	sendMessage: function() {
		var self = this;
		this.elements.input.bind('keyup', function(key) {
			if (key.keyCode === 13) {
				key.preventDefault();
				self.socket.emit('message', self.elements.input.val());
				self.elements.input.val('');
			}
		});
	},

	leaveTchat: function() {
		var self = this;
		$('.nav-logout, .nav-profile, .nav-ranking').bind('click', function() {
			self.socket.disconnect();
		});
	},

	searchOpponent: function() {
		var self = this;
		$('.nav-search').bind('click', function() {
			self.socket.emit('searchopponent');
		});
	},

	// fightProposition: function() {
	// 	$('.tchat-side a').live('click', function() {
	// 		this.socket.emit('fightproposition', {
	// 			from: +$('#socketID').val(),
	// 			to: +$(this).data('socket-id')
	// 		});
	// 	});
	// }

});