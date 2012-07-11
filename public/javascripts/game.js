function disable_spells(bool) {
	$('.spells').data('disabled', bool);
}

function wait(username) {
	disable_spells(true);
	$('<div>').simpledialog2();
	$('.ui-simpledialog-container').remove();
	$.mobile.showPageLoadingMsg('a', 'Waiting for ' + username + ' turn...', true);
	// render(srvMsgTmpl, tchat_container);
}

function play() {
	disable_spells(false);
	$('.ui-simpledialog-screen').remove();
	$.mobile.hidePageLoadingMsg();
	// render(playTmpl, tchat_container);
}

$(function() {

	setTimeout(function() {
		$('.bar').width('90.7%');
	}, 200);

	var tchat_container = $('.tchat-container');

	var mana_bar = $('#me .bar')[1];
	var life_bar = $('#me .bar')[0];

	var opponent_life_bar = $('#opponent .bar')[0];
	var opponent_mana_bar = $('#opponent .bar')[1];

	var welcomeTmpl = $('#welcomeTemplate');
	var playTmpl = $('#playTemplate');

	var opponent = null;

	var socket = io
	.connect()
	.of('/game')
	.on('connect', function() {
		socket.emit('join', player);
	})

	.on('joinsuccess', function(fighters) {
		opponent = fighters[0].username === player.username ? fighters[1] : fighters[0];
		render(welcomeTmpl, tchat_container, opponent.username);
	})

	.on('wait', function() {
		wait(opponent.username);
	})

	.on('play', function() {
		play();
	})

	.on('attack', function(spell) {

		// check mana left
		// disable if not enough

		// attacked side
		if (spell.damage) {
			// check death

			$(life_bar).width((parseFloat(life_bar.style.width) - (spell.damage * 100 / player.hitpoints)) + '%');
			$(opponent_mana_bar).width((parseFloat(opponent_mana_bar.style.width) - (spell.mana_cost * 100 / opponent.manapoints)) + '%');
		}

		if (spell.heal) {

		}

		socket.emit('play');
		play();
	});


	$('.spell').bind('click', function() {
		console.log($(this).data('disabled'));
		if ($(this).data('disabled')) return;
		var spell = findSpellById(spells, $($(this)).data('spell-id'));
		if (!spell.description) getSpellDescription(spell);

		$('<div>').simpledialog2({
				mode: 'button',
				headerText: spell.name,
				buttonPrompt: '<div style="padding:10px;"><center><img src="/images/spells/'+spell.thumbnail+'.png"><p>'+spell.description+'</p></center></div>',
				buttons : {
					'Launch !': {
						click: function() {
							disable_spells(true);
							socket.emit('launchspell', spell);

							// attacker side
							if (spell.damage) {
								$(opponent_life_bar).width((parseFloat(opponent_life_bar.style.width) - (spell.damage * 100 / opponent.hitpoints)) + '%');
								$(mana_bar).width((parseFloat(mana_bar.style.width) - (spell.mana_cost * 100 / player.manapoints)) + '%');
							}

							if (spell.heal) {

							}

							wait(opponent.username);
							socket.emit('wait');
						}
					},
					'Cancel': { 
						icon: "delete", 
						theme: "c",
						click: function() {}
					}
				}
			});

	});

});