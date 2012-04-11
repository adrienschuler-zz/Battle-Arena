$(function(){

	console.log('triggering application events');

	$(window).bind('orientationchange', function(e){
		console.log( 'orientation: ' + e.orientation );
	});

});

