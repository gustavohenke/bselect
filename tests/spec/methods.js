(function($) {
	"use strict";

	module("Methods", {
		setup : function() {
			this.select = $("#select-1").bselect();
		},
		teardown : function() {
			this.select.bselect("destroy");
		}
	});

	test("element", function() {
		var bselect = this.select.bselect("element");

		ok(bselect.is(".bselect"), "returns bselect container");
	});

	test("option", function() {
		var option = this.select.bselect("option");

		ok($.isPlainObject(option), "returns hash without arguments");
		notStrictEqual(option.minSearchInput, undefined, "default option keys are present in the options hash");

		option = this.select.bselect("option", "minSearchInput", 2);
		ok(option.is(this.select), "after setting an option, returns self");

		option = this.select.bselect("option", "minSearchInput");
		strictEqual(option, 2, "get the current option value");
	});

	test("select", function() {
		var select = this.select.bselect("select", 2),
			bselect = this.select.bselect("element"),
			li = bselect.find("li").eq(2);

		ok(select.is(this.select), "returns the select element");
		ok(li.is(".active"), "the LI index 2 must be .active");

		this.select.bselect("select", 4);
		ok(li.is(".active"), "if the index is not found, shouldn't do anything");
	});
	
})(jQuery);