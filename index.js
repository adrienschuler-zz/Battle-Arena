/**
 *  Boot
 */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'local';

require('./lib/exceptions');

const express				= require('express')
		, sio 					= require('socket.io')
		, expose 				= require('express-expose')
		// , redis 				= process.env.REDISTOGO_URL ? require('redis-url').connect(process.env.REDISTOGO_URL) : require('redis')
		, redis 				= require('redis-url').connect()
		, RedisStore 		= require('connect-redis')(express)
  	, sessionStore 	= new RedisStore

		, sockets 			= require('./app/sockets')
		, models 				= require('./config/models')
		, config 				= require('./config/config')
		, routes 				= require('./config/routes')
		, environments 	= require('./config/environments')
		, errors 				= require('./config/errors')
		, init 					= require('./config/init')
		, app 					= express.createServer();


var client = redis.createClient();
init(client);


// if (process.env.NODE_ENV === 'local') {
// 	var db = {
// 		db: 'battle_arena',
// 		host: 'localhost'
// 	};
// } else {
// 	var fs 	= require('fs'),
// 			env = JSON.parse(fs.readFileSync('./config/credentials.json', 'utf-8'));
// 	var db 	= {
// 		db: env.MONGOLAB_DB,
// 		host: env.MONGOLAB_HOST,
// 		port: parseInt(env.MONGOLAB_PORT),
// 		username: env.MONGOLAB_USERNAME,
// 		password: env.MONGOLAB_PASSWORD
// 	};
// }

// var MongoStore = new mongoStore(db);


// Load Mongoose Models	
models();

// Load Expressjs config
// config(app, sessionStore);
config(app, sessionStore);

// Load Environmental Settings
environments(app);

// Attach socket.io server
var io = sio.listen(app);

io.configure(function() { 
	io.set('transports', ['xhr-polling']); // Heroku socket.io restrictions to xhr-polling (WebSockets aren't supported yet)
	io.set('polling duration', 10);
	io.set('authorization', true); // necessary ?
	io.set('store', new sio.RedisStore);
	io.set('log level', 3);
	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
});

// Load routes config
routes(app, client);

// Load error routes + pages
errors(app);

// Socket IO
// sockets(app, io, sessionStore);
sockets(app, io, sessionStore);

// Run server
app.listen(process.env.PORT || 3000);

console.log('\x1b[36mBattle Arena\x1b[90m v%s\x1b[0m running as \x1b[1m%s\x1b[0m on http://%s:%d',
	app.set('version'),
	app.set('env'),
	app.set('host'),
	app.address().port
);