(function($, undefined) {
	"use strict";

	function BSelect(element, settings) {
		var self = this;

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
			if (self.dropdownContainer.is(':visible') && !$(e.target).is('.dropdown-menu, .dropdown-menu *')) {
				self.hide();
			}
		};

		/**
		 * @since   0.1.0a
		 * @returns void
		 */
		this.toggle = function() {
			if (!self.dropdownContainer.is(':visible')) {
				self.dropdownContainer.slideDown(self.settings.animationDuration, function() {
					var height = self.dropdownContainer.outerHeight(),
						top = self.dropdownContainer.offset().top;

					if ((height + top) > $(window).innerHeight()) {
						self.dropdownContainer.css('margin-top', -height - self.container.outerHeight() - 2);
					} else {
						self.dropdownContainer.css('margin-top', 2);
					}
				});

				// The following class will allow us to show that nice inset shadow in .dropdown-toggle
				self.container.addClass('open');

				self.searchInput.innerWidth(self.searchInput.parent().width() - self.searchInput.next().outerWidth());
				
				return false;
			} else {
				self.hide();
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
			
			self.dropdownContainer.slideUp(self.settings.animationDuration);
			self.container.removeClass('open');

			// Clear the search input and the results, if that's case
			if (clear && self.settings.clearSearchOnExit) {
				self.clearSearch();
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
			var val = $(this).addClass('active').data('value');
			self.element.val(val);
			self.label.text($(this).text());
			self.hide();
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
				self.clearSearch();
				return;
			}
			
			// Same search? We ain't search again then!
			if ((searched === self.lastSearch) || (searched.length < self.settings.minSearchInput)) {
				return;
			}

			optionsList = self.dropdownContainer.find('ul');
			optionsList.find('> li').detach();

			for (i = 0; i < self.options.length; i++) {
				if ($(self.options[i]).text().toLowerCase().indexOf(searched.toLowerCase()) > -1) {
					optionsList.append($(self.options[i]).clone(true));
				}
			}
		};
		
		/**
		 * @since	0.1.0a
		 * @returns	void
		 */
		this.clearSearch = function() {
			self.searchInput.val('');
			self.options.appendTo(self.dropdownContainer.find('ul').empty());
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

			if (self.settings.size !== 'normal' && BSelect.bootstrapButtonSizes.indexOf(self.settings.size) > -1) {
				btn.addClass('btn-' + self.settings.size);
			}

			li = $("<li />").append($("<a href='#' />")),
			options = self.element.find('option'),
			i = 0;
			
			for (; i < options.length; i++) {
				self.options = self.options.add(
					li.clone()
						.find('a').text($(options[i]).text()).end()
						.data('value', options[i].value)
						.appendTo(list)
				);
			}

			caret = btn.clone().addClass('dropdown-toggle').html("<span class='caret'></span>").appendTo(container);
			self.label = btn.text(
				self.settings.placeholder ||
				self.element.data('placeholder') ||
				$.bselect.defaults.i18n.selectAnOption
			).prependTo(container);

			self.dropdownContainer = $('<div />')
				.addClass('dropdown-menu')
				.append(list)
				.appendTo(container);

			self.searchInput = $("<input type='text' />");
			$("<div class='input-append' />")
				.append(self.searchInput)
				.append('<span class="add-on"><i class="icon-search"></i></span>')
				.prependTo(self.dropdownContainer);

			this.container = container.insertAfter(self.element);

			// Width fixes
			btn.innerWidth(self.element.innerWidth() - caret.outerWidth());

			// Then, we can hide this ugly select box
			self.element.hide();

			// Event binding
			$(document).click(self._outsideClick);
			caret.click(self.toggle);
			
			if (self.settings.showOn === 'both') {
				self.label.click(self.toggle);
			}
			
			self.searchInput.keyup(self.doSearch);
			list.on('click', 'li', self.select);
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
			animationDuration : 300
		}
	};

})(jQuery);