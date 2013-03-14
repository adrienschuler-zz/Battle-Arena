(function(BA) {
  BA.Tchat = Class.extend({
    init: function(username) {
      this.username = username;
      this.initElements();
      this.initTemplates();
      this.initSocketIO();
      this.bindEvents();
    },

    initElements: function() {
      this.elements = {
        tchat: $('.tchat-container'),
        input: $('#tchat-input'),
        side: $('.tchat-side')
      };
    },

    initTemplates: function() {
      this.templates = {
        welcome: $('#welcomeTemplate'),
        join: $('#userJoinTemplate'),
        message: $('#messageTemplate'),
        disconnect: $('#disconnectTemplate'),
        users: $('#activeUsersTemplate')
      };
    },

    render: function(tmpl, data, target) {
      if (_.isObject(data)) data.time = now();
      if (!target) target = this.elements.tchat;
      this.templates[tmpl].tmpl(data).appendTo(target);
      this.updateScrollbar();
    },

    bindEvents: function() {
      this.sendMessage();
      this.leaveTchat();
      this.searchOpponent();
      // this.fightProposition();
    },

    initSocketIO: function() {
      var self = this;
      this.socket = io.connect().of('/tchat')

        .on('connect', function() {
          self.socket.emit('join', self.username);
        })

        .on('welcome', function(data) {
          self.render('welcome', data);
        })

        .on('userjoin', function(data) {
          self.render('join', data);
        })

        .on('disconnect', function(data) {
          self.render('disconnect', data);
        })

        .on('message', function(data) {
          self.render('message', data);
        })

        .on('updateusers', function(data) {
          $.each(data, function(key, user) {
            user.me = user.username === self.username ? 1 : 0;
          });
          self.elements.side.html('');
          self.render('users', data, self.elements.side);
        })

        .on('opponentsavailable', function(opponent) {
          $.mobile.showPageLoadingMsg('a', 'Waiting for ' + opponent.username + ' response...', true);
        })

        .on('redirect', function(hash) {
          self.socket.disconnect();
          $(document).attr('location', '/game?' + hash);
        })

        .on('fightproposition', function(fighters) {
          $('<div>').simpledialog2({
            animate: false,
            mode: 'button',
            headerText: 'Confirmation',
            buttonPrompt: '<div style="padding:10px;"><p>' + fighters[0].username + ' wants to fight against you !</p></div>',
            buttons : {
              "Let's fight !": {
                click: function() {
                  self.socket.emit('fightaccepted', fighters);
                }
              },
              'Refuse': {
                icon: "delete",
                theme: "c",
                click: function() {
                  self.socket.emit('fightrefused', fighters[0].socketID);
                }
              }
            }
          });
        })

        .on ('fightrefused', function() {
          $.mobile.hidePageLoadingMsg();
        });
    },

    updateScrollbar: function() {
      this.elements.tchat.animate({
        scrollTop: 99999
      }, 200);
    },

    sendMessage: function() {
      var self = this;
      this.elements.input.bind('keyup', function(key) {
        if (key.keyCode === 13) {
          key.preventDefault();
          self.socket.emit('message', self.elements.input.val());
          self.elements.input.val('');
        }
      });
    },

    leaveTchat: function() {
      var self = this;
      $('.nav-logout, .nav-profile, .nav-ranking').bind('click', function() {
        self.socket.disconnect();
      });
    },

    searchOpponent: function() {
      var self = this;
      $('.nav-search').bind('click', function() {
        self.socket.emit('searchopponent');
      });
    },

    // fightProposition: function() {
    //  $('.tchat-side a').live('click', function() {
    //    this.socket.emit('fightproposition', {
    //      from: +$('#socketID').val(),
    //      to: +$(this).data('socket-id')
    //    });
    //  });
    // }

  });
})(window.BA = window.BA || {});
