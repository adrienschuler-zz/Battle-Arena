var path = require('path');

try {
	require.paths = require.paths.unshift(__dirname + '/../node_modules');
} catch(e) {
	process.env.NODE_PATH = path.join(__dirname, '/../node_modules') + ':' + process.env.NODE_PATH;
}

require('./lib/exceptions');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'local';


var express				= require('express')
	, nowjs 				= require('now')
	, mongoose 			= require('mongoose')	
	// , stylus 				= require('stylus')

	// , models 				= require('./config/models')

	, User = require('./app/models/user')

	, config 				= require('./config/config')
	, routes 				= require('./config/routes')
	, environments 	= require('./config/environments')
	, errors 				= require('./config/errors');

var app = express.createServer();

config(app);
environments(app);

var port = process.env.PORT || 3000;

app.listen(port);

var everyone = nowjs.initialize(app);

routes(app, everyone);
errors(app);

console.log('\x1b[36mBattle Arena\x1b[90m v%s\x1b[0m running as \x1b[1m%s\x1b[0m on http://%s:%d',
	app.set('version'),
	app.set('env'),
	app.set('host'),
	app.address().port
);
