/**
 * Character controller
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


// POST
controller.upstat = function(req, res) {
	var character = req.session.character;

	if (character.skill_points) {
		var update = {};
		var stat = req.params.stat;
		update.skill_points = character.skill_points -= 1;
		update[stat] = character[stat] += 1;

		CharacterModel.update({ _id: character._id }, update, null, function(e, s) {
			if (e) console.error(e);
			res.json(true);
		});

	} else {
		res.json(false);
	}
};