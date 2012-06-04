var mongoose 	= require('mongoose')
	, crypto 		= require('crypto')
	, $ 				= require('underscore')
	, Schema 		= mongoose.Schema
	, ObjectId 	= Schema.ObjectId;


var User = module.exports = new Schema({
		is_active				: { type: Boolean, default: true }
	// ,	username        : { type: String, required: true, index: { unique: true } }
	,	username				: { type: String }
	// , email          	: { type: String, required: true, index: { unique: true } }
	, email 					: { type: String }
	, password_hash 	: { type: String }
	, ip_addresses		: { type: String }
	, devices					: { type: String }
	, created 				: { type: Date, default: Date.now }
	, updated 				: { type: Date, default: Date.now } 
});


User.virtual('password')
	.set(function(password) {
		this._password = password;
		this.password_hash = this.encryptPassword(password);
	})
	.get(function() { return this._password; });


User.pre('init', function(next) {
	console.log('initializing...');
	next();
});


User.pre('save', function(next) {
	console.log('Saving...');
	next();
});


User.pre('remove', function(next) {
	console.log('removing...');
	next();
});


User.methods.encryptPassword = function(password) {
	return crypto
		.createHash('sha1')
		.update(password)
		.digest('hex');
};


User.methods.create = function(user, callback) {
	if ($.isObject(user)) {
		$.extend(this, user);
		this.save(function(error, success) {
			if (error) {
				console.error(error);
				callback(false);
			}
			callback(success);
		});
	} else {
		callback(false);
	}
};