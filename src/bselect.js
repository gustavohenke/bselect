(function($, undefined) {
	"use strict";

	function BSelect(element, settings) {
		var that = this;

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.element = element;

		/**
		 * @since   0.1.0a
		 * @type    {Object}
		 */
		this.settings = $.extend({}, $.bselect.defaults, settings);

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.container = null;

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.dropdownContainer = null;

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.searchInput = null;

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.label = null;

		/**
		 * @since   0.1.0a
		 * @type    {String}
		 */
		this.lastSearch = '';

		/**
		 * @since   0.1.0a
		 * @type    {jQuery}
		 */
		this.options = $();

		/**
		 * Hide the options list when there's a click outside it.
		 * Fired on document click.
		 *
		 * @since	0.1.0a
		 * @returns	void
		 */
		this._outsideClick = function(e) {
			if (that.dropdownContainer.is(':visible') && !$(e.target).is('.dropdown-menu, .dropdown-menu *')) {
				that.hide();
			}
		};

		/**
		 * @since   0.1.0a
		 * @returns void
		 */
		this.toggle = function() {
			if (!that.dropdownContainer.is(':visible')) {
				that.dropdownContainer.slideDown(that.settings.animationDuration);

				// The following class will allow us to show that nice inset shadow in .dropdown-toggle
				that.container.addClass('open');

				that.searchInput.innerWidth(that.searchInput.parent().width() - that.searchInput.next().outerWidth());
				
				return false;
			} else {
				that.hide();
			}
		};

		/**
		 * Hide the options list, with optional clearing of the search results.
		 *
		 * @since   0.1.0a
		 * @returns void
		 */
		this.hide = function(clear) {
			clear = clear === undefined ? true : clear;
			
			that.dropdownContainer.slideUp(that.settings.animationDuration);
			that.container.removeClass('open');

			// Clear the search input and the results, if that's case
			if (clear && that.settings.clearSearchOnExit) {
				that.clearSearch();
			}
		};

		/**
		 * Selects an element on the list. Will update the value of the select and the label of the bselect component.
		 * Fired on click of an <li> inside the dropdown menu.
		 *
		 * @since   0.1.0a
		 * @returns void
		 */
		this.select = function() {
			if (typeof that.settings.select === 'function') {
				that.settings.select.call(that.element, this);
			}

			var val = $(this).addClass('active').data('value');
			that.element.val(val);
			that.label.text($(this).text());
			that.hide();
		};

		/**
		 * Search all our options looking for the typed text.
		 * Fired on keyup of the search input.
		 *
		 * @since   0.1.0a
		 * @returns void
		 */
		this.doSearch = function() {
			var optionsList, i,
				searched = this.value;

			// Avoid searching for nothing
			if (searched === '') {
				that.clearSearch();
				return;
			}
			
			// Same search/few chars? We won't search then!
			if ((searched === that.lastSearch) || (searched.length < that.settings.minSearchInput)) {
				return;
			}

			optionsList = that.dropdownContainer.find('ul');
			optionsList.find('> li').detach();

			for (i = 0; i < that.options.length; i++) {
				if ($(that.options[i]).text().toLowerCase().indexOf(searched.toLowerCase()) > -1) {
					optionsList.append($(that.options[i]).clone(true));
				}
			}
		};
		
		/**
		 * @since	0.1.0a
		 * @returns	void
		 */
		this.clearSearch = function() {
			that.searchInput.val('');
			that.options.appendTo(that.dropdownContainer.find('ul').empty());
		};

		/**
		 * Initialization/setup stuff
		 *
		 * @since   0.1.0a
		 * @returns void
		 */
		this.setup = function() {
			var options, li, i, caret,
				list = $("<ul class='unstyled' />"),
				btn = $("<button class='btn' />"),
				container = $("<div class='bselect btn-group' />");

			if (that.settings.size !== 'normal' && BSelect.bootstrapButtonSizes.indexOf(that.settings.size) > -1) {
				btn.addClass('btn-' + that.settings.size);
			}

			li = $("<li />").append($("<a href='#' />"));
			options = that.element.find('option');
			i = 0;
			
			for (; i < options.length; i++) {
				that.options = that.options.add(
					li.clone()
						.find('a').text($(options[i]).text()).end()
						.data('value', options[i].value)
						.appendTo(list)
				);
			}

			caret = btn.clone().addClass('dropdown-toggle').html("<span class='caret'></span>").appendTo(container);
			that.label = btn.text(
				that.settings.placeholder ||
				that.element.data('placeholder') ||
				$.bselect.defaults.i18n.selectAnOption
			).prependTo(container);

			that.dropdownContainer = $('<div />')
				.addClass('dropdown-menu')
				.append(list)
				.appendTo(container);

			that.searchInput = $("<input type='text' />");
			$("<div class='input-append' />")
				.append(that.searchInput)
				.append('<span class="add-on"><i class="icon-search"></i></span>')
				.prependTo(that.dropdownContainer);

			this.container = container.insertAfter(that.element);

			// Width fixes
			btn.innerWidth(that.element.innerWidth() - caret.outerWidth());

			// Then, we can hide this ugly select box
			that.element.hide();

			// Event binding
			$(document).click(that._outsideClick);
			caret.click(that.toggle);
			
			if (that.settings.showOn === 'both') {
				that.label.click(that.toggle);
			}
			
			that.searchInput.keyup(that.doSearch);
			list.on('click', 'li', that.select);
		};

		this.setup();
	}

	BSelect.bootstrapButtonSizes = ['mini', 'small', 'large'];

	/**
	 * @since   0.1.0a
	 * @param   {Object} [settings]
	 * @return  {jQuery}
	 */
	$.fn.bselect = function(settings) {
		return this.each(function() {
			var $this = $(this),
				data = $(this).data('bselect');

			settings = $.isPlainObject(settings) ? settings : {};
			if (!data) {
				$this.data('bselect', new BSelect($this, settings));
			}
		});
	};

	$.bselect = {
		defaults : {
			size : 'normal',
			i18n : {
				selectAnOption : 'Select an option...'
			},
			showOn : 'both',
			clearSearchOnExit : true,
			searchMinInput    : 0,
			animationDuration : 300,
			select            : null
		}
	};

})(jQuery);