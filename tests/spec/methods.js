(function( $, sinon, undefined ) {
    "use strict";

    module( "Methods", {
        setup: function() {
            this.select = $( "#select-1" ).bselect({
                animationDuration: 0
            });

            this.bselect = this.select.bselect( "element" );
        },
        teardown: function() {
            this.select.bselect( "destroy" );
        }
    });

    test( "element", 1, function() {
        ok( this.bselect.is( ".bselect" ), "returns bselect container" );
    });

    test( "option", 4, function() {
        var option = this.select.bselect( "option" );

        ok( $.isPlainObject( option ), "returns hash with all options when no option defined" );
        notStrictEqual(
            option.minSearchInput,
            undefined,
            "default option keys are present in the options hash"
        );

        option = this.select.bselect( "option", "minSearchInput", 2 );
        ok( option.is( this.select ), "after setting an option, returns self" );

        option = this.select.bselect( "option", "minSearchInput" );
        strictEqual( option, 2, "get the current option value" );
    });

    test( "select", 6, function() {
        var spy, select, li;

        spy = sinon.spy();
        this.select.change( spy );

        select = this.select.bselect( "select", 2 );
        li = this.bselect.find( "li" ).eq( 2 );

        ok( select.is( this.select ), "returns the select element" );
        ok( li.is( ".active" ), "the LI index 2 must be .active" );
        strictEqual(
            select.val(), li.data( "value" ),
            "the original select should have the same value as the option selected (issue #3)"
        );
        strictEqual( li.attr( "aria-selected" ), "true", "the LI should get aria-selected='true'" );

        this.select.bselect( "select", 4 );
        ok( li.is( ".active" ), "if the index is not found, shouldn't do anything" );
        ok( spy.calledOnce, "should trigger 'change' event of the select element" );
    });

    test( "show", 4, function() {
        var select = this.select.bselect( "show" );
        var input = this.bselect.find( ".bselect-search-input" );

        ok( select.is( this.select ), "returns the select element" );
        ok( this.bselect.is( ".open" ), "must be .open" );
        ok(
            this.bselect.find( ".bselect-dropdown" ).is( ":visible" ),
            "the list of items should get visible"
        );
        strictEqual(
            input.attr( "aria-expanded" ), "true",
            "the search input must get aria-expanded='true'"
        );
    });

    test( "hide", 4, function() {
        this.select.show();
        var select = this.select.bselect( "hide" );

        ok( select.is( this.select ), "returns the select element" );
        ok( !this.bselect.is( ".open" ), "must not be .open" );

        ok(
            this.bselect.find( ".bselect-dropdown" ).is( ":hidden" ),
            "the list of items should get hidden"
        );
        strictEqual(
            this.bselect.find( ".bselect-search-input" ).attr( "aria-expanded" ), "false",
            "the search input must get aria-expanded='false'"
        );
    });

    test( "toggle", 3, function() {
        var select = this.select.bselect( "toggle" );

        ok( select.is( this.select ), "returns the select element" );
        ok(
            this.bselect.find( ".bselect-dropdown" ).is( ":visible" ),
            "'show' must be called when hidden"
        );

        select.bselect( "toggle" );
        ok(
            this.bselect.find( ".bselect-dropdown" ).is( ":hidden" ),
            "'hide' must be called when visible"
        );
    });

    test( "search", 5, function() {
        var select = this.select.bselect( "search", "1" );
        var LI = this.bselect.find( ".bselect-dropdown" ).show().find( "li" );

        ok( select.is( this.select ), "returns the select element" );
        strictEqual(
            LI.filter( ":visible" ).length, 1,
            "shows only the items with the searched term"
        );

        // In the HTML, the <option> tags contain text like "Option 1".
        this.select.bselect( "search", "option" );
        strictEqual( LI.filter( ":visible" ).length, 3, "search is case insensitive" );

        this.select.bselect( "search", "" );
        strictEqual( LI.filter( ":visible" ).length, 3, "clears the search when no input given" );

        this.select.bselect( "search", "blablabla" );
        ok(
            this.bselect.find( ".bselect-message" ).is( ":visible" ),
            "should show a message telling that no results were returned (issue #7)"
        );
    });

    test( "clearSearch", 3, function() {
        var select = this.select.bselect( "search", "1" ).bselect( "clearSearch" ),
            bselect = this.select.bselect( "element" );

        bselect.find( ".bselect-dropdown" ).show();

        ok( select.is( this.select ), "returns the select element" );
        strictEqual(
            bselect.find( ".bselect-search-input" ).val(), "",
            "the search text must have no value"
        );
        strictEqual( bselect.find( "li:visible" ).length, 3, "all items must be visible" );
    });

    test( "refresh", 2, function() {
        var options, select;

        options = this.select.find( "option[value!='']" );
        options.eq( 0 ).remove();

        select = this.select.bselect( "refresh" );

        ok( select.is( this.select ), "returns the select element" );
        strictEqual(
            this.bselect.find( ".bselect-option" ).length,
            options.length - 1,
            "the modifications in the select must be applied in the dropdown"
        );
    });

    test( "disable", 3, function() {
        var select = this.select.bselect( "disable" );

        ok( select.is( this.select ), "returns the select element" );
        ok( select.prop( "disabled" ), "the select has disabled attribute as true" );
        ok( this.bselect.is( ".disabled" ), "should be .disabled" );
    });

    test( "enable", 3, function() {
        var select = this.select.bselect( "disable" ).bselect( "enable" );

        ok( select.is( this.select ), "returns the select element" );
        ok( !select.prop( "disabled" ), "the select has disabled attribute as false" );
        ok( !this.bselect.is( ".disabled" ), "should not be .disabled" );
    });

    test( "destroy", 4, function() {
        var select = this.select.bselect( "destroy" );

        ok( select.is( this.select ), "returns the select element" );
        equal( select.data( "bselect" ), null, "has no bselect data" );
        ok( select.is( ":visible" ), "is shown after destroying" );
        strictEqual( this.bselect.has( "body" ).length, 0, "has no .bselect related element" );
    });

})( jQuery, sinon );