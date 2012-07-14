var mongoose 	= require('mongoose')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema;


var Spell = module.exports = new Schema({
		name						: { type: String, default: "default name" }
	,	_description 		: { type: String, default: "default description" }
	,	thumbnail 			: { type: String, default: "1" }
	,	is_default 			: { type: Boolean }
	, requirement			: { type: Number, default: "1" }
	, skill_points		: { type: Number }
	, damage					: { type: Number }
	, heal						: { type: Number }
	, accuracy				: { type: Number, default: 5 }
	,	round_of_effect	: { type: Number, default: 0 }
	, round_duration 	: { type: Number, default: 0 }
	, mana_cost 			: { type: Number, default: 0 }
	// , effects 				: [{}]
	, created 				: { type: Date, default: Date.now }
	, updated 				: { type: Date, default: Date.now }
});


Spell.virtual('description')
	.get(function() { 
		var _this 		= this
			,	new_desc 	= _this._description
			, matches 	= new_desc.match(/\{((.*?))\}/g);
		$.each(matches, function(match) {
			var match = match.replace(/{|}/g, '');
			if (_this[match]) {
				new_desc = new_desc
					.replace(match, _this[match])
					.replace(/{|}/g, '');
			}
		});
		return new_desc;
	});


Spell.pre('init', function(next) {
	console.log('Initializing spell...');
	next();
});


Spell.pre('save', function(next) {
	console.log('Saving spell...');
	next();
});


Spell.pre('remove', function(next) {
	console.log('Removing spell...');
	next();
});

Spell.methods.getDefaults = function(spell, callback) {
	var spell_ids = [];
	spell.find({is_default: 1}, function(error, spells) {
		if (error) console.error(error);
		for (var i in spells) {
			spell_ids.push(spells[i]._id);
		}
		return callback(spell_ids);
	});
};

Spell.methods.parseDescription = function(spell) {
	var new_desc = spell.description;
	var matches = spell.description.match(/\{((.*?))\}/g);
	$.each(matches, function(match) {
		var match = match.replace(/{|}/g, '');
		if (spell[match]) {
			new_desc = new_desc.replace(match, spell[match]).replace(/{|}/g, '');
		}
	});
	return new_desc;
};