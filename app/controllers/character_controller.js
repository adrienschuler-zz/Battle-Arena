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
	var update = { $inc: { wins: 1 } };
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

// POST
controller.switchSpell = function(req, res) {
	var from = req.body.from;
	var to = req.body.to;
	
	switchSpell(req, res, from, to, function() {
		res.json(true);
	});
};

// POST
controller.learnSpell = function(req, res) {
	var from = req.body.from;
	var to = req.body.to;
	var skill_points = req.body.skill_points;

	// TODO character.skill_points --

	switchSpell(req, res, from, to, function() { res.json(true); }, skill_points);
	
};

controller.loose = function(req, res) {
	console.log('LOOSE');
	var update = { $inc: { looses: 1 } };
	CharacterModel.update({ _id: req.session.character._id }, update, null, function(error, success) {
		if (error) console.error(error);
		console.log('CharacterModel.update');
		console.log(success);
	});
};

function switchSpell(req, res, from, to, callback, skill_points) {
	// ugly 2 updates queries, mongodb issue, can't push/pull at the same time...
	// TODO: non blocking IO
	var update1 = {
		$pull: {
			_spells_equipped: from,
			_spells_available: to
		}
	};
	var update2 = {
		$push: {
			_spells_available: from,
			_spells_equipped: to
		}
	};

	if (skill_points) {
		console.log(skill_points);
		update1.$inc = {
			skill_points: -skill_points
		};
	}
	
	CharacterModel.update({ _id: req.session.character._id }, update1, null, function(error, success) {
		if (error) console.error(error);

		CharacterModel.update({ _id: req.session.character._id }, update2, null, function(error, success) {
			if (error) console.error(error);

			SpellModel.findById(to, function(error, spell) {
				if (error) console.error(error);

				replaceByID(req.session.character._spells_equipped, from, spell);
				replaceByID(req.session.spells, from, spell);

				if (skill_points) req.session.character.skill_points -= skill_points;
				req.session.character._spells_available.push(from);
				callback();
			});
		});
	});
}

function replaceByID(array, id, value) {
	$.each(array, function(s, key) {
		if (s._id === id) {
			array[key] = value;
		}
	});
}
