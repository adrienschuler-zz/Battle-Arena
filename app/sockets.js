var connect     = require('connect'),
  crypto        = require('crypto'),
  $             = require('underscore');


module.exports = function(_app, _io, sessionStore) {
  var app = _app,
    io    = _io,
    connected_users = [],
    games = [];


  io.set('authorization', function(hsData, accept) {
    if (hsData.headers.cookie) {
      var cookie = require('connect').utils.parseCookie(hsData.headers.cookie),
          sid = cookie['connect.sid'];

      sessionStore.load(sid, function(err, session) {
        if(err || !session) {
          console.error(err);
          return accept('Error retrieving session!', false);
        }
        hsData.session = session;
        return accept(null, true);
      });
    } else {
      return accept('No cookie transmitted.', false);
    }
  });

  var tchat = io
    .of('/tchat')
    .on('connection', function(socket) {
      var hs = socket.handshake,
          session = hs.session,
          current_user = {
            socketID: socket.id,
            userID: session.user._id,
            username: session.user.username,
            avatar: session.character.avatar
      };

      var intervalID = setInterval(function() {
        session.reload(function() {
          session.touch().save();
        });
      }, 60 * 1000);

      connected_users.push(current_user);

      tchat.emit('updateusers', connected_users);

      socket.emit('welcome', current_user);

      socket.broadcast.emit('userjoin', {
        username: session.user.username,
        avatar: session.character.avatar
      });

      // message event
      socket.on('message', function(msg) {
        tchat.emit('message', {
          username: session.user.username,
          message: msg,
          avatar: session.character.avatar
        });
      });

      // disconnect event
      socket.on('disconnect', function() {
        clearInterval(intervalID);

        var disconnected_user = session.user.username;
        $.each(connected_users, function(u, i) {
          if (u.username === disconnected_user) {
            connected_users.splice(i, 1);
          }
        });

        socket.broadcast.emit('disconnect', {
          username: disconnected_user
        });

        tchat.emit('updateusers', connected_users);
      });

      // search opponent event
      socket.on('searchopponent', function() {
        var available = [];
        $.each(connected_users, function(u) {
          if (u.username !== session.user.username) {
            available.push(u);
          }
        });

        var fighters = [{
            socketID: socket.id,
            userID: session.user._id,
            username: session.user.username
          }];

        fighters.push(available[0]);

        this.emit('opponentsavailable', available[0]);
        io.of('/tchat')
          .sockets[available[0].socketID]
          .emit('fightproposition', fighters);
      });

      // fight accepted
      socket.on('fightaccepted', function(fighters) {
        var hash = 'u1=' + fighters[0].userID + '&u2=' + fighters[1].userID;

        $.each(fighters, function(fighter) {
          io.of('/tchat')
            .sockets[fighter.socketID]
            .emit('redirect', hash);

          io.of('/tchat')
            .sockets[fighter.socketID]
            .broadcast.to('/game');
        });
      });

      // fight refused
      socket.on('fightrefused', function(id) {
        io.of('/tchat')
          .sockets[id]
          .emit('fightrefused');
      });

    });


  var fighters = [],
      rooms = [];

  var game = io
    .of('/game')
    .on('connection', function(socket) {
      var hs = socket.handshake,
          session = hs.session;

      socket.on('join', function(id, fighter) {
        if (!rooms[id] || rooms[id].fighters.length > 1) {
          rooms[id] = {};
          rooms[id].fighters = [];
        }
        var fighters = rooms[id].fighters;
        fighter.socketID = socket.id;
        fighters.push(fighter);

        if (fighters.length === 2) {

          $.each(fighters, function(f) {
            io.of('/game')
            .sockets[f.socketID]
            .emit('joinsuccess', fighters);
          });

          if (fighters[0].agility > fighters[1].agility) {
            io.of('/game').sockets[fighters[0].socketID].emit('play');
            io.of('/game').sockets[fighters[1].socketID].emit('wait');
          } else {
            io.of('/game').sockets[fighters[1].socketID].emit('play');
            io.of('/game').sockets[fighters[0].socketID].emit('wait');
          }
        }
      });

      socket.on('launchspell', function(id, spell) {
        var opponentSocketID = getOpponentSocketID(rooms[id], socket.id);
        io.of('/game').sockets[opponentSocketID].emit('attack', spell);
      });

      socket.on('play', function() {
        io.of('/game').sockets[socket.id].emit('play');
      });

      socket.on('wait', function() {
        io.of('/game').sockets[socket.id].emit('wait');
      });

      // socket.on('timeout', function(id) {
      //  var opponentSocketID = getOpponentSocketID(rooms[id], socket.id);
      //  io.of('/game').sockets[socket.id].emit('wait');
      //  io.of('/game').sockets[opponentSocketID].emit('play');
      // });
  });
};

function getOpponentSocketID(room, socketID) {
  var fighters = room.fighters;
  return fighters[0].socketID === socketID ? fighters[1].socketID : fighters[0].socketID;
}
