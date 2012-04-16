var Browser = require('zombie')
	, assert 	= require('assert')
	, browser = new Browser()
	, login 	= Math.round((new Date().valueOf() * Math.random())) + '';

// Signup

browser.visit('http://localhost:5000/users/signup', function() {
	assert.ok(browser.success);
	if (browser.error)
	  console.dir('Errors reported: ', browser.errors);

	browser
		.fill('#email', login + '@test.test')
		.fill('#login', login)
		.fill('#password', 'test')
		.pressButton('.submit', function() {
			assert.ok(browser.success);
			console.log('Signup test passed.');
		});

		// Login

	browser.visit('http://localhost:5000/users/login', function() {
		assert.ok(browser.success);
		if (browser.error)
		  console.dir('Errors reported: ', browser.errors);

		browser
			.fill('#login', login)
			.fill('#password', 'test')
			.pressButton('.submit', function() {
				assert.ok(browser.success);
				console.log('Login test passed.');
			});
	});

});