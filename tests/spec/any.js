(function( $ ) {
    "use strict";

    module( "Any select", {
        setup: function() {
            this.select = $( "#select-1" );
        },
        teardown: function() {
            this.select.bselect( "destroy" );
            if ( this.bselect ) {
                delete this.bselect;
            }
        }
    });

    test( "general", 1, function() {
        this.select.bselect();
        this.select.bselect();

        strictEqual(
            $( ".bselect" ).length, 1,
            "shouldn't create more than one instance per select (issue #8)"
        );
    });

    test( "instantiation", 3, function() {
        this.select.val( "option1" ).bselect({
            animationDuration: 0
        });
        this.bselect = this.select.bselect( "element" );

        strictEqual(
            this.bselect.find( ".bselect-option.active" ).length, 1,
            "should select the current option on instantiation (issue #11)"
        );

        $( "<label for='select-1' />" ).appendTo( "#qunit-fixture" ).trigger( "click" );
        ok(
            this.bselect.is( ".open" ),
            "when the original select label is clicked, should show the dropdown (issue #9)"
        );
        this.select.bselect( "destroy" );

        this.select.prop( "disabled", true ).bselect();
        this.bselect = this.select.bselect( "element" );
        ok(
            this.bselect.is( ".disabled" ),
            "should replicate the original select disabled attribute"
        );
    });

    test( "accessibility", 6, function() {
        var input, e, options;

        this.bselect = this.select.bselect({
            animationDuration: 0
        }).bselect( "element" );

        this.select.bselect( "show" );
        input = this.bselect.find( ".bselect-search-input" );
        options = this.bselect.find( ".bselect-option:visible" );

        // Droped below checking because it couldn't succeed in PhantomJS
        // ok( input.is(":focus"), "the search input must be focused" );
        ok( input.is( document.activeElement ), "the search input must be focused on show" );

        // Search - arrow up
        e = $.Event( "keydown" );
        e.keyCode = 38;
        input.trigger( e );

        ok(
            options.last().is( document.activeElement ),
            "up arrow in the search focuses the last visible option"
        );

        // Search - arrow down
        e = $.Event( "keydown" );
        e.keyCode = 40;
        input.focus().trigger( e );

        ok(
            options.eq( 0 ).is( document.activeElement ),
            "down arrow in the search focuses the first visible option"
        );

        // Option - arrow down
        e = $.Event( "keydown" );
        e.keyCode = 40;
        options.eq( 0 ).trigger( e );

        ok(
            options.eq( 1 ).is( document.activeElement ),
            "down arrow in a option focuses the next visible option"
        );

        // Option - arrow up
        e = $.Event( "keydown" );
        e.keyCode = 38;
        options.eq( 1 ).trigger( e );

        ok(
            options.eq( 0 ).is( document.activeElement ),
            "up arrow in a option focuses the previous visible option"
        );

        e = $.Event( "keydown" );
        e.keyCode = 13;
        options.eq( 0 ).trigger( e );

        strictEqual(
            this.bselect.find( ".bselect-label" ).text(),
            options.eq( 0 ).text(),
            "enter selects the current option"
        );
    });

})( jQuery );