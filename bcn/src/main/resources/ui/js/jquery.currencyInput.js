/*!
 * jQuery currencyInput plugin
 * Version 1.0.0-2017.06.23
 * Requires jQuery v1.7 or later
 *
 *
 * Thanks to Ronald M. Kasendwa for some excellent contributions!
 */

var currencyInput = (function($) {
	$.fn.currencyInput = function(options) {
		this.each(function(index, inputField) {
			var parentForm = $(inputField).closest('form');
			parentForm.on('submit', function() {
				currencyInput.unmaskValue();
			});
			parentForm.find('button, input[type="submit"]').on('click', function() {
				currencyInput.unmaskValue();
			});
			var currencyInput = $(inputField).removeAttr('data-role').attr('type', 'text').addClass('currency-input');
			currencyInput.on('keyup change', function() {
				currencyInput.checkValue(inputField);
			});
			currencyInput.on('keydown', function(e) {
				if(isNaN(parseInt(e.key)) && (e.keyCode !== 13 && e.keyCode !== 8)) {
					e.preventDefault();
				}
			});
			// currencyInput.on('blur', function() {
			// 	currencyInput.unmaskValue();
			// });
			currencyInput.on('focus', function() {
				currencyInput.checkValue(inputField);
			});
			var currencyInputControls = $('<div>', {class: "currency-input-controls"});
			currencyInput.addCommas = function(n) {
				var regX = /(\d+)(\d{3})/;
				return String(n).replace(/^\d+/, function(w) {
					while (regX.test(w)) {
						w = w.replace(regX, '$1,$2');
					}
					return w;
				});
			};
			currencyInput.validDigits = function(n, dec) {
				n = n.replace(/[^\d\.]+/g, '');
				var ax1 = n.indexOf('.'),
					ax2 = -1;
				if (ax1 != -1) {
					++ax1;
					ax2 = n.indexOf('.', ax1);
					if (ax2 > ax1) n = n.substring(0, ax2);
					if (typeof dec === 'number') n = n.substring(0, ax1 + dec);
				}
				return n;
			};
			currencyInput.checkValue = function() {
				var temp = this.validDigits(this.val(), 2);
				this.val(this.addCommas(temp));
			};
			currencyInput.updateValue = function(button) {
				var currentInputValue = parseFloat(this.validDigits(this.val(), 2)) || 0;
				var step = parseFloat(this.attr('step')) || 1;
				var minValue = parseFloat(this.attr('min')) || 0;
				var maxValue = parseFloat(this.attr('max')) || "infinity";
				var newInputValue = 0;
				if(button.hasClass('up')) {
					newInputValue = currentInputValue + step;
				} else if(button.hasClass('down')) {
					if(currentInputValue > minValue) {
						newInputValue = currentInputValue - step;
					}
				}
				this.val(newInputValue);
				this.checkValue();
			};
			currencyInput.unmaskValue = function() {
				this.val(this.validDigits(this.val(), 2));
			}
			currencyInput.positionControls = function() {
				var currencyInputControlsHeight = currencyInput[0].offsetHeight;
				var currencyInputControlsTopOffset = (currencyInput.position().top + parseFloat(currencyInput.css('margin-top')));
				var currencyInputControlsLeftOffset = (currencyInput.position().left + currencyInput[0].offsetWidth + parseFloat(currencyInput.css('margin-left'))) - 16;

				currencyInputControls.css({
					'height': currencyInputControlsHeight + 'px',
					// 'height': 34 + 'px',
					'top': currencyInputControlsTopOffset + 'px',
					'left': currencyInputControlsLeftOffset + 'px'
				});
			}

			var control = $('<span>', {class: "currency-input-control"});
			var controlUp = control.clone().addClass('up').on('click', function() {
				currencyInput.updateValue($(this));
				currencyInput.trigger('focus');
			});
			var controlDown = control.clone().addClass('down').on('click', function() {
				currencyInput.updateValue($(this));
				currencyInput.trigger('focus');
			});

			currencyInputControls.append($('<div>').append(controlUp).append(controlDown));

			var currencyInputParent = currencyInput.parent();
			if(currencyInputParent.css('position') === "static") {
				currencyInputParent.css('position', 'relative');
			}
			currencyInput.positionControls();
			$(window).on('resize', function() {
				currencyInput.positionControls();
			});
			currencyInput.after(currencyInputControls);
		});
	};
	return function() {
		$('input[data-role="currency-input"], input[type="currency"]').currencyInput();
	};
})(jQuery);
