(function(BA) {
  BA.Game = Class.extend({
    init: function(player, spells) {
      this.opponent = null;
      this.id = location.search;
      this.player = player;
      this.spells = spells;
      this.player.hitpoints_left = this.player.hitpoints;
      this.player.manapoints_left = this.player.manapoints;

      $.mobile.showPageLoadingMsg();

      this.initElements();
      this.initTemplates();
      this.initSocketIO();
      this.bindEvents();
    },

    initElements: function() {
      var bars = $('.bar');
      this.elements = {
        tchat: $('.tchat-container'),
        spells: $('.spell'),
        bars: bars,
        opponent_life_bar: bars.get(0),
        opponent_mana_bar: bars.get(1),
        life_bar: bars.get(2),
        mana_bar: bars.get(3)
      };
    },

    initTemplates: function() {
      this.templates = {
        welcome: $('#welcomeTemplate'),
        play: $('#playTemplate'),
        wait: $('#waitTemplate'),
        attack: $('#attackTemplate'),
        heal: $('#healTemplate'),
        win: $('#winTemplate')
      };
    },

    render: function(tmpl, data, target) {
      if (_.isObject(data)) data.time = now();
      if (!target) target = this.elements.tchat;
      var result = this.templates[tmpl].tmpl(data);

      if (target === 'popup') {
        return result[0].innerHTML;
      }

      result.appendTo(target);
      this.updateScrollbar();
    },

    bindEvents: function() {
      this.initializeBars();
      this.launchSpell();
    },

    initSocketIO: function() {
      var self = this;
      this.socket = io.connect().of('/game')

        .on('connect', function() {
          var opponent = self.player;
          self.socket.emit('join', self.id, opponent);
        })

        .on('joinsuccess', function(fighters) {
          $.mobile.hidePageLoadingMsg();
          self.opponent = fighters[0].username === self.player.username ? fighters[1] : fighters[0];
          self.opponent.hitpoints_left = self.opponent.hitpoints;
          self.opponent.manapoints_left = self.opponent.manapoints;
          self.render('welcome', { username: self.opponent.username, time: now() });
        })

        .on('wait', function() {
          self.render('wait', { username: self.opponent.username });
          self.wait();
        })

        .on('play', function() {
          self.render('play', {});
          self.play();
        })

        .on('attack', function(spellID) {
          // self.attackedBarsAnimation(self.findSpellById(spellID));
          self.barsAnimations(self.findSpellById(spellID), false);
        });
    },

    launchSpell: function() {
      var self = this;
      $('.spell').bind('click', function() {
        if ($(this).hasClass('disabled')) return;
        var spell = self.findSpellById($($(this)).data('spell-id'));
        $('<div>').simpledialog2({
          animate: false,
          mode: 'button',
          headerText: spell.name,
          buttonPrompt: '<div style="padding:10px;"><center><img src="/images/spells/'+spell.thumbnail+'.png"><p>'+spell.description+'</p></center></div>',
          buttons : {
            'Launch !': {
              click: function() {
                // self.attackerBarsAnimation(spell);
                self.barsAnimations(spell, true);
                self.checkManaLeft();
              }
            },
            'Cancel': { icon: "delete", theme: "c", click: function() {} }
          }
        });
        return false;
      });
    },

    initializeBars: function() {
      var self = this;
      setTimeout(function() {
        self.elements.bars.width('90.7%');
      }, 200);
    },

    wait: function() {
      $.mobile.showPageLoadingMsg('a', 'Waiting for ' + this.opponent.username + ' turn...', true);
      this.disableSpells(true);
    },

    play: function() {
      this.disableSpells(false);
      this.checkManaLeft();
      $('.ui-simpledialog-screen').remove();
      $.mobile.hidePageLoadingMsg();
    },

    animateBar: function(options) {
      var bar = this.elements[options.bar];
      if (options.operator === 'inc') {
        $(bar).width((parseFloat(bar.style.width) + (options.amount * 100 / options.total)) + '%');
      } else {
        $(bar).width((parseFloat(bar.style.width) - (options.amount * 100 / options.total)) + '%');
      }
    },

    barsAnimations: function(spell, attacker) {
      if (attacker) {
        this.socket.emit('launchspell', this.id, spell._id);
      } else {
        $.mobile.hidePageLoadingMsg();
      }

      if (spell.damage) {
        this.render('attack', { me: attacker ? true : false, opponent: this.opponent.username, spell: spell.name, damages: spell.damage });

        if (attacker) {
          this.opponent.hitpoints_left -= spell.damage;
          this.player.manapoints_left -= spell.mana_cost;
        } else {
          this.player.hitpoints_left -= spell.damage;
          this.opponent.manapoints_left -= spell.mana_cost;
        }

        this.animateBar({
          bar: attacker ? 'opponent_life_bar' : 'life_bar',
          total: attacker ? this.opponent.hitpoints : this.player.hitpoints,
          amount: spell.damage,
          operator: 'dec'
        });

        this.animateBar({
          bar: attacker ? 'mana_bar' : 'opponent_mana_bar',
          total: attacker ? this.player.manapoints : this.opponent.manapoints,
          amount: spell.mana_cost,
          operator: 'dec'
        });

        if (attacker) {
          if (this.opponent.hitpoints_left <= 0) {
            return this.gainExperience();
          }
        } else {
          if (this.player.hitpoints_left <= 0) {
            return this.loose();
          }
        }
      }

      if (spell.heal) {
        this.render('heal', { me: attacker ? true : false, spell: spell.name, heal: spell.heal, opponent: this.opponent.username });

        if (attacker) {
          this.player.hitpoints_left += spell.heal;
          this.player.manapoints_left -= spell.mana_cost;
        } else {
          this.opponent.hitpoints_left += spell.heal;
          this.opponent.manapoints_left -= spell.mana_cost;
        }

        this.animateBar({
          bar: attacker ? 'life_bar' : 'opponent_life_bar',
          total: attacker ? this.player.hitpoints : this.opponent.hitpoints,
          amount: spell.heal,
          operator: 'inc'
        });

        this.animateBar({
          bar: attacker ? 'mana_bar' : 'opponent_mana_bar',
          total: attacker ? this.player.manapoints : this.opponent.manapoints,
          amount: spell.mana_cost,
          operator: 'dec'
        });
      }

      if (attacker) {
        this.wait(this.opponent.username);
        this.socket.emit('wait');
      } else {
        this.socket.emit('play');
        this.play();
      }
    },

    gainExperience: function(callback) {
      var self = this;
      $.ajax({
        url: '/character/gainExperience/',
        type: 'POST',
        data: { opponentLevel: self.opponent.level }
      }).done(function(rewards) {
        self.win(rewards);
      });
    },

    win: function(rewards) {
      var self = this;
      rewards.opponent = self.opponent.username;
      $('<div>').simpledialog2({
        animate: false,
        mode: 'button',
        headerText: 'Victory !',
        buttonPrompt: self.render('win', rewards, 'popup'),
        buttons : {
          'Ok !': {
            click: function() {
              self.socket.disconnect();
              $(document).attr('location', '/profile');
            }
          }
        }
      });
    },

    loose: function() {
      var self = this;

      $.ajax({ url: '/character/loose/', type: 'POST' });

      $('<div>').simpledialog2({
        animate: false,
        mode: 'button',
        headerText: 'Defeat !',
        buttonPrompt: '<div style="padding:10px;"><center><img src="/images/game/icons/death.png"><p>You have been defeated by ' + self.opponent.username + ' !</p></center></div>',
        buttons : {
          'Ok :(': {
            click: function() {
              self.socket.disconnect();
              $(document).attr('location', '/');
            }
          }
        }
      });
    },

    checkManaLeft: function() {
      var self = this;
      $.each(this.elements.spells, function(key, spell) {
        if (self.player.manapoints_left < $(spell).data('mana-cost')) {
          $(spell).addClass('disabled');
        } else {
          $(spell).removeClass('disabled');
        }
      });
    },

    disableSpells: function(bool) {
      if (bool) {
        this.elements.spells.addClass('disabled');
      } else {
        this.elements.spells.removeClass('disabled');
      }
    },

    updateScrollbar: function() {
      this.elements.tchat.animate({
        scrollTop: 99999
      }, 200);
    },

    findSpellById: function(id) {
      for (var i = 0, l = spells.length - 1; i < l; i++) {
        var spell = this.spells[i];
        if (spell["_id"] === id) {
          if (!spell.description) this.getSpellDescription(spell);
          delete spell.is_default;
          return spell;
        }
      }
    },

    getSpellDescription: function(spell) {
      var new_desc  = spell._description
        , matches   = new_desc.match(/\{((.*?))\}/g);
      $.each(matches, function(key, match) {
        var match = match.replace(/{|}/g, '');
        if (spell[match]) {
          new_desc = new_desc
            .replace(match, spell[match])
            .replace(/{|}/g, '');
        }
      });
      spell.description = new_desc;
      delete spell._description;
    },

    regenerateMana: function() {},

    // initTimer: function() {
    //  this.elements.timer.html(20);
    // },

    // timeout: function() {
    //  var self = this;
    //  console.log('timeout function call');
    //  setTimeout(function() {

    //    var seconds = parseInt(self.elements.timer.html());
    //    if (seconds === 0) {
    //      self.socket.emit('timeout', self.id);
    //    } else {
    //      self.elements.timer.html(seconds - 1);
    //      timeout();
    //    }
    //  }, 1000);
    // }

  });
})(window.BA = window.BA || {});
