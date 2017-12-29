/**
 *  Boot
 */

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'local';

require('./lib/exceptions');

const app       = require('express')(),
  server        = require('http').Server(app),
  expose        = require('express-expose'),
  session       = require('express-session'),
  sharedsession = require('express-socket.io-session'),

  io            = require('socket.io')(server),

  redis         = process.env.REDISTOGO_URL
    ? require('redis-url').connect(process.env.REDISTOGO_URL)
    : require('redis').createClient()

  RedisStore    = require('connect-redis')(session),

  sockets       = require('./app/sockets'),
  models        = require('./config/models'),
  config        = require('./config/config'),
  routes        = require('./config/routes'),
  environments  = require('./config/environments'),
  // errors        = require('./config/errors'),
  init          = require('./config/init');


// Initialize Redis
init(redis);

// Load Mongoose Models
models();

// Load Expressjs config
config(app, redis, RedisStore, session);

// Load Environmental Settings
environments(app);

// Attach socket.io server
io.attach(server);

// io.configure(function() {
//   io.set('transports', ['xhr-polling']); // Heroku socket.io restrictions to xhr-polling (WebSockets aren't supported yet)
//   io.set('polling duration', 10);
//   io.set('authorization', true); // necessary ?
//   // io.set('store', sessionStore);
//   io.set('log level', 3);
//   io.enable('browser client minification');
//   io.enable('browser client etag');
//   io.enable('browser client gzip');
// });

// Load routes config
routes(app);

// Load error routes + pages
// errors(app);

sockets(app, io, session);
// Socket IO

// Run server
server.listen(process.env.PORT || 3000);

console.log('\x1b[36mBattle Arena\x1b[90m v%s\x1b[0m running as \x1b[1m%s\x1b[0m on http://%s:%d',
  app.set('version'),
  app.set('env'),
  app.set('host'),
  app.set('port')
);
