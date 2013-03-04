(function( $ ) {
	"use strict";

	module( "Single select", {
		setup: function() {
			this.select = $("#select-1").bselect();
		},
		teardown: function() {
			this.select.bselect("destroy");
		}
	});

	test( "markup structure", 4, function() {
		var bselect = $(".bselect");

		strictEqual( bselect.length, 1, "bselect exists" );
		ok( bselect.is(".bselect"), "bselect is .bselect" );
		strictEqual( bselect.find(".bselect-option").length, 3, "has the same number of items than the original select" );
		strictEqual( bselect.find(".bselect-option[data-value='']").length, 0, "shouldn't have items with empty values" );
	});
})( jQuery );