$(document).ready(function() {
	var countries = $('.countries').remove();
	$("#select-basic-container").append(countries.clone().show());
	
	$("#bselect-basic-container").append(countries).find('.countries').bselect();

	// Clean up the mess with imported files
	for (var k in localStorage) {
		if (localStorage.hasOwnProperty(k) && k.indexOf('.less') > -1) {
			delete localStorage[k];
		}
	}
});