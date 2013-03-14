/**
 * Config
 */

const express   = require('express')
    , mongoose  = require('mongoose');


module.exports = function(app, sessionStore) {

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
      .use(express.errorHandler({
        dumpException: true,
        showStack: true
      }))
      .use(express.session({
        secret: '$eCr3t!',
        // key: 'express.sid',
        store: sessionStore
      }))

      // Helpers
      .dynamicHelpers({
          messages: require('express-messages')
        , session: function(req, res) {
          return req.session;
        }
        , user: function(req, res) {
          return req.session.user || null;
        }
        , character: function(req, res) {
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
        }
        , spells: function(req, res) {
          return req.session.spells || null;
        }
      });
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
        'main':       db
      , 'User':       db.model('User')
      , 'Character':  db.model('Character')
      , 'Spell':      db.model('Spell')
    })
    app.set('version', '0.0.1');
  });

  return app;
};
