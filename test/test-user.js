var Browser		= require('zombie')
	, should		= require('should')
	, assert		= require('assert')
	, browser		= new Browser();
	// , login 		= Math.round((new Date().valueOf() * Math.random())) + '';


describe('Signup', function() {
	browser
		.visit('http://localhost:5000/user/signup', function() {
			it('should load the signup page', function() {
					assert.equal(browser.location.pathname, '/user/signup');
				});
		});

	// browser.visit('http://localhost:5000/user/signup', function() {
	// 	assert.ok(browser.success);
	// 	if (browser.error) console.dir('Errors reported: ', browser.errors);

	// 	browser
	// 		.fill('#email', login + '@test.test')
	// 		.fill('#username', login)
	// 		.fill('#password', 'test')
	// 		.pressButton('.submit', function() {
	// 			assert.ok(browser.success);
	// 			console.log('Signup test passed.');

			// });

});

		// Login

// 	browser.visit('http://localhost:5000/user/login', function() {
// 		assert.ok(browser.success);
// 		if (browser.error) console.dir('Errors reported: ', browser.errors);

// 		browser
// 			.fill('#username', login)
// 			.fill('#password', 'test')
// 			.pressButton('.submit', function() {
// 				assert.ok(browser.success);
// 				console.log('Login test passed.');
// 			});
// 	});

// });