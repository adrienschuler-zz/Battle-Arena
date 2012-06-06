var mongoose 	= require('mongoose')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema;

var Spell = module.exports = new Schema({
		name						: { type: String, default: "default name" }
	,	description 		: { type: String, default: "default description" }
	,	thumbnail 			: { type: String, default: "1" }
	,	is_default 			: { type: Boolean }
	, damage					: { type: Number }
	, heal						: { type: Number }
	, accuracy				: { type: Number }
	,	round_of_effect	: { type: Number, default: 0 }
	, round_duration 	: { type: Number, default: 0 }
	, created 				: { type: Date, default: Date.now }
	, updated 				: { type: Date, default: Date.now } 
});


Spell.pre('init', function(next) {
	console.log('initializing...');
	next();
});


Spell.pre('save', function(next) {
	console.log('Saving...');
	next();
});


Spell.pre('remove', function(next) {
	console.log('removing...');
	next();
});

Spell.methods.create = function() {
	// this.save(function(error, success) {
	// 	if (error) {
	// 			console.error(error);
	// 			return null;
	// 		}
	// 		return success;
	// });
	return this;
};
