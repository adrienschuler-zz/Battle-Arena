(function() {

  exports.initialize = function() {
    var spells;
    spells = [
      {
        name: "Fireball",
        description: "Launch a devastating fireball.",
        thumbnail: "fireball",
        is_default: 1,
        damage: 10,
        cost: 20
      }, {
        name: "Frozenball",
        description: "Launch a frozenball.",
        thumbnail: "frozenball",
        is_default: 1,
        damage: 5,
        cost: 5
      }, {
        name: "Heal",
        description: "Heal yourself for {heal} points.",
        thumbnail: "heal",
        is_default: 1,
        heal: 20,
        cost: 15
      }, {
        name: "Replenish health",
        description: "Heal yourself overtime for {heal} points per turn during {round_duration} turns.",
        thumbnail: "replenish_health",
        is_default: 1,
        heal: 15,
        cost: 30,
        round_duration: 3
      }
    ];
    return spells;
  };

}).call(this);
