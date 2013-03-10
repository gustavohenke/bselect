(function( $ ) {
	"use strict";

	module( "Options", {
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

	test( "size", 1, function() {
		this.select.bselect( "option", "size", "mini" );

		ok( this.bselect.is(".bselect-mini"), "should set the caret and the dropdown label with the size class" );
	});

	test( "showOn", 4, function() {
		this.select.bselect( "option", "animationDuration", 0 );

		// Option: "both"
		this.bselect.find(".bselect-caret").trigger("click");
		ok( this.bselect.is(".open"), "must toggle via a click in the caret if option is 'both'" );

		this.bselect.find(".bselect-label").trigger("click");
		ok( !this.bselect.is(".open"), "must toggle via a click in the label if option is 'both'" );

		// Option: "caret"
		this.select.bselect( "option", "showOn", "caret" );

		this.bselect.find(".bselect-caret").trigger("click");
		ok( this.bselect.is(".open"), "must toggle via a click in the caret if option is not 'both'" );

		this.bselect.find(".bselect-label").trigger("click");
		ok( this.bselect.is(".open"), "must not toggle via a click in the label if option is not 'both'" );
	});

	test( "clearSearchOnExit", 4, function() {
		this.select.bselect( "option", "clearSearchOnExit", false );

		// Option: false
		this.select.bselect("show");
		this.select.bselect( "search", "1" );
		this.select.bselect("hide");

		strictEqual( this.bselect.find(".bselect-search").val(), "1", "when the value is false, should not clear the input after exit" );

		this.select.bselect("show");
		strictEqual( this.bselect.find(".bselect-option:visible").length, 1, "when the value is false, should not show other options after exit" );

		// Option: true
		this.select.bselect( "option", "clearSearchOnExit", true );
		this.select.bselect("hide");

		strictEqual( this.bselect.find(".bselect-search-input").val(), "", "when the value is true, should clear the input after exit" );

		this.select.bselect("show");
		strictEqual( this.bselect.find(".bselect-option:visible").length, 3, "when the value is true, should show other options after exit" );
	});

	test( "minSearchInput", 2, function() {
		this.select.bselect( "option", "minSearchInput", 3 );

		this.select.bselect("show");
		this.select.bselect( "search", "1" );
		strictEqual( this.bselect.find(".bselect-option:hidden").length, 0, "should not search when fewer characteres than the option were typed" );

		this.select.bselect( "search", "option 1" );
		strictEqual( this.bselect.find(".bselect-option:visible").length, 1, "should search when more characteres than the option were typed" );
	});

	test( "searchInput", 2, function() {
		strictEqual( this.bselect.find(".bselect-search").length, 1, "should have a search input when value is true" );

		this.select.bselect("destroy");
		this.select.bselect({
			searchInput: false
		});

		strictEqual( this.select.bselect("element").find(".bselect-search").length, 0, "should not have a search input when value is false" );
	});

})( jQuery );