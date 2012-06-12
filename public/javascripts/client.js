$(function() {

	// $('#login').find('.submit').bind('click', function() {
	// 	console.log('login');
	// 	console.log($(this));
	// });

	// $('#register').find('.submit').bind('click', function() {
	// 	console.log('register');
	// 	console.log($(this));
	// });

	$(window).bind('orientationchange', function(e) {
		console.log('orientation: ' + e.orientation);
	});

});
