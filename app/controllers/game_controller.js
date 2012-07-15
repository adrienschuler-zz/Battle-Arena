/**
 * Game controller
 */

var	mongoose		= require('mongoose')
	,	$						= require('underscore')
	, controller	= {}
	, db
	, UserModel
	, CharacterModel
	, SpellModel
	, User
	, Character
	, Spell;


module.exports = function (_app) {
	db 							= _app.set('db');
	UserModel 			= db.main.model('User');
	CharacterModel 	= db.main.model('Character');
	SpellModel 			= db.main.model('Spell');
	User 						= new UserModel();
	Character 			= new CharacterModel();
	Spell 					= new SpellModel();
	return controller;
};


// GET
controller.index = function(req, res) {
	res.render('game/index', {
		title: 'BATTLE ARENA', 
		username: req.session.user.username
	});
};

// GET
controller.game = function(req, res) {
	var u1 = req.query['u1'];
	var u2 = req.query['u2'];
	var opponentID = req.session.user._id === u1 ? u2 : u1;

	UserModel.findOne({
		_id: opponentID
	})
	.populate('_characters')
	.run(function(error, opponent) {
		if (error || !opponent) console.error(error);

		SpellModel.find({}, function(error, spells) {
			if (error) console.error(error);

			res.render('game/game', {
				title: 'BATTLE ARENA',
				opponent: opponent,
				all_spells: spells
			});
		});
	});
};