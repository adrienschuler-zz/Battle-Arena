/**
 * Load dependencies
 */

const mongoose = require('mongoose');

module.exports = function() {

  mongoose.model('User', require('../app/models/user'));
  mongoose.model('Character', require('../app/models/character'));
  mongoose.model('Spell', require('../app/models/spell'));

};