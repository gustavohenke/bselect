(function( $, undefined ) {
	"use strict";

	module( "Methods", {
		setup: function() {
			this.select = $("#select-1").bselect({
				animationDuration: 0
			});
		},
		teardown: function() {
			this.select.bselect("destroy");
		}
	});

	test( "element", function() {
		var bselect = this.select.bselect("element");

		ok( bselect.is(".bselect"), "returns bselect container" );
	});

	test( "option", function() {
		var option = this.select.bselect("option");

		ok( $.isPlainObject( option ), "returns hash with all options when no option defined" );
		notStrictEqual( option.minSearchInput, undefined, "default option keys are present in the options hash" );

		option = this.select.bselect( "option", "minSearchInput", 2 );
		ok( option.is( this.select ), "after setting an option, returns self" );

		option = this.select.bselect( "option", "minSearchInput" );
		strictEqual( option, 2, "get the current option value" );
	});

	test( "select", function() {
		var select = this.select.bselect( "select", 2 ),
			bselect = this.select.bselect("element"),
			li = bselect.find("li").eq(2);

		ok( select.is(this.select), "returns the select element" );
		ok( li.is(".active"), "the LI index 2 must be .active" );

		this.select.bselect( "select", 4 );
		ok( li.is(".active"), "if the index is not found, shouldn't do anything" );
	});

	test( "show", function() {
		var select = this.select.bselect("show"),
			bselect = this.select.bselect("element");

		ok( select.is( this.select ), "returns the select element" );
		ok( bselect.is(".open"), "must be .open" );
		ok( bselect.find(".dropdown-menu").is(":visible"), "the list of items should get visible" );
	});

	test( "hide", function() {
		var bselect = this.select.bselect("element");
		bselect.find(".dropdown-menu").show();

		var select = this.select.bselect("hide");

		ok( select.is( this.select ), "returns the select element" );
		ok( !bselect.is(".open"), "must not be .open" );

		ok( bselect.find(".dropdown-menu").is(":hidden"), "the list of items should get hidden" );
	});

	test( "toggle", function() {
		var select = this.select.bselect("toggle"),
			bselect = this.select.bselect("element");

		ok( select.is( this.select ), "returns the select element" );
		ok( bselect.find(".dropdown-menu").is(":visible"), "'show' must be called when hidden" );

		select.bselect("toggle");
		ok( bselect.find(".dropdown-menu").is(":hidden"), "'hide' must be called when visible" );
	});

	test( "search", function() {
		var select = this.select.bselect( "search", "1" ),
			bselect = this.select.bselect("element"),
			LI = bselect.find(".dropdown-menu").show().find("li");

		ok( select.is( this.select ), "returns the select element" );
		strictEqual( LI.filter(":visible").length, 1, "shows only the items with the searched term" );

		// In the HTML, the <option> tags contain text like "Option 1".
		this.select.bselect( "search", "option" );
		strictEqual( LI.filter(":visible").length, 3, "search is case insensitive" );

		this.select.bselect( "search", "" );
		strictEqual( LI.filter(":visible").length, 3, "clears the search when no input given" );
	});

	test( "clearSearch", function() {
		var select = this.select.bselect( "search", "1" ).bselect("clearSearch"),
			bselect = this.select.bselect("element");

		bselect.find(".dropdown-menu").show();

		ok( select.is( this.select ), "returns the select element" );
		strictEqual( bselect.find(".bselect-search").val(), "", "the search text must have no value" );
		strictEqual( bselect.find("li:visible").length, 3, "all items must be visible" );
	});

})( jQuery );