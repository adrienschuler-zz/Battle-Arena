/**
 * Load dependencies
 */

const mongoose = require('mongoose');

module.exports = function() {

  mongoose.model('User', require('../app/models/user'));

};