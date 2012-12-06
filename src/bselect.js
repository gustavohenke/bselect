/*!
 * BSelect v0.1.0a
 * The select decorator component that was missing for Twitter Bootstrap.
 *
 * More info:
 * http://github.com/gustavohenke/bselect
 *
 * @version  0.1.0
 * @requires jQuery
 */
(function($, undefined) {
	"use strict";

	var methods = {
		// Get/set options of the component
		option : function(option, value) {
			var curr = this.data("bselect").options || {};

			if (typeof option === "string" && option[0] !== "_") {
				if (value === undefined) {
					return curr[option];
				} else {
					curr[option] = value;
				}
			} else if ($.isPlainObject(option)) {
				this.data("bselect", $.extend(curr, option));
			}

			return curr;
		},

		// Retrieve the BSelect container
		element : function() {
			return this.data("bselect").element;
		},

		// Retrieve the currently selected value
		value : function() {
			return this.data("bselect").value;
		},
		toggle : function(e) {
			var bselect = _callMethod(this, "element");

			if (bselect.find(".dropdown-menu").is(":hidden")) {
				_callMethod(this, "show");
				return (e instanceof $.Event) ? false : this;
			} else {
				_callMethod(this, "hide");
			}

			return this;
		},
		show : function() {
			var searchInput;
			var bselect = _callMethod(this, "element");

			bselect.find(".dropdown-menu").slideDown(_callMethod(this, "option", "animationDuration"), function() {
				adjustDropdownHeight(bselect);
			});

			// The following class will allow us to show that nice inset shadow in .dropdown-toggle
			bselect.addClass('open');

			// Adjust the size of the search input to match the container inner width
			searchInput = bselect.find(".bselect-search");
			searchInput.innerWidth(searchInput.parent().width() - searchInput.next().outerWidth());

			return this;
		},
		hide : function(clear) {
			var options = _callMethod(this, "option"),
				bselect = _callMethod(this, "element");

			clear = clear === undefined ? true : clear;

			bselect.find(".dropdown-menu").slideUp(options.animationDuration);
			bselect.removeClass('open');

			// Clear the search input and the results, if that's case
			if (clear && options.clearSearchOnExit) {
				_callMethod(this, "clearSearch");
			}

			return this;
		},

		// Clear the search input and reset the dropdown
		clearSearch : function() {
			var bselect = _callMethod(this, "element");

			bselect.find(".bselect-search").val("");
			bselect.find("li").show();

			adjustDropdownHeight(bselect);
			return this;
		},
		select : function(arg) {
			var $elem, val;
			var options = _callMethod(this, "option"),
				bselect = _callMethod(this, "element");

			if (arg instanceof $.Event) {
				$elem = $(arg.currentTarget);
			} else {
				$elem = bselect.find("li").eq(arg);

				if (!$elem.length) {
					return bselect;
				}
			}

			// Remove the highlighted status from any item
			bselect.find("li").removeClass("active");

			val = $elem.addClass("active").data("value");
			this.data("bselect").value = val;

			bselect.find(".bselect-label").text($elem.text());
			_callMethod(this, "hide");

			if (options.synchronizeElement) {
				this.val(val);
			}

			// Trigger the select event...
			if (typeof options.select === "function") {
				options.select.call(this, val, $elem);
			}

			return this;
		},

		// Searches every item in the list for the given text
		search : function(arg) {
			var listItems, i;
			var options = _callMethod(this, "option"),
				searched = (arg instanceof $.Event) ? arg.target.value : arg;

			// Avoid searching for nothing
			if (searched === "") {
				_callMethod(this, "clearSearch");
			}

			// Same search/few chars? We won't search then!
			if ((searched === options.lastSearch) || (searched.length < options.minSearchInput)) {
				return;
			}

			listItems = _callMethod(this, "element").find("li").hide();
			for (i = 0; i < listItems.length; i++) {
				if (listItems[i].textContent.toLowerCase().indexOf(searched.toLowerCase()) > -1) {
					$(listItems[i]).show();
				}
			}

			adjustDropdownHeight(listItems.end());
			return this;
		},
		destroy : function() {
			var bselect = _callMethod(this, "element");
			this.data("bselect", null);

			bselect.remove();
			this.show();
		}
	};
	var bootstrapButtonSizes = ["mini", "small", "large"];

	// Helper function that will call an BSelect method in the context of $elem
	function _callMethod($elem, method) {
		if (methods[method] !== undefined) {
			return methods[method].apply($elem, Array.prototype.slice.call(arguments, 2));
		}

		return $elem;
	}

	function getPlaceholder($elem) {
		return _callMethod($elem, "option", "placeholder") ||
				$elem.data("placeholder") ||
				$.bselect.defaults.i18n.selectAnOption;
	}

	function adjustDropdownHeight($elem) {
		var list = $elem.find(".dropdown-list"),
			len = list.find("li:visible").length;

		list.innerHeight(parseInt(list.css("line-height"), 10) * 1.5 * (len < 5 ? len : 5));
	}

	function setup(elem, options) {
		var caret, label, container, html;
		var $elem = $(elem),
			btn = $("<button class='btn' />");

		// First of, let's build the base HTML of BSelect
		html = "<div class='bselect btn-group'>";
		html += "<div class='dropdown-menu'>";

		if (options.searchInput) {
			html += "<div class='input-append'>" +
						"<input type='text' class='bselect-search' />" +
						"<span class='add-on'><i class='icon-search'></i></span>" +
					"</div>";
		}

		html += "<ul class='unstyled dropdown-list'>";

		$elem.find("option").each(function() {
			html += "<li data-value='" + this.value + "'>" +
						"<a href='#'>" + this.text + "</a>" +
					"</li>";
		});
		html += "</ul></div></div>";

		container = $elem.after(html).next();

		// Save some precious data in the original select now, as we have the container in the DOM
		$elem.data("bselect", {
			options : options,
			element : container
		});

		if (options.size !== "normal" && bootstrapButtonSizes.indexOf(options.size) > -1) {
			btn.addClass("btn-" + options.size);
		}

		label = btn.clone().addClass("bselect-label").text(getPlaceholder($elem));
		caret = btn.addClass("dropdown-toggle").html("<span class='caret'></span>");
		container.prepend(caret).prepend(label);

		label.innerWidth($elem.innerWidth() - caret.outerWidth());
		
		// Hide this ugly select!
		$elem.hide();

		// Event binding
		$(document).click(function(e) {
			if (container.find(".dropdown-menu").is(":visible") &&
				!$('.dropdown-menu, .dropdown-menu *', container).find(e.target).length) {
				_callMethod($elem, "hide");
			}
		});

		// Showing the options list
		caret.click($.proxy(methods.toggle, $elem));
		if (options.showOn === "both") {
			label.click($.proxy(methods.toggle, $elem));
		}

		container.find(".bselect-search").keyup($.proxy(methods.search, $elem));
		container.on("click", "li", $.proxy(methods.select, $elem));
	}

	$.fn.bselect = function(arg) {
		return this.each(function() {
			var $this = $(this);

			if (typeof arg === "string" && $.isPlainObject($this.data("bselect"))) {
				if (methods[arg] !== undefined) {
					return methods[arg].apply($this, Array.prototype.slice.call(arguments, 1));
				}
			}

			arg = $.isPlainObject(arg) ? arg : {};
			arg = $.extend({}, $.bselect.defaults, arg);

			setup(this, arg);
			return $this;
		});
	};

	$.bselect = {
		defaults : {
			size : "normal",
			i18n : {
				selectAnOption : "Select an option"
			},
			showOn : "both",
			clearSearchOnExit : true,
			minSearchInput    : 0,
			animationDuration : 300,
			searchInput       : true,
			select            : null,
			synchronizeElement: true
		}
	};

})(jQuery);