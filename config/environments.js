/**
 * Environments
 */

module.exports = function(app) {

  var port = process.env.PORT || 3000;

  app
    .set('host', 'localhost')
    .set('port', port)
    .set('ENV','local');

  // app
  //   .set('host', 'esgi-battle-arena.herokuapp.com')
  //   .set('port', port)
  //   .set('ENV','production');

  return app;
};
