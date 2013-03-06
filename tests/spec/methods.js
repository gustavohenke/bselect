(function( $, undefined ) {
	"use strict";

	module( "Methods", {
		setup: function() {
			this.select = $("#select-1").bselect({
				animationDuration: 0
			});

			this.bselect = this.select.bselect("element");
		},
		teardown: function() {
			this.select.bselect("destroy");
		}
	});

	test( "element", 1, function() {
		ok( this.bselect.is(".bselect"), "returns bselect container" );
	});

	test( "option", 4, function() {
		var option = this.select.bselect("option");

		ok( $.isPlainObject( option ), "returns hash with all options when no option defined" );
		notStrictEqual( option.minSearchInput, undefined, "default option keys are present in the options hash" );

		option = this.select.bselect( "option", "minSearchInput", 2 );
		ok( option.is( this.select ), "after setting an option, returns self" );

		option = this.select.bselect( "option", "minSearchInput" );
		strictEqual( option, 2, "get the current option value" );
	});

	test( "select", 5, function() {
		var select = this.select.bselect( "select", 2 ),
			li = this.bselect.find("li").eq( 2 );

		ok( select.is( this.select ), "returns the select element" );
		ok( li.is(".active"), "the LI index 2 must be .active" );
		strictEqual( select.val(), li.data("value"), "the original select should have the same value as the option selected (issue #3)" );
		strictEqual( li.attr("aria-selected"), "true", "the LI should get aria-selected='true'" );

		this.select.bselect( "select", 4 );
		ok( li.is(".active"), "if the index is not found, shouldn't do anything" );
	});

	test( "show", 4, function() {
		var select = this.select.bselect("show");

		ok( select.is( this.select ), "returns the select element" );
		ok( this.bselect.is(".open"), "must be .open" );
		ok( this.bselect.find(".bselect-dropdown").is(":visible"), "the list of items should get visible" );
		strictEqual( this.bselect.find(".bselect-search-input").attr("aria-expanded"), "true", "the search input must get aria-expanded='true'" );
	});

	test( "hide", 4, function() {
		this.bselect.find(".bselect-dropdown").show();

		var select = this.select.bselect("hide");

		ok( select.is( this.select ), "returns the select element" );
		ok( !this.bselect.is(".open"), "must not be .open" );

		ok( this.bselect.find(".bselect-dropdown").is(":hidden"), "the list of items should get hidden" );
		strictEqual( this.bselect.find(".bselect-search-input").attr("aria-expanded"), "false", "the search input must get aria-expanded='false'" );
	});

	test( "toggle", 3, function() {
		var select = this.select.bselect("toggle");

		ok( select.is( this.select ), "returns the select element" );
		ok( this.bselect.find(".bselect-dropdown").is(":visible"), "'show' must be called when hidden" );

		select.bselect("toggle");
		ok( this.bselect.find(".bselect-dropdown").is(":hidden"), "'hide' must be called when visible" );
	});

	test( "search", 4, function() {
		var select = this.select.bselect( "search", "1" ),
			LI = this.bselect.find(".bselect-dropdown").show().find("li");

		ok( select.is( this.select ), "returns the select element" );
		strictEqual( LI.filter(":visible").length, 1, "shows only the items with the searched term" );

		// In the HTML, the <option> tags contain text like "Option 1".
		this.select.bselect( "search", "option" );
		strictEqual( LI.filter(":visible").length, 3, "search is case insensitive" );

		this.select.bselect( "search", "" );
		strictEqual( LI.filter(":visible").length, 3, "clears the search when no input given" );
	});

	test( "clearSearch", 3, function() {
		var select = this.select.bselect( "search", "1" ).bselect("clearSearch"),
			bselect = this.select.bselect("element");

		bselect.find(".bselect-dropdown").show();

		ok( select.is( this.select ), "returns the select element" );
		strictEqual( bselect.find(".bselect-search").val(), "", "the search text must have no value" );
		strictEqual( bselect.find("li:visible").length, 3, "all items must be visible" );
	});

	test( "refresh", 2, function() {
		var options = this.select.find("option[value!='']"),
			removed = options.eq( 0 ).remove(),
			select = this.select.bselect("refresh");

		ok( select.is( this.select ), "returns the select element" );
		strictEqual( this.bselect.find(".bselect-option").length, this.select.find("option[value!='']").length, "the modifications in the select must be applied in the dropdown" );

		removed.insertBefore( options[ 1 ] );
	});

})( jQuery );