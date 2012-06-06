var mongoose 	= require('mongoose')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema
	, Spell 		= require('./spell');


var Character = module.exports = new Schema({
		avatar				: { type: String, default: "" }
	,	spells 				: [Spell]
	, skill_points	: { type: Number, default: 10 }
	, hitpoints			: { type: Number, default: 90 }
	, manapoints		: { type: Number, default: 90 }
	,	experience		: { type: Number, default: 0 }
	, strength 			: { type: Number, default: 10 }
	, agility 			: { type: Number, default: 10 }
	, stamina				: { type: Number, default: 10 }
	, accuracy			: { type: Number, default: 10 }
	, armor					: { type: Number, default: 10 }
	, created 			: { type: Date, default: Date.now }
	, updated 			: { type: Date, default: Date.now } 
});


Character.pre('init', function(next) {
	console.log('initializing...');
	next();
});


Character.pre('save', function(next) {
	console.log('Saving...');
	next();
});


Character.pre('remove', function(next) {
	console.log('removing...');
	next();
});

Character.methods.create = function() {
	// this.save(function(error, success) {
	// 	if (error) {
	// 			console.error(error);
	// 			return null;
	// 		}
	// 		return success;
	// });
	return this;
};
