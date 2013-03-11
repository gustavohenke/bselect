(function( $, undefined ) {
	"use strict";

	module( "Any select", {
		setup: function() {
			this.select = $("#select-1");
		},
		teardown: function() {

		}
	});

	test( "general", 1, function() {
		this.select.bselect();
		this.select.bselect();

		strictEqual( $(".bselect").length, 1, "shouldn't create more than one instance per select (issue #8)" );

		this.select.bselect("destroy");
	});

	test( "instantiation", 2, function() {
		this.select.val("option1").bselect({
			animationDuration: 0
		});
		this.bselect = this.select.bselect("element");

		strictEqual( this.bselect.find(".bselect-option.active").length, 1, "should select the current option on instantiation (issue #11)" );

		$("<label for='select-1' />").appendTo("body").trigger("click");
		ok( this.bselect.is(".open"), "when the original select label is clicked, should show the dropdown (issue #9)" );
	})

})( jQuery );