/**
 * Load dependencies
 */

const mongoose = require('mongoose');

module.exports = function() {	
	mongoose.model('Spell', require('./spell'));
	mongoose.model('Character', require('./character'));
	mongoose.model('User', require('./user'));
};