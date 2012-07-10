require "test/unit"
require "rubygems"
require "selenium-webdriver"

class BattleArenaTest < Test::Unit::TestCase

	def setup
		Selenium::WebDriver::Chrome.path = "/usr/lib/chromium-browser/chromium-browser"
		
		@firefox = Selenium::WebDriver.for :firefox
		@chrome = Selenium::WebDriver.for :chrome

		resize_window(@firefox, 'left')
		resize_window(@chrome, 'right')
	end

	def teardown
		# @firefox.quit
		# @chrome.quit
	end

	def test_test
		login(@firefox, 'firefox', 'test')
		login(@chrome, 'chrome', 'test')
		sleep 1
		@firefox.find_element(:class, 'nav-search').click
		sleep 1
		@chrome.find_element(:xpath, '/html/body/div/div[3]/div[2]/div[2]/a/span/span').click
	end

	def resize_window(driver, side)
		max_width, max_height = driver.execute_script("return [window.screen.availWidth, window.screen.availHeight];")
		driver.manage.window.resize_to(max_width / 2, max_height)
		driver.manage.window.move_to(0, 0) if side == 'left'
		driver.manage.window.move_to(max_width / 2, 0) if side == 'right'
	end

	def login(driver, username, password)
		driver.navigate.to "http://localhost:5000"
		driver.find_element(:id, 'username').send_keys username
		driver.find_element(:id, 'password').send_keys password
		driver.find_element(:class, 'submit').click
	end

end