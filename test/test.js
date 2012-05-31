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
    return it('should signup and redirect to login', function(done) {
      return browser.fill('#email', 'test@test.test').fill('#username', 'test').fill('#password', 'test').pressButton('.submit', function() {
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

  describe('/game', function() {
    return it('should send a public message', function(done) {
      return browser.fill('#tchat-input', 'hello !').clickLink('#tchat-send', function() {
        assert.equal(browser.text('.tchat-container span'), 'hello !');
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
