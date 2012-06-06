/**
 * Config
 */

const express   = require('express')
		, mongoose 	= require('mongoose');


module.exports = function(app, sessionStore) {

	//  Setup DB Connection
	// var dblink = process.env.MONGOLAB_URI || 'mongodb://192.168.0.11/battle_arena';
	var dblink = process.env.MONGOLAB_URI || 'mongodb://localhost/battle_arena';
	// var dblink = process.env.MONGOLAB_URI || 'mongodb://10.50.127.202/battle_arena';
	const db = mongoose.createConnection(dblink);


	//  Configure expressjs
	app.configure(function() {
		this
			.use(express.cookieParser())
			.use(express.bodyParser())
			.use(express.logger(
				'\033[90m:method\033[0m \033[36m:url\033[0m \033[90m:response-time ms\033[0m'
			))
			.dynamicHelpers({ 
				messages: require('express-messages') 
			})
			.use(express.errorHandler({
				dumpException: true, 
				showStack: true
			}))
			.use(express.session({ 
				secret: '$eCr3t!', 
				key: 'express.sid',
				// store: new express.session.MemoryStore({ reapInterval: 60000 * 10 })
				store: sessionStore
			}));
	});

	//  Add template engine
	app.configure(function() {
		this
			.set('views', __dirname + '/../app/views')
			.set('view engine', 'jade')
			.use(express.static(__dirname + '/../public'));
	});

	//  Save reference to database connection
	app.configure(function() {
		app.set('db', { 
				'main': 			db
			, 'User': 			db.model('User')
			, 'Character': 	db.model('Character')
			, 'Spell': 			db.model('Spell')
		})
		app.set('version', '0.0.1');
	});
	 
	
	return app;
};