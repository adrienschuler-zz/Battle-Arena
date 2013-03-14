/**
 * Load dependencies
 */

const mongoose = require('mongoose');

module.exports = function() {
  mongoose.model('Spell', require('../app/models/spell'));
  mongoose.model('Character', require('../app/models/character'));
  mongoose.model('User', require('../app/models/user'));
};
