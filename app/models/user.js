var 	mongoose 	= require('mongoose')
		, crypto 		= require('crypto')
		, Schema 		= mongoose.Schema
		, ObjectId 	= Schema.ObjectId;


var User = new Schema({
		is_active     	: { type: Boolean, default: true }
	,	login         	: { type: String, required: true, index: { unique: true } }
	, email          	: { type: String, required: true, index: { unique: true } }
	, password_hash   : { type: String, required: true }
	, ip_addresses    : { type: String }
	, devices         : { type: String }
	, created  				: { type: Date, default: Date.now }
	, updated  				: { type: Date, default: Date.now } 
});

// User.all = function(callback){
// 	return this
// 		.find()
// 		.sort('_id','descending')
// 		.find({}, callback)
// }

User.pre('init', function(next){
	console.log('initializing...');
	next();
});

User.pre('save', function(next){
	console.log('Saving...');
	next();
});

User.pre('remove', function(next){
	console.log('removing...');
	next();
});

User.virtual('password')
	.set(function(password) {
    this._password = password;
    this.password_hash = this.encryptPassword(password);
  })
  .get(function() { return this._password; });


User.methods.encryptPassword = function(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
};


mongoose.model('User', User);
module.exports = mongoose.model('User');