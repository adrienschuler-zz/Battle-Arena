assert 	= require('assert')
Browser = require('zombie')
browser = new Browser()


# SIGNUP
describe '/user/signup', ->
	
	it 'should access signup page', (done) ->
		browser.visit 'http://localhost:5000/user/signup', ->	
			assert.equal browser.location.pathname, '/user/signup'
			done()

	it 'should signup and redirect to game homepage', (done) ->
		browser
			.fill('#email', 'test@test.test') # TODO: generate unique emails + server-side email validations
			.fill('#username', 'test')
			.fill('#password', 'test')
			.pressButton '.submit', ->
				assert.equal browser.location.pathname, '/game'
				done()


# TCHAT
# describe '/game', ->

# 	it 'should send a public message', (done) ->
# 		browser
# 			.fill('#tchat-input', 'hello !')
# 			.clickLink '#tchat-send', ->
# 				browser.wait 1000, ->
# 					assert.equal browser.text('.user-msg:last-child'), 'hello !' # TODO: get last tchat msg
# 					done()


# LOGOUT
describe '/session/destroy', ->	

	it 'should logout from the game', (done) ->
		browser
			.clickLink '.nav-logout', ->
				assert.equal browser.location.pathname, '/user/login'
				done()

	it 'should not be able to access the game page anymore', (done) ->
		browser.visit 'http://localhost:5000/game', ->	
			assert.equal browser.location.pathname, '/user/login'
			done()


# LOGIN
describe '/user/login', ->
	
	it 'should access login page', (done) ->
		browser.visit 'http://localhost:5000/user/login', ->	
			assert.equal browser.location.pathname, '/user/login'
			done()

	it 'should login and redirect to game homepage', (done) ->
		browser
			.fill('#username', 'test')
			.fill('#password', 'test')
			.pressButton '.submit', ->
				assert.equal browser.location.pathname, '/game'
				done()


# LOGOUT
describe '/session/destroy', ->	

	it 'should logout from the game', (done) ->
		browser
			.clickLink '.nav-logout', ->
				assert.equal browser.location.pathname, '/user/login'
				done()

	it 'should not be able to access the game page anymore', (done) ->
		browser.visit 'http://localhost:5000/game', ->	
			assert.equal browser.location.pathname, '/user/login'
			done()