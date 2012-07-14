var Game = Class.extend({
	init: function(player) {	
		this.opponent = null;
		this.player = player;
		this.spells = player._spells;
		this.player.hitpoints_left = this.player.hitpoints;
		this.player.manapoints_left = this.player.manapoints;

		this.initElements();
		this.initTemplates();
		this.initSocketIO();
		this.bindEvents();
	},

	initElements: function() {
		var bars = $('.bar');
		this.elements = {
			tchat: $('.tchat-container'),
			spells: $('.spell'),
			bars: bars,
			opponent_life_bar: bars.get(0),
			opponent_mana_bar: bars.get(1),
			life_bar: bars.get(2),
			mana_bar: bars.get(3)
		};
	},

	initTemplates: function() {
		this.templates = {
			welcome: $('#welcomeTemplate'),
			play: $('#playTemplate'),
			wait: $('#waitTemplate'),
			attack: $('#attackTemplate'),
			heal: $('#healTemplate'),
			win: $('#winTemplate')
		};
	},

	render: function(tmpl, data, target) {
		if (_.isObject(data)) data.time = now();
		if (!target) target = this.elements.tchat;
		var result = this.templates[tmpl].tmpl(data);

		if (target === 'popup') {
			return result[0].innerHTML;
		}

		result.appendTo(target);
		this.updateScrollbar();
	},

	bindEvents: function() {
		this.initializeBars();
		this.launchSpell();
	},

	initSocketIO: function() {
		var self = this;
		this.socket = io.connect().of('/game')
			
			.on('connect', function() {
				self.socket.emit('join', location.search, self.player);
			})

			.on('joinsuccess', function(fighters) {
				self.opponent = fighters[0].username === self.player.username ? fighters[1] : fighters[0];
				self.opponent.hitpoints_left = self.opponent.hitpoints;
				self.opponent.manapoints_left = self.opponent.manapoints;
				self.render('welcome', { username: self.opponent.username, time: now() });
			})

			.on('wait', function() {
				self.render('wait', { username: self.opponent.username });
				self.wait(self.opponent.username);
			})

			.on('play', function() {
				self.render('play', {});
				self.play();
			})

			.on('attack', function(spell) {
				self.attackedBarsAnimation(spell);
			});
	},

	launchSpell: function() {
		var self = this;
		$('.spell').bind('click', function() {
			if ($(this).hasClass('disabled')) return;
			var spell = findSpellById(self.spells, $($(this)).data('spell-id'));
			$('<div>').simpledialog2({
				animate: false,
				mode: 'button',
				headerText: spell.name,
				buttonPrompt: '<div style="padding:10px;"><center><img src="/images/spells/'+spell.thumbnail+'.png"><p>'+spell.description+'</p></center></div>',
				buttons : {
					'Launch !': {
						click: function() {
							self.attackerBarsAnimation(spell);
							self.checkManaLeft();
						}
					},
					'Cancel': { icon: "delete", theme: "c", click: function() {} }
				}
			});
		});
	},
	
	initializeBars: function() {
		var self = this;
		setTimeout(function() {
			self.elements.bars.width('90.7%');
		}, 200);
	},

	// disable_spells: function(bool) {
	// 	$('.spells').data('disabled', bool);
	// },

	wait: function(username) {
		// this.disable_spells(true);
		// $('<div>').simpledialog2();
		// $('.ui-simpledialog-container').remove();
		$.mobile.showPageLoadingMsg('a', 'Waiting for ' + username + ' turn...', true);
		this.disableSpells(true);
		// render(srvMsgTmpl, tchat_container);
	},

	play: function() {
		this.disableSpells(false);
		this.checkManaLeft();
		// this.disable_spells(false);
		$('.ui-simpledialog-screen').remove();
		$.mobile.hidePageLoadingMsg();
		// render(playTmpl, tchat_container);
	},
	
	decreaseBar: function(bar, amount, total) {
		$(this.elements[bar])
			.width(
				(parseFloat(this.elements[bar].style.width) - (amount * 100 / total)) + '%'
			);
	},

	increaseBar: function(bar, amount, total) {
		$(this.elements[bar])
			.width(
				(parseFloat(this.elements[bar].style.width) + (amount * 100 / total)) + '%'
			);
	},

	attackerBarsAnimation: function(spell) {
		// this.disable_spells(true);
		this.socket.emit('launchspell', spell);

		if (spell.damage) {
			this.render('attack', { me: true, opponent: this.opponent.username, spell: spell.name, damages: spell.damage });
			this.opponent.hitpoints_left -= spell.damage;
			this.player.manapoints_left -= spell.mana_cost;
			this.decreaseBar('opponent_life_bar', spell.damage, this.opponent.hitpoints);
			this.decreaseBar('mana_bar', spell.mana_cost, this.player.manapoints);
			
			if (this.opponent.hitpoints_left <= 0) {
				return this.gainExperience();
			}
		}

		if (spell.heal) {
			this.render('heal', { me: true, spell: spell.name, heal: spell.heal });
			this.player.hitpoints_left += spell.heal;
			this.player.manapoints_left -= spell.mana_cost;
			this.increaseBar('life_bar', spell.heal, this.player.hitpoints);
			this.decreaseBar('mana_bar', spell.mana_cost, this.player.manapoints);
		}

		this.wait(this.opponent.username);
		this.socket.emit('wait');
	},

	attackedBarsAnimation: function(spell) {
		// $.mobile.sdCurrentDialog.close();
		$.mobile.hidePageLoadingMsg();

		if (spell.damage) {
			this.render('attack', { me: false, opponent: this.opponent.username, spell: spell.name, damages: spell.damage });
			this.player.hitpoints_left -= spell.damage;
			this.opponent.manapoints_left -= spell.mana_cost;
			this.decreaseBar('life_bar', spell.damage, this.player.hitpoints);
			this.decreaseBar('opponent_mana_bar', spell.mana_cost, this.opponent.manapoints);

			if (this.player.hitpoints_left <= 0) {
				return this.loose();
			}
		}

		if (spell.heal) {
			this.render('heal', { me: false, spell: spell.name, heal: spell.heal, opponent: this.opponent.username });
			this.opponent.hitpoints_left += spell.heal;
			this.opponent.manapoints_left -= spell.mana_cost;
			this.increaseBar('opponent_life_bar', spell.heal, this.opponent.hitpoints);
			this.decreaseBar('opponent_mana_bar', spell.mana_cost, this.opponent.manapoints);
		}

		this.socket.emit('play');
		this.play();
	},

	gainExperience: function(callback) {
		var self = this;
		$.ajax({
			url: '/character/gainExperience/',
			type: 'POST',
			data: { opponentLevel: self.opponent.level }
		}).done(function(rewards) {
			console.log(rewards);
			self.win(rewards);
		});
	},

	win: function(rewards) {
		var self = this;
		rewards.opponent = self.opponent.username;
		$('<div>').simpledialog2({
			animate: false,
			mode: 'button',
			headerText: 'Victory !',
			buttonPrompt: self.render('win', rewards, 'popup'),
			buttons : {
				'Ok !': {
					click: function() {
						self.socket.disconnect();
						$(document).attr('location', '/profile');
					}
				}
			}
		});
	},

	loose: function() {
		var self = this;
		$('<div>').simpledialog2({
			animate: false,
			mode: 'button',
			headerText: 'Defeat !',
			buttonPrompt: '<div style="padding:10px;"><center><img src="/images/game/icons/death.png"><p>You have been defeated by ' + self.opponent.username + ' !</p></center></div>',
			buttons : {
				'Ok :(': {
					click: function() {
						self.socket.disconnect();
						$(document).attr('location', '/');
					}
				}
			}
		});
	},

	checkManaLeft: function() {
		var self = this;
		$.each(this.elements.spells, function(key, spell) {
			if (self.player.manapoints_left < $(spell).data('mana-cost')) {
				$(spell).addClass('disabled');
			} else {
				$(spell).removeClass('disabled');
			}
		});
	},

	disableSpells: function(bool) {
		if (bool) {
			this.elements.spells.addClass('disabled');
		} else {
			this.elements.spells.removeClass('disabled');
		}
	},

	updateScrollbar: function() {
		this.elements.tchat.animate({ 
			scrollTop: 99999
		}, 200);
	},

});