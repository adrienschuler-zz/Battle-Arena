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
			character.skill_points = update.skill_points;
			character[stat] = update[stat];
			res.json(true);
		});

	} else {
		res.json(false);
	}
};


// POST
controller.gainExperience = function(req, res) {
	var character = req.session.character;
	var c = new CharacterModel();

	var opponentLevel = req.body.opponentLevel;
	var xp = c.gainExperience(character.level, opponentLevel);
	var new_xp = character.experience + xp;
	var levelup = false;
	var nextLevel = c.nextLevel(character.level);
	var update = {};
	var response = {
		gain: xp,
		levelup: levelup
	};

	if (new_xp >= nextLevel) {
		var level = character.level + 1;
		update.level = level;
		character.level = level;
		
		update.experience = new_xp - nextLevel;
		character.experience = new_xp - nextLevel;
		
		update.skill_points = character.skill_points + 10;
		character.skill_points = character.skill_points + 10;

		response.levelup = true;
		response.level = level;
	} else {
		update.experience = new_xp;
		character.experience = new_xp;
	}

	CharacterModel
		.update({ _id: character._id }, update, null, function(error, success) {
			if (error) console.error(error);
			res.json(response);
	});
};
