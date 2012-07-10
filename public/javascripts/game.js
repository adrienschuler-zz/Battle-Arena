$(function() {
	var tchat_container = $('.tchat-container');
	var life_bar = $('#me .bar')[0];
	var max_life = $(life_bar).html();
	var mana_bar = $('#me .bar')[1];
	var max_mana = $(mana_bar).html();

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
		$.mobile.showPageLoadingMsg('a', 'Waiting for ' + opponent.username + ' turn...', true);
		// render(playTmpl, tchat_container);
	})
	.on('play', function() {
		render(playTmpl, tchat_container);
	})
	.on('attack', function(spell) {
		console.log(spell);

		// attacked side
		if (spell.damage) {
			$(life_bar).width((parseFloat(life_bar.style.width) - (spell.damage * 100 / max_life)) + '%');
			$(life_bar).html($(life_bar).html() - spell.damage);
			$(opponent_mana_bar).width((parseFloat(opponent_mana_bar.style.width) - (spell.mana_cost * 100 / opponent.manapoints)) + '%');
		}

	});


	$('.spell').bind('click', function() {
		var spell_id = $($(this)).data('spell-id');
		var spell = findSpellById(spells, spell_id);
		if (!spell.description) getSpellDescription(spell);

		$('<div>').simpledialog2({
				mode: 'button',
				headerText: 'Confirmation',
				buttonPrompt: '<div style="padding:10px;"><p>Launch this spell "'+ spell.name + '" ?</p><center><img src="/images/spells/'+spell.thumbnail+'.png"></center><p>'+spell.description+'</p></div>',
				buttons : {
					'Yes !': {
						click: function() {
							socket.emit('launchspell', spell);

							// attacker side
							if (spell.damage) {
								console.log(opponent);
								$(opponent_life_bar).width((parseFloat(opponent_life_bar.style.width) - (spell.damage * 100 / opponent.hitpoints)) + '%');
								$(mana_bar).width((parseFloat(mana_bar.style.width) - (spell.mana_cost * 100 / max_mana)) + '%');
								$(mana_bar).html($(mana_bar).html() - spell.mana_cost);
							}

						}
					},
					'No': { 
						icon: "delete", 
						theme: "c",
						click: function() {}
					}
				}
			});

	});

});