
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  // , memStore = require('connect/middleware/session/memory');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  // app.use(express.cookieParser());
  // app.use(express.session({store: memStore({
  //   reapInterval: 60000 * 10
  // })}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Functions

// function checkSession(req, res, next){
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect('/sessions/new?redirect=' + req.url);
//   }
// };

// Routes

app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/login', routes.index);
app.get('/register', routes.register);
app.get('/chatroom', routes.chatroom);

// app.get('/sessions/new', function(req, res){
//   res.render('sessions/new', {locals: {
//     redirect: req.query.redirect
//   }});
// });

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
