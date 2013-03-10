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

	test( "markup structure", 5, function() {
		strictEqual( this.bselect.length, 1, "bselect exists" );
		ok( this.bselect.is(".bselect"), "bselect is .bselect" );
		strictEqual( this.bselect.find(".bselect-option").length, 3, "has the same number of items than the original select" );
		strictEqual( this.bselect.find(".bselect-option[data-value='']").length, 0, "shouldn't have items with empty values" );

		var options = this.select.find("option").remove();
		this.select.bselect("refresh").bselect("show");

		ok( this.bselect.find(".bselect-message").is(":visible"), "should show a message telling that no options exist (issue #7)" );

		options.appendTo( this.select );
	});

	test( "native events", 1, function() {
		this.select.val("option1").trigger("change");
		strictEqual( this.bselect.find(".bselect-option.active").length, 1, "change (issue #6)" );
	});

})( jQuery );