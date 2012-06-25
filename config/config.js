/**
 * Config
 */

const express   = require('express')
		, mongoose 	= require('mongoose');


module.exports = function(app, MongoStore) {

	//  Setup DB Connection
	// var dblink = process.env.MONGOLAB_URI || 'mongodb://192.168.0.11/battle_arena';
	var dblink = process.env.MONGOLAB_URI || 'mongodb://localhost/battle_arena';
	const db = mongoose.createConnection(dblink);


	//  Configure expressjs
	app.configure(function() {
		this
			.use(express.cookieParser())
			.use(express.bodyParser())
			.use(express.logger(
				'\033[90m:method\033[0m \033[36m:url\033[0m \033[90m:response-time ms\033[0m'
			))
			// Helpers
			.dynamicHelpers({ 
					messages: require('express-messages')
				,	session: function(req, res) {
					return req.session;
				}
				,	user: function(req, res) {
					return req.session.user;
				}
				,	character: function(req, res) {
					return req.session.character;
				}
				,	spells: function(req, res) {
					return req.session.spells;
				}
			})
			.use(express.errorHandler({
				dumpException: true, 
				showStack: true
			}))
			.use(express.session({
				secret: '$eCr3t!', 
				key: 'express.sid',
				store: MongoStore
				// maxAge: new Date(Date.now() + 3600000),
				// store: 	new MongoStore({
				// 	db: 'battle_arena',
				// 	// db: 'heroku_app3888338',
				// 	host: 'localhost',
				// 	// host: '',
				// 	// port: 6646,  // optional, default: 27017
				// 	// port: 31867,
				// 	// username: 'admin', // optional
				// 	// password: 'secret', // optional
				// 	// collection: 'mySessions' // optional, default: sessions
				// })
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