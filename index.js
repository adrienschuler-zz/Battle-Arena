/**
 *  Boot
 */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'local';

require('./lib/exceptions');
 
const express				= require('express')
		//, mongoose			= require('mongoose')
		, sio 					= require('socket.io')

		, sessionStore 	= new express.session.MemoryStore({ reapInterval: 60000 * 10 })

		, models 				= require('./config/models')
		, config 				= require('./config/config')
		, routes 				= require('./config/routes')
		, environments 	= require('./config/environments')
		, errors 				= require('./config/errors')

		, app 					= express.createServer();


// Load Mongoose Models	
models(app);

// Load Expressjs config
config(app, sessionStore);

// Load Environmental Settings
environments(app);

// Attach socket.io server
var io = sio.listen(app);

// Heroku restrictions (WebSockets aren't supported yet)
io.configure(function() { 
	io.set('transports', ['xhr-polling']);
	io.set('polling duration', 10);
});

// Load routes config
routes(app, io, sessionStore);

// Load error routes + pages
errors(app);

// Run server
app.listen(process.env.PORT || 3000);

console.log('\x1b[36mBattle Arena\x1b[90m v%s\x1b[0m running as \x1b[1m%s\x1b[0m on http://%s:%d',
	app.set('version'),
	app.set('env'),
	app.set('host'),
	app.address().port
);