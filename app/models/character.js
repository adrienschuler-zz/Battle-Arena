var mongoose 	= require('mongoose')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema;


var Character = module.exports = new Schema({
		avatar						: { type: String, default: "default.jpeg" }
	, skill_points			: { type: Number, default: 10 }
	// , hitpoints					: { type: Number, default: 90 }
	// , manapoints				: { type: Number, default: 90 }
	, level 						: { type: Number, default: 1 }
	,	experience				: { type: Number, default: 0 }
	,	total_experience	: { type: Number, default: 0 }
	, strength 					: { type: Number, default: 10 }
	, agility 					: { type: Number, default: 10 }
	, stamina						: { type: Number, default: 10 }
	, intellect					: { type: Number, default: 10 }
	, wins							: { type: Number, default: 0 }
	, looses						: { type: Number, default: 0 }
	// , accuracy					: { type: Number, default: 10 }
	// , armor							: { type: Number, default: 10 }
	// ,	_spells 					: [{ type: Schema.ObjectId, ref: 'Spell' }]
	,	_spells_equipped	: [{ type: Schema.ObjectId, ref: 'Spell' }]
	,	_spells_available	: [{ type: Schema.ObjectId, ref: 'Spell' }]
	// , created 					: { type: Date, default: Date.now }
	// , updated 					: { type: Date, default: Date.now } 
});


Character.virtual('spells')
	.get(function() { 
		return this._spells_equipped;
	});
	

Character.pre('init', function(next) {
	console.log('Initializing character...');
	next();
});


Character.pre('save', function(next) {
	console.log('Saving character...');
	next();
});


Character.pre('remove', function(next) {
	console.log('Removing character...');
	next();
});

Character.methods.gainExperience = function(myLvl, opponentLvl) {
	var base = 25 * (Math.pow(myLvl + 1, 2));
	if (myLvl > opponentLvl) {
		console.log("base / opponentLvl = %s", base / opponentLvl);
		return base / opponentLvl;
	} else if (myLvl < opponentLvl) {
		console.log("base * opponentLvl = %s", base * opponentLvl);
		return base * opponentLvl;
	}
	return base;
};

Character.methods.nextLevel = function(level) {
	return 200 * (Math.pow(level + 1, 2));
};
