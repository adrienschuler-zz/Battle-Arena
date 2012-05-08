var Browser 	= require('zombie')
	, assert 		= require('assert')
	, mongoose 	= require('mongoose')
	, browser 	= new Browser()
	, login 		= Math.round((new Date().valueOf() * Math.random())) + '';

// var dblink = process.env.MONGOHQ_URL || 'mongodb://localhost/battle_arena';
// var db = mongoose.createConnection(dblink);

// mongoose.model('User', require('../app/models/user'));

// console.log(db);



// var u = new User({
// 		login: login
// 	, password: login
// });

// assert.equal(u.login, login);
// console.log(u);


// Signup

browser.visit('http://localhost:5000/user/signup', function() {
	assert.ok(browser.success);
	if (browser.error) console.dir('Errors reported: ', browser.errors);

	browser
		.fill('#email', login + '@test.test')
		.fill('#login', login)
		.fill('#password', 'test')
		.pressButton('.submit', function() {
			assert.ok(browser.success);
			console.log('Signup test passed.');
		});

		// Login

	browser.visit('http://localhost:5000/user/login', function() {
		assert.ok(browser.success);
		if (browser.error) console.dir('Errors reported: ', browser.errors);

		browser
			.fill('#login', login)
			.fill('#password', 'test')
			.pressButton('.submit', function() {
				assert.ok(browser.success);
				console.log('Login test passed.');
			});
	});

});