var mongoose  = require('mongoose'),
    crypto    = require('crypto'),
    $         = require('underscore'),
    Schema    = mongoose.Schema,
    Spell     = require('./spell'),
    Character = require('./character');


var User = module.exports = new Schema({
    is_active       : { type: Boolean, default: true },
    username        : { type: String },
    email           : { type: String },
    password_hash   : { type: String },
  // , ip_addresses   : { type: String }
  // , devices          : { type: String },
    _characters       : [{ type: Schema.ObjectId, ref: 'Character' }]
  // , created        : { type: Date, default: Date.now }
  // , updated        : { type: Date, default: Date.now }
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


User.methods.create = function(_user, UserModel, SpellModel, CharacterModel, callback) {
  var user = new UserModel(_user);
  var character = new CharacterModel();
  var spell = new SpellModel();

  if ($.isObject(user)) {

    spell.getDefaults(SpellModel, function(default_spells) {
      $.each(default_spells, function(s) {
        character._spells_equipped.push(s);
      });

      character.save(function(error, c) {
        user._characters.push(c._id);
        user.save(function(error, success) {
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
