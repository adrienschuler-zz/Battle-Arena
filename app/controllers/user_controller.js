/**
 * User controller
 */

var mongoose    = require('mongoose')
  , $           = require('underscore')
  , controller  = {}
  , db
  , UserModel
  , CharacterModel
  , SpellModel
  , User
  , Character
  , Spell;


module.exports = function (_app) {
  db              = _app.set('db');
  UserModel       = db.main.model('User');
  CharacterModel  = db.main.model('Character');
  SpellModel      = db.main.model('Spell');
  User            = new UserModel();
  Character       = new CharacterModel();
  Spell           = new SpellModel();
  return controller;
};


// GET
controller.login = function(req, res) {
  res.render('user/login', {
    title: 'BATTLE ARENA - Login'
  });
};


// GET
controller.signup = function(req, res) {
  res.render('user/signup', {
    title: 'BATTLE ARENA - Register'
  });
};


// GET
controller.profile = function(req, res) {
  res.render('user/profile', {
    title: 'BATTLE ARENA - profile'
  });
};


// GET
controller.spells = function(req, res) {
  SpellModel
    .find(function(error, s) {
      if (error) console.log(error);
      if (!s) {
        req.flash('error', "An error occured while retrieving this spell.");
        res.redirect('/profile');
      } else {
        res.render('user/spells', {
            title: 'BATTLE ARENA - Spells'
          , all_spells: s
          , current_id: req.params.id
        });
      }
  });
};


// GET
controller.rankings = function(req, res) {
  var datas = [];
  UserModel.find({ is_active: 1}, ['username', '_characters'])
  .populate('_characters', ['total_experience', 'level', 'avatar', 'wins', 'looses'])
  .run(function(error, users) {
    if (error) console.error(error);

    $.each(users, function(user) {
      datas.push({
          username: user.username
        , total_experience: user.character.total_experience
        , level: user.character.level || 1
        , avatar: user.character.avatar
        , victories: user.character.wins || 0
        , defeats: user.character.looses || 0
      });
    });

    datas = bubbleSort(datas, 'total_experience');

    res.render('user/rankings', {
        title: 'BATTLE ARENA - Rankings'
      , datas: datas
    });
  });
};


// POST
controller.create = function(req, res) {
  var user = req.body.user;
  if (user.username && user.password) {
    UserModel.findOne({ username: user.username }, function(error, user_data) {
      if (error || user_data) {
        console.error(error);
        req.flash('error', 'This username is not availabe.');
        res.redirect('/signup');
      } else {
        User.create(req.body.user, UserModel, SpellModel, CharacterModel, function(user) {
          authenticate(req, user.username, user.password, function(success) {
            if (success) {
              req.flash('success', 'Your account has been successfully created.');
              res.redirect('/tchat');
            } else {
              req.flash('error', 'An error occurred during the authentication process, retry later.');
              res.redirect('/signup');
            }
          });
        });
      }
    });
  } else {
    req.flash('error', 'Fill the required fields...');
    res.redirect('/signup');
  }
};


// POST
controller.authenticate = function(req, res) {
  console.debug('authenticate');
  var user = req.body.user;
  if (user && user.username && user.password) {
    authenticate(req, user.username, user.password, function(success) {
      if (success) {
        res.redirect('/tchat');
        console.debug('authenticate success');
      } else {
        console.debug('authenticate error not found');
        req.flash('error', 'User not found.');
        res.redirect('/login');
      }
    });
  } else {
    console.debug('authenticate error fields');
    req.flash('error', 'Fill the required fields...');
    res.redirect('/login');
  }
};


// GET
controller.logout = function(req, res) {
  delete req.session.user;
  delete req.session.character;
  delete req.session.spells;
  res.redirect('/');
};


// authenticate function
function authenticate(req, username, password, callback) {
  UserModel.findOne({
      username: username
    , password_hash: User.encryptPassword(password)
  })
  .run(function(error, user_data) {
    if (error || !user_data) {
      console.error(error);
      return callback(false);
    } else {
      CharacterModel.findOne({
        _id: user_data.character
      })
      .populate('_spells_equipped')
      .run(function(error, character_data) {
        if (error) {
          console.error(error);
          return callback(false);
        }

        req.session.user = user_data;
        req.session.spells = character_data._spells_equipped;
        // character_data._spells_equipped.splice(0, character_data._spells_equipped.length + 1);
        req.session.character = character_data;
        return callback(true);
      });
    }
  });
}

function swap(items, firstIndex, secondIndex) {
  var temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}

function bubbleSort(items, key) {
  var len = items.length,
    i, j, stop;
  for (i = 0; i < len; i++) {
    for (j = 0, stop = len - 1; j < stop; j++) {
      if (items[j][key] < items[j + 1][key]) {
        swap(items, j, j + 1);
      }
    }
  }
  return items;
}
