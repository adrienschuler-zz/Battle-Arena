var Game = Class.extend({
	init: function(player, spells) {
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

		this.templates = {
			welcome: $('#welcomeTemplate'),
			play: $('#playTemplate'),
			wait: $('#waitTemplate'),
			attack: $('#attackTemplate'),
			heal: $('#healTemplate')
		};

		this.player = player;
		this.player.hitpoints_left = this.player.hitpoints;
		this.player.manapoints_left = this.player.manapoints;
		this.spells = spells;
		this.opponent = null;

		this.initSocketIO();
		this.bindEvents();
	},

	render: function(tmpl, data, target) {
		if (_.isObject(data)) data.time = now();
		if (!target) target = this.elements.tchat;
		this.templates[tmpl].tmpl(data).appendTo(target);
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
				self.socket.emit('join', self.player);
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
				self.render('play', { time: now() });
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
		// render(srvMsgTmpl, tchat_container);
	},

	play: function() {
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
				return this.win();
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

	win: function() {
		var self = this;
		$('<div>').simpledialog2({
			animate: false,
			mode: 'button',
			headerText: 'Victory !',
			buttonPrompt: '<div style="padding:10px;"><center><p>You defeat ' + self.opponent.username + ' !</p></center></div>',
			buttons : {
				'Ok !': {
					click: function() {
						
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
			buttonPrompt: '<div style="padding:10px;"><center><p>You have been defeated by ' + self.opponent.username + ' !</p></center></div>',
			buttons : {
				'Ok :(': {
					click: function() {
						
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

	updateScrollbar: function() {
		this.elements.tchat.animate({ 
			scrollTop: 99999
		}, 200);
	},

});