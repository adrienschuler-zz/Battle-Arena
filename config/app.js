/**
 * Load dependencies
 */
 
const express 			= require('express')
		// , nowjs 				= require('now')
		// , stylus 				= require('stylus')
		// , mongoose 			= require('mongoose')

		// , models 				= require('./models')
		, config 				= require('./config')
		, routes 				= require('./routes')
		, environments 	= require('./environments')
		, errors 				= require('./errors');


/**
 * Exports
 */

module.exports = function() {

	//  Create Server

	const app = express.createServer();
	
	//  Load Mongoose Models
	
	// models(app);
	
	//  Load Expressjs config
	
	config(app);

	//  Load Environmental Settings

	environments(app);

	//  Load routes config
	
	// var everyone = nowjs.initialize(app);

	// routes(app, everyone);
	
	//  Load error routes + pages
	
	// errors(app);
	
	
	return app;
	
};