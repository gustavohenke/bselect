(function( $, undefined ) {
	"use strict";

	module( "Any select", {
		setup: function() {
			this.select = $("#select-1");
		},
		teardown: function() {

		}
	});

	test( "General", function() {
		this.select.bselect();
		this.select.bselect();

		strictEqual( $(".bselect").length, 1, "shouldn't create more than one instance per select (issue #8)" );

		this.select.bselect("destroy");
	});

})( jQuery );