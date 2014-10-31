+function($) {
	'use strict';
	
	var toggle = '[data-toggle="scrotop"]';
	// SCROTOP PLUGIN Class
	var Scrotop = function(element, options) {

		this.element = $(element);
		this.options = $.extend({}, Scrotop.DEFAULTS, options);

		/* Wrap element */
		wrapper.call(this);
		this.transition = $.support.transition && $('#backtop').hasClass('fade');

		/* window scroll event */
		$(window).scroll($.proxy(function() {
			init.call(this);
		}, this));
	};
	Scrotop.VERSION = '3.2.0';
	Scrotop.DEFAULTS = {
		_wrapId: 'backtop',
		_code: 'show',
		_speed: 600,
		_trigger: 100
	};

	Scrotop.prototype.up = function() {
		$('html,body').animate({scrollTop: 0}, this.options._speed);
	};

	/* Init show or hide element */
	function init() {
		if ($(window).scrollTop() >= this.options._trigger) {
			this.show();
		} else {
			this.hide();
		}
	}

	/* Wrap element */
	function wrapper() {
		var logoWrap = this.element.wrap('<div id="gotop" class="top-button"></div>').parent();
		var codeWrap;
		var wrapper = logoWrap.wrap('<div class="fade" id="' + this.options._wrapId + '"></div>').parent();

		if (this.options._code === 'show') {
			codeWrap = $('<div id="qrcodes" class="top-button"></div>')
					.append($('<span>').addClass('icon-qrcode'))
					.append($('<div>').addClass('code-wrap').append($('<div>').append($('<div>').addClass('arrow'))));
		}
		wrapper.prepend(codeWrap);
	}

	/* Show scrotop element */
	Scrotop.prototype.show = function() {

		if ($('#backtop').hasClass('in') && $('#qrcodes').hasClass('in')) {
			return;
		}
		var $this = this.element,
				e;
		$this.trigger(e = $.Event('bs.scrotop.show', {
			relatedTarget: $this
		}));
		if (e.isDefaultPrevented())
			return;

		$('#qrcodes').off();// unbind #backtop one() event

		if (this.transition) {
			$('#backtop').addClass('in').one('bsTransitionEnd', function() {
				$('#qrcodes').addClass('in');
			}).emulateTransitionEnd(300);
		} else {
			$('#backtop').removeClass('fade').addClass('in');
		}
		$this.trigger({
			type: 'shown.bs.scrotop',
			relatedTarget: $this
		});
	};

	/* Hide scrotop element */
	Scrotop.prototype.hide = function() {

		if (!$('#backtop').hasClass('in')) {
			return;
		}
		var $this = this.element;
		$this.trigger({
			type: 'hide.bs.scrotop',
			relatedTarget: $this
		});

		$('#backtop').off(); // unbind #backtop one() event

		if (this.transition) {
			if (this.options._code === 'show') {
				$('#qrcodes').removeClass('in').one('bsTransitionEnd', function() {
					$('#backtop').removeClass('in');
				}).emulateTransitionEnd(300);
			} else {
				$('#backtop').removeClass('in');
			}
		} else {
			$('#backtop').addClass('fade');
			$('#backtop').removeClass('in');
		}

	};

	/* Clear funciton scroll event */
	Scrotop.prototype.clearScroll = function() {
		$('html,body').stop();
	};

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.scrotop');
			if (!data) {
				$this.data('bs.scrotop', (data = new Scrotop(this, option)));
			}
			if (typeof option === 'string') {
				data[option]();
			}
		});
	}

	/* Mousewheel direction 
	 * Compatibility mousewheel or ff DOMMouseScroll
	 * */
	function addEvent(elm, evType, fn, useCapture) {
		if (elm.addEventListener) {
			elm.addEventListener(evType, fn, useCapture); // DOM2.0
		} else {
			elm.attachEvent('on' + evType, fn); //IE5+
		}
	}

	var isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
	var mousewheel = isGecko ? "DOMMouseScroll" : "mousewheel";
	addEvent(document, mousewheel, function(event) {
		event = window.event || event;
		// todo something
		$('html,body').stop();

	}, false);

	var old = $.fn.scrotop;
	$.fn.scrotop = Plugin;
	$.fn.scrotop.noConflict = function() {
		$.fn.scrotop = old;
		return this;
	};

	$(document).on('click.bs.scrotop', toggle, function() {
		Plugin.call($(this), 'up');
	});
}(jQuery);


