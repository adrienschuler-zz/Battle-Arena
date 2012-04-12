/**
 * Load dependencies
 */
 
const express 			= require('express')
		// , stylus 				= require('stylus')
		// , mongoose 			= require('mongoose')
		// , models 				= require('./models')
		, config 				= require('./config')
		, routes 				= require('./routes');

/**
 * Exports
 */
		 
module.exports = function() {

	//  Create Server

	const app = express.createServer()
	
	//  Load Mongoose Models
	
	// models(app)
	
	//  Load Expressjs config
	
	config(app);

	//  Load routes config
	
	routes(app);
	
	//  Load error routes + pages
	
	// errors(app);
	
	
	return app;
	
};