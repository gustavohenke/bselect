(function( $ ) {
	"use strict";

	module( "Single select", {
		setup: function() {
			this.select = $("#select-1").bselect();
			this.bselect = this.select.bselect("element");
		},
		teardown: function() {
			this.select.bselect("destroy");
		}
	});

	test( "markup structure", 4, function() {
		strictEqual( this.bselect.length, 1, "bselect exists" );
		ok( this.bselect.is(".bselect"), "bselect is .bselect" );
		strictEqual( this.bselect.find(".bselect-option").length, 3, "has the same number of items than the original select" );
		strictEqual( this.bselect.find(".bselect-option[data-value='']").length, 0, "shouldn't have items with empty values" );
	});

	test( "native events", function() {
		this.select.val("option1").trigger("change");
		strictEqual( this.bselect.find(".bselect-option.active").length, 1, "change (issue #6)" );
	});

})( jQuery );