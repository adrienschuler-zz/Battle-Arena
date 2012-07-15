
function now() {
	var d = new Date(), 
			h = d.getHours(), 
			m = d.getMinutes(),
			h = h.toString().length > 1 ? h : '0' + h,
			m = m.toString().length > 1 ? m : '0' + m;
	return '[' + h + ':' + m + ']';
}

$(function() {
	// $(window).bind('orientationchange', function(e) {
	// 	console.log('orientation: ' + e.orientation);
	// });

	$.extend($.mobile, { // overriding jQuery Mobile defaults
		ajaxEnabled: false
	});
});
