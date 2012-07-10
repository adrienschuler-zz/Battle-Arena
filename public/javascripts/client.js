
function now() {
	var d = new Date(), 
			h = d.getHours(), 
			m = d.getMinutes(),
			h = h.toString().length > 1 ? h : '0' + h,
			m = m.toString().length > 1 ? m : '0' + m;
	return '[' + h + ':' + m + ']';
}

function render(tmpl, target, data) {
	if (_.isObject(data)) data.time = now();
	tmpl.tmpl(data).appendTo(target);
}

$(function() {
	// $(window).bind('orientationchange', function(e) {
	// 	console.log('orientation: ' + e.orientation);
	// });

	$.extend($.mobile, { // overriding jQuery Mobile defaults
		ajaxEnabled: false
	});

});


function findSpellById(spells, id) {
	for (var i = 0, l = spells.length - 1; i < l; i++) {
		if (spells[i]["_id"] === id) {
			return spells[i];
		}
	}
};

function getSpellDescription(spell) {
		var new_desc 	= spell._description
			, matches 	= new_desc.match(/\{((.*?))\}/g);
		$.each(matches, function(key, match) {
			var match = match.replace(/{|}/g, '');
			if (spell[match]) {
				new_desc = new_desc
					.replace(match, spell[match])
					.replace(/{|}/g, '');
			}
		});
		spell.description = new_desc;
		delete spell._description;
}
