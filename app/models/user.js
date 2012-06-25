var mongoose 	= require('mongoose')
	, crypto 		= require('crypto')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema
	, Spell 		= require('./spell')
	, Character = require('./character');


var User = module.exports = new Schema({
		is_active				: { type: Boolean, default: true }
	// ,	username        : { type: String, required: true, index: { unique: true } }
	,	username				: { type: String } // TODO unique/required
	// , email          	: { type: String, required: true, index: { unique: true } }
	, email 					: { type: String } // TODO unique/required
	, password_hash 	: { type: String }
	, ip_addresses		: { type: String }
	, devices					: { type: String }
	, _characters 			: [{ type: Schema.ObjectId, ref: 'Character' }]
	, created 				: { type: Date, default: Date.now }
	, updated 				: { type: Date, default: Date.now } 
});


User.virtual('password')
	.set(function(password) {
		this._password = password;
		this.password_hash = this.encryptPassword(password);
	})
	.get(function() { return this._password; });


User.virtual('character')
	.get(function() { return this._characters[0]; }); // Characters currently capped to 1


User.pre('init', function(next) {
	console.log('Initializing user...');
	next();
});


User.pre('save', function(next) {
	console.log('Saving user...');
	next();
});


User.pre('remove', function(next) {
	console.log('Removing user...');
	next();
});


User.methods.encryptPassword = function(password) {
	return crypto
		.createHash('sha1')
		.update(password)
		.digest('hex');
};


User.methods.create = function(_user, _spell, _character, callback) {
	var _this = this;
	var character = new _character();
	var spell = new _spell();
	
	if ($.isObject(_user)) {
		$.extend(_this, _user);

		spell.getDefaults(_spell, function(default_spells) {
			$.each(default_spells, function(s) {
				character.spells.push(s);
			});

			character.save(function(error, c) {
				_this._characters.push(c._id);
				_this.save(function(error, success) {
					if (error) {
						console.error(error);
						callback(false);
					}
					callback(success);
				});
			});
		});
	} else {
		callback(false);
	}
};