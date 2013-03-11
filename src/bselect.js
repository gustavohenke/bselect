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
			var searchInput, activeItem;
			var bselect = _callMethod( this, "element" ),
				dropdown = bselect.find(".bselect-dropdown");

			dropdown.css( "left", "-9999em" ).show();
			adjustDropdownHeight( bselect );

			// Adjust the scrolling to match the current select option position - issue #10
			activeItem = bselect.find(".bselect-option.active");
			if ( activeItem.length ) {
				var optionList = bselect.find(".bselect-option-list"),
					activeItemPos = activeItem.position().top,
					optionListPos = optionList.position().top;

				if ( activeItemPos - optionListPos < optionList.height() ) {
					optionList.scrollTop( 0 );
				} else {
					optionList.scrollTop( activeItemPos - optionListPos );
				}
			}

			dropdown.hide().css( "left", "auto" );

			dropdown.slideDown( _callMethod( this, "option", "animationDuration" ) );

			// The following class will allow us to show that nice inset shadow in .dropdown-toggle
			bselect.addClass("open");

			// Adjust the size of the search input to match the container inner width
			searchInput = bselect.find(".bselect-search-input").focus();
			searchInput.innerWidth( searchInput.parent().width() - searchInput.next().outerWidth() );

			bselect.find(".bselect-search-input").attr( "aria-expanded", "true" );

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

			bselect.find(".bselect-search-input").attr( "aria-expanded", "false" );

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

			// Remove the highlighted status from any previously selected item...
			var index = bselect.find("li")
				.removeClass("active")
				.attr( "aria-selected", "false" )
				.index( $elem );

			var option = this.find("option[value!='']").get( index );

			// Trigger the selected event
			this.trigger( "bselectselect", [ option ] );

			// ...and add to the new selected item :)
			val = $elem.addClass("active").data("value");
			$elem.attr( "aria-selected", "true" );

			bselect.find(".bselect-label").text( $elem.text() );
			_callMethod( this, "hide" );

			// We'll keep up-to-date the old select, too
			this.val( val );

			// Trigger the selected event
			this.trigger( "bselectselected", [ val, option ] );

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

			var results = $();

			listItems = bselect.find("li").hide();
			for ( i = 0; i < listItems.length; i++ ) {
				if ( listItems[ i ].textContent.toLowerCase().indexOf( searched.toLowerCase() ) > -1 ) {
					results = results.add( $( listItems[ i ] ).show() );
				}
			}

			if ( results.length === 0 ) {
				showNoOptionsAvailable( this );
			} else {
				bselect.find(".bselect-message").hide();
			}

			this.trigger( "bselectsearch", [ searched, results ] );

			adjustDropdownHeight( listItems.end() );
			return this;
		},

		clearSearch: function() {
			var bselect = _callMethod( this, "element" );

			bselect.find(".bselect-search-input").val("");
			bselect.find("li").show();
			bselect.find(".bselect-message").hide();

			adjustDropdownHeight( bselect );

			return this;
		},

		// Refreshes the option list. Useful when new HTML is added
		refresh: function() {
			var bselect = _callMethod( this, "element" ),
				optionList = bselect.find(".bselect-option-list").empty(),
				mapping = {},
				i = 0;

			this.find("option").each(function() {
				if ( !this.value ) {
					return;
				}

				var li = $( "<li class='bselect-option' />" ).attr({
					role: "option",
					"aria-selected": "false"
				}).data( "value", this.value );

				mapping[ this.value ] = i;

				li.append( "<a href='#'>" + this.text + "</a>" );
				li.appendTo( optionList );

				i++;
			});

			if ( i === 0 ) {
				showNoOptionsAvailable( this );
			}

			this.data("bselect").itemsMap = mapping;
			return this;
		},

		destroy : function() {
			var bselect = _callMethod( this, "element" );
			this.data( "bselect", null );

			bselect.remove();
			this.show();
			return this;
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

	// Show the 'no options available' message
	function showNoOptionsAvailable( $elem ) {
		var bselect = _callMethod( $elem, "element" );
		bselect.find(".bselect-message").text( $.bselect.i18n.noOptionsAvailable ).show();
	}

	// Run all the setup stuff
	function setup( elem, options ) {
		var caret, label, container, id, dropdown;
		var $elem = $( elem );

		// First of, let's build the base HTML of BSelect
		id = ++elements;
		container = $( "<div class='bselect' />", {
			id: "bselect-" + id
		});

		dropdown = $("<div class='bselect-dropdown' />");

		if ( options.searchInput === true ) {
			var search = $("<div class='bselect-search' />");
			
			$("<input type='text' class='bselect-search-input' />").attr({
				role: "combobox",
				"aria-expanded": "false",
				"aria-owns": "bselect-option-list-" + id

				// The W3C documentation says that role="combobox" should have aria-autocomplete,
				// but the validator tells us that this is invalid. Very strange.
				//"aria-autocomplete": "list"
			}).appendTo( search );

			$("<span class='bselect-search-icon'><i class='icon-search' /></span>").appendTo( search );

			search.appendTo( dropdown );
		}

		$("<div class='bselect-message' role='status' />").appendTo( dropdown );

		$("<ul class='bselect-option-list' />").attr({
			id: "bselect-option-list-" + id,
			role: "listbox"
		}).appendTo( dropdown );

		container.append( dropdown ).insertAfter( $elem );

		// Save some precious data in the original select now, as we have the container in the DOM
		$elem.data( "bselect", {
			options: options,
			element: container
		});

		updateOptions( $elem, $.bselect.defaults, options );
		_callMethod( $elem, "refresh" );

		$elem.bind( "bselectselect", options.select );
		$elem.bind( "bselectselected", options.selected );
		$elem.bind( "bselectsearch", options.search );

		label = $("<span />").addClass("bselect-label").text( getPlaceholder( $elem ) );
		caret = $("<button type='button' />").addClass("bselect-caret").html("<span class='caret'></span>");
		container.prepend( caret ).prepend( label );

		label.outerWidth( $elem.outerWidth() - caret.outerWidth() );

		// Hide this ugly select!
		$elem.hide();

		// Event binding
		$( window ).click(function( e ) {
			if ( container.find(".bselect-dropdown").is(":visible") && !$( ".bselect-dropdown, .bselect-dropdown *", container ).find( e.target ).length ) {
				_callMethod( $elem, "hide" );
			}
		});

		container.find(".bselect-search-input").keyup( $.proxy( methods.search, $elem ) );
		container.on( "click", ".bselect-option", $.proxy( methods.select, $elem ) );
		container.on( "click", ".bselect-caret, .bselect-label", $.proxy( methods.toggle, $elem ) );

		// Issue #6 - Listen to the change event and update the selected value
		$elem.bind( "change.bselect", function() {
			var index = $elem.data("bselect").itemsMap[ this.value ];
			_callMethod( $elem, "select", index );
		}).trigger("change.bselect");

		$( document ).on("click", "label[for='" + $elem.attr("id") + "']", function( e ) {
			_callMethod( $elem, "show" );
			return false;
		});
	}

	$.fn.bselect = function( arg ) {
		if ( typeof arg === "string" && this[ 0 ] ) {
			if ( $.isPlainObject( $( this[ 0 ] ).data("bselect") ) && methods[ arg ] !== undefined ) {
				return methods[ arg ].apply( $( this[ 0 ] ), Array.prototype.slice.call( arguments, 1 ) );
			}

			return this;
		}

		return this.each(function() {
			// #8 - avoid creating bselect again on the same element
			if ( $.isPlainObject( $( this ).data("bselect") ) ) {
				return;
			}

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
			search: null,
			select: null,
			selected: null
		},
		i18n: {
			selectAnOption: "Select an option",
			noOptionsAvailable: "No options available."
		}
	};

})( jQuery );
