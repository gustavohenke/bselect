/*!
 * BSelect v0.2.0 - 2013-03-03
 * 
 * Created by Gustavo Henke <gustavo@injoin.com.br>
 * http://gustavohenke.github.com/bselect/
 */
(function( $, undefined ) {
	"use strict";

	var elements = 0;
	var methods = {
		// Get/set options of the component
		option: function( option, value ) {
			var curr = this.data("bselect").options || {},
				prev = $.extend( {}, curr );

			if ( typeof option === "string" && option[ 0 ] !== "_" ) {
				if ( value === undefined ) {
					return curr[ option ];
				} else {
					curr[ option ] = value;
					updateOptions( this, prev, curr );

					return this;
				}
			} else if ( $.isPlainObject( option ) ) {
				$.extend( curr, option );
				updateOptions( this, prev, curr );

				this.data("bselect").options = curr;
			}

			return curr;
		},

		// Retrieve the BSelect container
		element: function() {
			return this.data("bselect").element;
		},

		// Retrieve the currently selected value
		value: function() {
			return this.data("bselect").value;
		},
		toggle: function( e ) {
			var bselect = _callMethod( this, "element" );

			if ( e instanceof $.Event ) {
				var option = _callMethod( this, "option", "showOn" );
				e.stopPropagation();

				if ( $( e.target ).is(".bselect-label") && option !== "both" ) {
					return this;
				}
			}

			if ( bselect.find(".bselect-dropdown").is(":hidden") ) {
				_callMethod( this, "show" );
			} else {
				_callMethod( this, "hide" );
			}

			return this;
		},
		show: function() {
			var searchInput;
			var bselect = _callMethod( this, "element" ),
				dropdown = bselect.find(".bselect-dropdown");

			dropdown.css( "left", "-9999em" ).show();
			adjustDropdownHeight( bselect );
			dropdown.hide().css( "left", "auto" );

			dropdown.slideDown( _callMethod( this, "option", "animationDuration" ) );

			// The following class will allow us to show that nice inset shadow in .dropdown-toggle
			bselect.addClass("open");

			// Adjust the size of the search input to match the container inner width
			searchInput = bselect.find(".bselect-search-input");
			searchInput.innerWidth( searchInput.parent().width() - searchInput.next().outerWidth() );

			return this;
		},
		hide: function( clear ) {
			var options = _callMethod( this, "option" ),
				bselect = _callMethod( this, "element" );

			clear = clear === undefined ? true : clear;

			bselect.find(".bselect-dropdown").slideUp( options.animationDuration );
			bselect.removeClass("open");

			// Clear the search input and the results, if that's case
			if ( clear && options.clearSearchOnExit ) {
				_callMethod( this, "clearSearch" );
			}

			return this;
		},
		select: function( arg ) {
			var $elem, val;
			var options = _callMethod( this, "option" ),
				bselect = _callMethod( this, "element" );

			if ( arg instanceof $.Event ) {
				$elem = $( arg.currentTarget );
			} else {
				$elem = bselect.find("li").eq( arg );

				if ( !$elem.length ) {
					return this;
				}
			}

			// Remove the highlighted status from any item
			bselect.find("li").removeClass("active");

			val = $elem.addClass("active").data("value");
			this.data("bselect").value = val;

			bselect.find(".bselect-label").text( $elem.text() );
			_callMethod( this, "hide" );

			// We'll keep up-to-date the old select, too
			this.val( val );

			// Trigger the selected event
			if ( typeof options.selected === "function" ) {
				options.selected.call( this, val, $elem );
			}

			return this;
		},

		// Searches every item in the list for the given text
		search: function( arg ) {
			var listItems, i;
			var options = _callMethod( this, "option" ),
				searched = arg instanceof $.Event ? arg.target.value : arg,
				bselect = _callMethod( this, "element" );

			// Avoid searching for nothing
			if ( searched === "" ) {
				_callMethod( this, "clearSearch" );
			}

			if ( !( arg instanceof $.Event ) ) {
				bselect.find(".bselect-search").val( searched );
			}

			// Same search/few chars? We won't search then!
			if ( ( searched === options.lastSearch ) || ( searched.length < options.minSearchInput ) ) {
				return;
			}

			listItems = bselect.find("li").hide();
			for ( i = 0; i < listItems.length; i++ ) {
				if ( listItems[ i ].textContent.toLowerCase().indexOf( searched.toLowerCase() ) > -1 ) {
					$( listItems[ i ] ).show();
				}
			}

			adjustDropdownHeight( listItems.end() );
			return this;
		},

		clearSearch: function() {
			var bselect = _callMethod( this, "element" );

			bselect.find(".bselect-search").val("");
			bselect.find("li").show();

			adjustDropdownHeight( bselect );

			return this;
		},

		destroy : function() {
			var bselect = _callMethod( this, "element" );
			this.data( "bselect", null );

			bselect.remove();
			this.show();
		}
	};

	var bootstrapButtonSizes = [ "mini", "small", "large" ];

	// Helper function that will call an BSelect method in the context of $elem
	function _callMethod( $elem, method ) {
		if ( methods[ method ] !== undefined ) {
			return methods[ method ].apply( $elem, Array.prototype.slice.call( arguments, 2 ) );
		}

		return $elem;
	}

	/* Get the placeholder of an element.
	 * Retrieves in the following order:
	 * - bselect options
	 * - .data("placeholder") / attribute data-placeholder
	 * - Default bselect i18n "selectAnOption"
	 */
	function getPlaceholder( $elem ) {
		return _callMethod( $elem, "option", "placeholder" ) ||
				$elem.data("placeholder") ||
				$.bselect.i18n.selectAnOption;
	}

	// Adjusts the dropdown height of an bselect.
	function adjustDropdownHeight( $elem ) {
		var list = $elem.find(".bselect-option-list"),
			len = list.find("li:visible").length;

		list.innerHeight( parseInt( list.css("line-height"), 10 ) * 1.5 * ( len < 5 ? len : 5 ) );
	}

	// Updates visual properties of the bselect after the plugin was initialized
	function updateOptions( $elem, prev, curr ) {
		var bselect = _callMethod( $elem, "element" );

		$.each( prev, function(key, val) {
			if ( curr[ key ] !== val ) {
				if ( key === "size" ) {
					var sizes;
					var i = 0;

					sizes = $.map( bootstrapButtonSizes.slice( 0 ), function( size ) {
						return "bselect-" + size;
					}).join(" ");

					bselect.removeClass( sizes );
					if ( bootstrapButtonSizes.indexOf( curr.size ) > -1 ) {
						bselect.addClass( "bselect-" + curr.size );
					}
				}
			}
		});
	}

	// Run all the setup stuff
	function setup( elem, options ) {
		var caret, label, container, html;
		var $elem = $( elem );

		// First of, let's build the base HTML of BSelect
		html = "<div class='bselect' id='bselect-" + ( ++elements ) + "'>";
		html += "<div class='bselect-dropdown'>";

		if ( options.searchInput === true ) {
			html += "<div class='bselect-search'>" +
						"<input type='text' class='bselect-search-input' />" +
						"<span class='bselect-search-icon'><i class='icon-search'></i></span>" +
					"</div>";
		}

		html += "<ul class='bselect-option-list'>";

		$elem.find("option").each(function() {
			if ( !this.value ) {
				return;
			}

			html += "<li class='bselect-option' data-value='" + this.value + "'>" +
						"<a href='#'>" + this.text + "</a>" +
					"</li>";
		});
		html += "</ul></div></div>";

		container = $elem.after( html ).next();

		// Save some precious data in the original select now, as we have the container in the DOM
		$elem.data( "bselect", {
			options: options,
			element: container
		});

		updateOptions( $elem, $.bselect.defaults, options );

		label = $("<span />").addClass("bselect-label").text( getPlaceholder( $elem ) );
		caret = $("<button type='button' />").addClass("bselect-caret").html("<span class='caret'></span>");
		container.prepend( caret ).prepend( label );

		label.outerWidth( $elem.outerWidth() - caret.outerWidth() );

		// Hide this ugly select!
		$elem.hide();

		// Event binding
		$( document ).click(function( e ) {
			if ( container.find(".bselect-dropdown").is(":visible") && !$( ".bselect-dropdown, .bselect-dropdown *", container ).find( e.target ).length ) {
				_callMethod( $elem, "hide" );
			}
		});

		container.find(".bselect-search-input").keyup( $.proxy( methods.search, $elem ) );
		container.on( "click", ".bselect-option", $.proxy( methods.select, $elem ) );
		container.on( "click", ".bselect-caret, .bselect-label", $.proxy( methods.toggle, $elem ) );
	}

	$.fn.bselect = function( arg ) {
		if ( typeof arg === "string" && this[ 0 ] && $.isPlainObject( $( this[ 0 ] ).data("bselect") ) ) {
			if ( methods[ arg ] !== undefined ) {
				return methods[ arg ].apply( $( this[ 0 ] ), Array.prototype.slice.call( arguments, 1 ) );
			}
		}

		return this.each(function() {
			arg = $.isPlainObject( arg ) ? arg : {};
			arg = $.extend( {}, $.bselect.defaults, arg );

			setup( this, arg );
		});
	};

	$.bselect = {
		defaults: {
			size: "normal",
			showOn: "both",
			clearSearchOnExit: true,
			minSearchInput: 0,
			animationDuration: 300,
			searchInput: true,
			select: null,
			selected: null
		},
		i18n: {
			selectAnOption: "Select an option"
		}
	};

})( jQuery );
