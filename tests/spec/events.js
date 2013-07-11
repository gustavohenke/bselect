(function( $ ) {
    "use strict";

    module( "Events", {
        setup: function() {
            // It's important to call .val("") here. That's because of issue #11.
            // If we didn't, then the tests for the search event would call the assertions from
            // the select event also.
            this.select = $( "#select-2" ).val( "" ).bselect({
                animationDuration: 0
            });
        },
        teardown: function() {
            this.select.bselect( "destroy" );
        }
    });

    test( "select and selected", 5, function() {
        this.select.bind( "bselectselect", function( e, option ) {
            ok( true, "should call 'select'" );
            ok(
                $( option ).is( "option[value='option2']" ),
                "select - the second arg should be the selected element"
            );

            start( 1 );
        });

        this.select.bind( "bselectselected", function( e, val, option ) {
            ok( true, "should call 'selected'" );
            strictEqual( val, "option2", "selected - the second arg should be the selected value" );
            ok(
                $( option ).is( "option[value='option2']" ),
                "selected - the third arg should be the selected element"
            );

            start( 1 );
        });

        stop( 2 );
        this.select.bselect( "select", 1 );
    });

    test( "search", 3, function() {
        this.select.bind( "bselectsearch", function( e, searchedText, results ) {
            ok( true, "should call 'search'" );
            strictEqual( searchedText, "1", "second arg should be the searched text" );
            ok( results.jquery, "third arg should be the results as a jQuery collection" );

            start();
        });

        stop();
        this.select.bselect( "search", "1" );
    });

})( jQuery );