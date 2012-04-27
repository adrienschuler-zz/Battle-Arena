/**
 * App
 */

const express				= require('express')
	  , mongoose    	= require('mongoose')
	  , io 						= require('sockect.io')
//  	, stylus      	= require('stylus')

		, models 				= require('./models')
		, config 				= require('./config')
		, routes 				= require('./routes')
		, environments 	= require('./environments')
		, errors 				= require('./errors'); 


module.exports = function() {

	//  Create Server

	const app = express.createServer();
	
	//  Load Mongoose Models
	
	models(app);
	
	//  Load Expressjs config
	
	config(app);

	//  Load Environmental Settings

	environments(app);

	//  Load routes config
	
	routes(app);
	
	//  Load error routes + pages
	
	errors(app);
	
	
	return app;
	
};