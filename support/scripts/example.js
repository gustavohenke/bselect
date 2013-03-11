(function( $ ) {

	$( document ).ready(function() {
		var select = $(".languages").remove();
		$("#select-basic-container1").append( select.clone().show() );
		
		$("#bselect-basic-container1").append( select ).find(".languages").bselect();

		// Clean up the mess with imported files
		if ( window.localStorage !== undefined ) {
			for (var k in localStorage) {
				if ( localStorage.hasOwnProperty( k ) && k.indexOf(".less") > -1 ) {
					delete localStorage[ k ];
				}
			}
		}

		window.prettyPrint && prettyPrint();
	});

})( jQuery );