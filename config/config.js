/**
 * Config
 */

const express      = require('express'),
      mongoose     = require('mongoose'),
      bodyParser   = require('body-parser'),
      morgan       = require('morgan'),
      errorhandler = require('errorhandler'),
      flash        = require('express-flash');


module.exports = function(app, cookieParser, passport, sessionStore, session) {

  // Setup DB Connection
  // var dblink = process.env.MONGOLAB_URI || 'mongodb://192.168.0.11/battle_arena';
  var dblink = process.env.MONGOLAB_URI || 'mongodb://localhost/battle_arena';
  const db = mongoose.createConnection(dblink);


  // Configure expressjs
  app
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(morgan('dev'))
    .use(flash())

    .use(errorhandler({
      dumpException: true,
      showStack: true
    }))

    .use(session({
      secret: '??????',
      store: sessionStore,
      proxy: true,
      resave: true,
      saveUninitialized: true
    }))

    .use(passport.initialize())
    .use(passport.session())

    // Helpers
    .use(function(req, res, next) {
      res.locals.session = (function(req, res) {
        return req.session;
      });

      res.locals.user = (function(req, res) {
        return req.session.user || null;
      });

      res.locals.character = (function(req, res) {
        if (!req.session.character) return null;

        character = req.session.character;

        character.hitpoints = function() {
          return 50 + (character.stamina * 5)
        };

        character.manapoints = function() {
          return 50 + (character.intellect * 5);
        };

        character.nextLevel = function() {
          return 200 * (Math.pow(character.level + 1, 2));
        };

        return character;
      });

      res.locals.spells = (function(req, res) {
        return req.session.spells || null;
      });

      next();
    })

    // Add template engine
    .set('views', __dirname + '/../app/views')
    .set('view engine', 'jade')
    .use(express.static(__dirname + '/../public'))

  // Save reference to database connection
  app.set('db', {
    'main':       db,
    'User':       db.model('User'),
    'Character':  db.model('Character'),
    'Spell':      db.model('Spell')
  })

  .set('version', '0.0.1');

  return app;
};
