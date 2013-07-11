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
        var select = sinon.spy();
        var selected = sinon.spy();

        this.select.bind( "bselectselect", select );
        this.select.bind( "bselectselected", selected );
        this.select.bselect( "select", 1 );

        ok( select.calledOnce, "should call 'select'" );
        ok(
            $( select.args[ 0 ][ 1 ] ).is( "option[value='option2']" ),
            "select - the second arg should be the selected element"
        );

        ok( selected.calledOnce, "should call 'selected'" );
        strictEqual(
            selected.args[ 0 ][ 1 ], "option2",
            "selected - the second arg should be the selected value"
        );
        ok(
            $( selected.args[ 0 ][ 2 ] ).is( "option[value='option2']" ),
            "selected - the third arg should be the selected element"
        );
    });

    test( "search", 3, function() {
        var spy = sinon.spy();

        this.select.bind( "bselectsearch", spy );
        this.select.bselect( "search", "1" );

        ok( spy.calledOnce, "should call 'search'" );
        strictEqual( spy.args[ 0 ][ 1 ], "1", "second arg should be the searched text" );
        ok(
            spy.args[ 0 ][ 2 ] instanceof $,
            "third arg should be the results as a jQuery collection"
        );
    });

})( jQuery );