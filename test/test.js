(function() {
  var Browser, assert, browser;

  assert = require('assert');

  Browser = require('zombie');

  browser = new Browser();

  describe('/user/signup', function() {
    it('should access signup page', function(done) {
      return browser.visit('http://localhost:5000/user/signup', function() {
        assert.equal(browser.location.pathname, '/user/signup');
        return done();
      });
    });
    return it('should signup and redirect to game homepage', function(done) {
      return browser.fill('#email', 'test@test.test').fill('#username', 'test').fill('#password', 'test').pressButton('.submit', function() {
        assert.equal(browser.location.pathname, '/game');
        return done();
      });
    });
  });

  describe('/session/destroy', function() {
    it('should logout from the game', function(done) {
      return browser.clickLink('.nav-logout', function() {
        assert.equal(browser.location.pathname, '/user/login');
        return done();
      });
    });
    return it('should not be able to access the game page anymore', function(done) {
      return browser.visit('http://localhost:5000/game', function() {
        assert.equal(browser.location.pathname, '/user/login');
        return done();
      });
    });
  });

  describe('/user/login', function() {
    it('should access login page', function(done) {
      return browser.visit('http://localhost:5000/user/login', function() {
        assert.equal(browser.location.pathname, '/user/login');
        return done();
      });
    });
    return it('should login and redirect to game homepage', function(done) {
      return browser.fill('#username', 'test').fill('#password', 'test').pressButton('.submit', function() {
        assert.equal(browser.location.pathname, '/game');
        return done();
      });
    });
  });

  describe('/session/destroy', function() {
    it('should logout from the game', function(done) {
      return browser.clickLink('.nav-logout', function() {
        assert.equal(browser.location.pathname, '/user/login');
        return done();
      });
    });
    return it('should not be able to access the game page anymore', function(done) {
      return browser.visit('http://localhost:5000/game', function() {
        assert.equal(browser.location.pathname, '/user/login');
        return done();
      });
    });
  });

}).call(this);
