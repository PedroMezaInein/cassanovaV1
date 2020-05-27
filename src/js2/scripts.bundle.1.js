/* eslint-disable no-unused-expressions */ 
"use strict";
 
import $ from 'jquery';   
import Sticky from 'sticky-js';
import moment from 'moment';
import DOMPurify from 'dompurify';
import PerfectScrollbar from 'perfect-scrollbar';
import ClipboardJS from 'clipboard';
import offcanvas from 'offcanvas';
import setCookie from 'set-cookie';
var HOST_URL = "https://keenthemes.com/metronic/tools/preview";
var KTAppSettings = { "breakpoints": { "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1200 }, "colors": { "theme": { "base": { "white": "#ffffff", "primary": "#6993FF", "secondary": "#E5EAEE", "success": "#1BC5BD", "info": "#8950FC", "warning": "#FFA800", "danger": "#F64E60", "light": "#F3F6F9", "dark": "#212121" }, "light": { "white": "#ffffff", "primary": "#E1E9FF", "secondary": "#ECF0F3", "success": "#C9F7F5", "info": "#EEE5FF", "warning": "#FFF4DE", "danger": "#FFE2E5", "light": "#F3F6F9", "dark": "#D6D6E0" }, "inverse": { "white": "#ffffff", "primary": "#ffffff", "secondary": "#212121", "success": "#ffffff", "info": "#ffffff", "warning": "#ffffff", "danger": "#ffffff", "light": "#464E5F", "dark": "#ffffff" } }, "gray": { "gray-100": "#F3F6F9", "gray-200": "#ECF0F3", "gray-300": "#E5EAEE", "gray-400": "#D6D6E0", "gray-500": "#B5B5C3", "gray-600": "#80808F", "gray-700": "#464E5F", "gray-800": "#1B283F", "gray-900": "#212121" } }, "font-family": "Poppins" };
// Component Definition
var KTApp = function() {
    /** @type {object} colors State colors **/
    var settings = {};

    var initTooltip = function(el) {
        var skin = el.data('skin') ? 'tooltip-' + el.data('skin') : '';
        var width = el.data('width') == 'auto' ? 'tooltop-auto-width' : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';
        var placement = el.data('placement') ? el.data('placement') : 'left';

        $(el).tooltip({
            trigger: triggerValue,
            template: '<div class="tooltip ' + skin + ' ' + width + '" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>'
        });
    }

    var initTooltips = function() {
        // init bootstrap tooltips
        $('[data-toggle="tooltip"]').each(function() {
            initTooltip($(this));
        });
    }

    var initPopover = function(el) {
        var skin = el.data('skin') ? 'popover-' + el.data('skin') : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';

        el.popover({
            trigger: triggerValue,
            template: '\
            <div class="popover ' + skin + '" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>'
        });
    }

    var initPopovers = function() {
        // init bootstrap popover
        $('[data-toggle="popover"]').each(function() {
            initPopover($(this));
        });
    }

    var initFileInput = function() {
        // init bootstrap popover
        $('.custom-file-input').on('change', function() {
            var fileName = $(this).val();
            $(this).next('.custom-file-label').addClass("selected").html(fileName);
        });
    }

    var initScroll = function() {
        $('[data-scroll="true"]').each(function() {
            var el = $(this);

            KTUtil.scrollInit(this, {
                mobileNativeScroll: true,
                handleWindowResize: true,
                rememberPosition: (el.data('remember-position') == 'true' ? true : false),
                height: function() {
                    if (KTUtil.isBreakpointDown('lg') && el.data('mobile-height')) {
                        return el.data('mobile-height');
                    } else {
                        return el.data('height');
                    }
                }
            });
        });
    }

    var initAlerts = function() {
        // init bootstrap popover
        $('body').on('click', '[data-close=alert]', function() {
            $(this).closest('.alert').hide();
        });
    }

    var initCard = function(el, options) {
        // init card tools
        var el = $(el);
        var card = new KTCard(el[0], options);
    }

    var initCards = function() {
        // init card tools
        $('[data-card="true"]').each(function() {
            var el = $(this);
            var options = {};

            if (el.data('data-card-initialized') !== true) {
                initCard(el, options);
                el.data('data-card-initialized', true);
            }
        });
    }

    var initStickyCard = function() {
        if (typeof Sticky === 'undefined') {
            return;
        }

        var sticky = new Sticky('[data-sticky="true"]');
    }

    var initAbsoluteDropdown = function(context) {
        var dropdownMenu;

        if (!context) {
            return;
        }

        $('body').on('show.bs.dropdown', context, function(e) {
        	dropdownMenu = $(e.target).find('.dropdown-menu');
        	$('body').append(dropdownMenu.detach());
        	dropdownMenu.css('display', 'block');
        	dropdownMenu.position({
        		'my': 'right top',
        		'at': 'right bottom',
        		'of': $(e.relatedTarget),
        	});
        }).on('hide.bs.dropdown', context, function(e) {
        	$(e.target).append(dropdownMenu.detach());
        	dropdownMenu.hide();
        });
    }

    var initAbsoluteDropdowns = function() {
        $('body').on('show.bs.dropdown', function(e) {
            // e.target is always parent (contains toggler and menu)
            var $toggler = $(e.target).find("[data-attach='body']");
            if ($toggler.length === 0) {
                return;
            }
            var $dropdownMenu = $(e.target).find('.dropdown-menu');
            // save detached menu
            var $detachedDropdownMenu = $dropdownMenu.detach();
            // save reference to detached menu inside data of toggler
            $toggler.data('dropdown-menu', $detachedDropdownMenu);

            $('body').append($detachedDropdownMenu);
            $detachedDropdownMenu.css('display', 'block');
            $detachedDropdownMenu.position({
                my: 'right top',
                at: 'right bottom',
                of: $(e.relatedTarget),
            });
        });

        $('body').on('hide.bs.dropdown', function(e) {
            var $toggler = $(e.target).find("[data-attach='body']");
            if ($toggler.length === 0) {
                return;
            }
            // access to reference of detached menu from data of toggler
            var $detachedDropdownMenu = $toggler.data('dropdown-menu');
            // re-append detached menu inside parent
            $(e.target).append($detachedDropdownMenu.detach());
            // hide dropdown
            $detachedDropdownMenu.hide();
        });
    };

    return {
        init: function(settingsArray) {
            if (settingsArray) {
                settings = settingsArray;
            }

            KTApp.initComponents();
        },

        initComponents: function() {
            initScroll();
            initTooltips();
            initPopovers();
            initAlerts();
            initFileInput();
            initCards();
            initStickyCard();
            initAbsoluteDropdowns();
        },

        initTooltips: function() {
            initTooltips();
        },

        initTooltip: function(el) {
            initTooltip(el);
        },

        initPopovers: function() {
            initPopovers();
        },

        initPopover: function(el) {
            initPopover(el);
        },

        initCard: function(el, options) {
            initCard(el, options);
        },

        initCards: function() {
            initCards();
        },

        initSticky: function() {
            this.initSticky();
        },

        initAbsoluteDropdown: function(context) {
            initAbsoluteDropdown(context);
        },

        block: function(target, options) {
            var el = $(target);

            options = $.extend(true, {
                opacity: 0.05,
                overlayColor: '#000000',
                type: '',
                size: '',
                state: 'primary',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);

            var html;
            var version = options.type ? 'spinner-' + options.type : '';
            var state = options.state ? 'spinner-' + options.state : '';
            var size = options.size ? 'spinner-' + options.size : '';
            var spinner = '<span class="spinner ' + version + ' ' + state + ' ' + size + '"></span';

            if (options.message && options.message.length > 0) {
                var classes = 'blockui ' + (options.shadow === false ? 'blockui' : '');

                html = '<div class="' + classes + '"><span>' + options.message + '</span>' + spinner + '</div>';

                var el = document.createElement('div');

                $('body').prepend(el);
                KTUtil.addClass(el, classes);
                el.innerHTML = html;
                options.width = KTUtil.actualWidth(el) + 10;
                KTUtil.remove(el);

                if (target == 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-' + (options.width / 2) + 'px;"><span>' + options.message + '</span><span>' + spinner + '</span></div>';
                }
            } else {
                html = spinner;
            }

            var params = {
                message: html,
                centerY: options.centerY,
                centerX: options.centerX,
                css: {
                    top: '30%',
                    left: '50%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
                    width: options.width
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor,
                    opacity: options.opacity,
                    cursor: 'wait',
                    zIndex: (target == 'body' ? 1100 : 10)
                },
                onUnblock: function() {
                    if (el && el[0]) {
                        KTUtil.css(el[0], 'position', '');
                        KTUtil.css(el[0], 'zoom', '');
                    }
                }
            };

            if (target == 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },

        unblock: function(target) {
            if (target && target != 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },

        blockPage: function(options) {
            return KTApp.block('body', options);
        },

        unblockPage: function() {
            return KTApp.unblock('body');
        },

        progress: function(target, options) {
            var color = (options && options.color) ? options.color : 'light';
            var alignment = (options && options.alignment) ? options.alignment : 'right';
            var size = (options && options.size) ? ' spinner-' + options.size : '';
            var classes = 'spinner ' + 'spinner-' + options.skin + ' spinner-' + alignment + size;

            KTApp.unprogress(target);
            KTUtil.attr(target, 'disabled', true);

            $(target).addClass(classes);
            $(target).data('progress-classes', classes);
        },

        unprogress: function(target) {
            $(target).removeClass($(target).data('progress-classes'));
            KTUtil.removeAttr(target, 'disabled');
        },

        getSettings: function() {
            return settings;
        }
    };
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTApp;
}

// Initialize KTApp class on document ready
$(document).ready(function() {
    KTApp.init(KTAppSettings);
});

"use strict";

// Component Definition
var KTCard = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        toggleSpeed: 400,
        sticky: {
            releseOnReverse: false,
            offset: 300,
            zIndex: 101
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('card')) {
                the = KTUtil.data(element).get('card');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('card', the);
            }

            return the;
        },

        /**
         * Init card
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
            the.header = KTUtil.child(element, '.card-header');
            the.footer = KTUtil.child(element, '.card-footer');

            if (KTUtil.child(element, '.card-body')) {
                the.body = KTUtil.child(element, '.card-body');
            } else if (KTUtil.child(element, '.form')) {
                the.body = KTUtil.child(element, '.form');
            }
        },

        /**
         * Build Form Wizard
         */
        build: function() {
            // Remove
            var remove = KTUtil.find(the.header, '[data-card-tool=remove]');
            if (remove) {
                KTUtil.addEvent(remove, 'click', function(e) {
                    e.preventDefault();
                    Plugin.remove();
                });
            }

            // Reload
            var reload = KTUtil.find(the.header, '[data-card-tool=reload]');
            if (reload) {
                KTUtil.addEvent(reload, 'click', function(e) {
                    e.preventDefault();
                    Plugin.reload();
                });
            }

            // Toggle
            var toggle = KTUtil.find(the.header, '[data-card-tool=toggle]');
            if (toggle) {
                KTUtil.addEvent(toggle, 'click', function(e) {
                    e.preventDefault();
                    Plugin.toggle();
                });
            }
        },

        /**
         * Enable stickt mode
         */
        initSticky: function() {
            var lastScrollTop = 0;
            var offset = the.options.sticky.offset;

            if (!the.header) {
                return;
            }

	        window.addEventListener('scroll', Plugin.onScrollSticky);
        },

	    /**
	     * Window scroll handle event for sticky card
	     */
	    onScrollSticky: function(e) {
		    var offset = the.options.sticky.offset;

		    if(isNaN(offset)) return;

		    var st = KTUtil.getScrollTop();

		    if (st >= offset && KTUtil.hasClass(body, 'card-sticky-on') === false) {
			    Plugin.eventTrigger('stickyOn');

			    KTUtil.addClass(body, 'card-sticky-on');

			    Plugin.updateSticky();

		    } else if ((st*1.5) <= offset && KTUtil.hasClass(body, 'card-sticky-on')) {
			    // Back scroll mode
			    Plugin.eventTrigger('stickyOff');

			    KTUtil.removeClass(body, 'card-sticky-on');

			    Plugin.resetSticky();
		    }
	    },

        updateSticky: function() {
            if (!the.header) {
                return;
            }

            var top;

            if (KTUtil.hasClass(body, 'card-sticky-on')) {
                if (the.options.sticky.position.top instanceof Function) {
                    top = parseInt(the.options.sticky.position.top.call(this, the));
                } else {
                    top = parseInt(the.options.sticky.position.top);
                }

                var left;
                if (the.options.sticky.position.left instanceof Function) {
                    left = parseInt(the.options.sticky.position.left.call(this, the));
                } else {
                    left = parseInt(the.options.sticky.position.left);
                }

                var right;
                if (the.options.sticky.position.right instanceof Function) {
                    right = parseInt(the.options.sticky.position.right.call(this, the));
                } else {
                    right = parseInt(the.options.sticky.position.right);
                }

                KTUtil.css(the.header, 'z-index', the.options.sticky.zIndex);
                KTUtil.css(the.header, 'top', top + 'px');
                KTUtil.css(the.header, 'left', left + 'px');
                KTUtil.css(the.header, 'right', right + 'px');
            }
        },

        resetSticky: function() {
            if (!the.header) {
                return;
            }

            if (KTUtil.hasClass(body, 'card-sticky-on') === false) {
                KTUtil.css(the.header, 'z-index', '');
                KTUtil.css(the.header, 'top', '');
                KTUtil.css(the.header, 'left', '');
                KTUtil.css(the.header, 'right', '');
            }
        },

        /**
         * Remove card
         */
        remove: function() {
            if (Plugin.eventTrigger('beforeRemove') === false) {
                return;
            }

            KTUtil.remove(element);

            Plugin.eventTrigger('afterRemove');
        },

        /**
         * Set content
         */
        setContent: function(html) {
            if (html) {
                the.body.innerHTML = html;
            }
        },

        /**
         * Get body
         */
        getBody: function() {
            return the.body;
        },

        /**
         * Get self
         */
        getSelf: function() {
            return element;
        },

        /**
         * Reload
         */
        reload: function() {
            Plugin.eventTrigger('reload');
        },

        /**
         * Toggle
         */
        toggle: function() {
            if (KTUtil.hasClass(element, 'card-collapse') || KTUtil.hasClass(element, 'card-collapsed')) {
                Plugin.expand();
            } else {
                Plugin.collapse();
            }
        },

        /**
         * Collapse
         */
        collapse: function() {
            if (Plugin.eventTrigger('beforeCollapse') === false) {
                return;
            }

            KTUtil.slideUp(the.body, the.options.toggleSpeed, function() {
                Plugin.eventTrigger('afterCollapse');
            });

            KTUtil.addClass(element, 'card-collapse');
        },

        /**
         * Expand
         */
        expand: function() {
            if (Plugin.eventTrigger('beforeExpand') === false) {
                return;
            }

            KTUtil.slideDown(the.body, the.options.toggleSpeed, function() {
                Plugin.eventTrigger('afterExpand');
            });

            KTUtil.removeClass(element, 'card-collapse');
            KTUtil.removeClass(element, 'card-collapsed');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Remove card
     */
    the.remove = function() {
        return Plugin.remove(this.html);
    };

    /**
     * Init sticky card
     */
    the.initSticky = function() {
        return Plugin.initSticky();
    };

    /**
     * Rerender sticky layout
     */
    the.updateSticky = function() {
        return Plugin.updateSticky();
    };

    /**
     * Reset the sticky
     */
    the.resetSticky = function() {
        return Plugin.resetSticky();
    };

	/**
	 * Destroy sticky card
	 */
	the.destroySticky = function() {
		Plugin.resetSticky();
		window.removeEventListener('scroll', Plugin.onScrollSticky);
	};

    /**
     * Reload card
     */
    the.reload = function() {
        return Plugin.reload();
    };

    /**
     * Set card content
     */
    the.setContent = function(html) {
        return Plugin.setContent(html);
    };

    /**
     * Toggle card
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Collapse card
     */
    the.collapse = function() {
        return Plugin.collapse();
    };

    /**
     * Expand card
     */
    the.expand = function() {
        return Plugin.expand();
    };

    /**
     * Get cardbody
     * @returns {jQuery}
     */
    the.getBody = function() {
        return Plugin.getBody();
    };

    /**
     * Get cardbody
     * @returns {jQuery}
     */
    the.getSelf = function() {
        return Plugin.getSelf();
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTCard;
}

"use strict";
// DOCS: https://javascript.info/cookie

// Component Definition 
var KTCookie = function() {
  return {
    // returns the cookie with the given name,
    // or undefined if not found
    getCookie: function(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    // Please note that a cookie value is encoded,
    // so getCookie uses a built-in decodeURIComponent function to decode it.
    setCookie: function(name, value, options) {
      if (!options) {
        options = {};
      }

      options = Object.assign({}, {path: '/'}, options);

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
      }

      var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

      for (var optionKey in options) {
        if (!options.hasOwnProperty(optionKey)) {
          continue;
        }
        updatedCookie += "; " + optionKey;
        var optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += "=" + optionValue;
        }
      }

      document.cookie = updatedCookie;
    },
    // To delete a cookie, we can call it with a negative expiration date:
    deleteCookie: function(name) {
      setCookie(name, "", {
        'max-age': -1
      })
    }
  }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = KTCookie;
}

"use strict";

// Component Definition 
var KTDialog = function(options) {
    // Main object
    var the = this;

    // Get element object
    var element;
    var body = KTUtil.getBody();

    // Default options
    var defaultOptions = {
        'placement' : 'top center',
        'type'  : 'loader',
        'width' : 100,
        'state' : 'default',
        'message' : 'Loading...'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            Plugin.init(options);

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.state = false;
        },

        /**
         * Show dialog
         */
        show: function() {
            Plugin.eventTrigger('show');

            element = document.createElement("DIV");
            KTUtil.setHTML(element, the.options.message);

            KTUtil.addClass(element, 'dialog dialog-shown');
            KTUtil.addClass(element, 'dialog-' + the.options.state);
            KTUtil.addClass(element, 'dialog-' + the.options.type);

            if (the.options.placement == 'top center') {
                KTUtil.addClass(element, 'dialog-top-center');
            }

            body.appendChild(element);

            the.state = 'shown';

            Plugin.eventTrigger('shown');

            return the;
        },

        /**
         * Hide dialog
         */
        hide: function() {
            if (element) {
                Plugin.eventTrigger('hide');

                element.remove();
                the.state = 'hidden';

                Plugin.eventTrigger('hidden');
            }

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Check shown state
     */
    the.shown = function() {
        return the.state == 'shown';
    };

    /**
     * Check hidden state
     */
    the.hidden = function() {
        return the.state == 'hidden';
    };

    /**
     * Show dialog
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Hide dialog
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTDialog;
}

"use strict";

// Component Definition
var KTHeader = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (element === undefined) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: {
            desktop: true,
            tabletAndMobile: true
        },
        releseOnReverse: {
            desktop: false,
            tabletAndMobile: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTHeader}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('header')) {
                the = KTUtil.data(element).get('header');
            } else {
                // reset header
                Plugin.init(options);

                // build header
                Plugin.build();

                KTUtil.data(element).set('header', the);
            }

            return the;
        },

        /**
         * Handles subheader click toggle
         * @returns {KTHeader}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Reset header
         * @returns {KTHeader}
         */
        build: function() {
            var eventTriggerState = true;
            var viewportHeight = KTUtil.getViewPort().height;
            var documentHeight = KTUtil.getDocumentHeight();
            var lastScrollTop = 0;

            window.addEventListener('scroll', function() {
                var offset = 0, st, attrName;

                if (KTUtil.isBreakpointDown('lg') && the.options.offset.tabletAndMobile === false) {
                    return;
                }

                if (KTUtil.isBreakpointUp('lg') && the.options.offset.desktop === false) {
                    return;
                }

                if (KTUtil.isBreakpointUp('lg')) {
                    offset = the.options.offset.desktop;
                } else if (KTUtil.isBreakpointDown('lg')) {
                    offset = the.options.offset.tabletAndMobile;
                }

                st = KTUtil.getScrollTop();

                if (
                    (KTUtil.isBreakpointDown('lg') && the.options.releseOnReverse.tabletAndMobile) ||
                    (KTUtil.isBreakpointUp('lg') && the.options.releseOnReverse.desktop)
                ) {
                    if (st > offset && lastScrollTop < st) { // down scroll mode
                        if (body.hasAttribute('data-header-scroll') === false) {
                            body.setAttribute('data-header-scroll', 'on');
                        }

                        if (eventTriggerState) {
                            Plugin.eventTrigger('scrollOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        if (body.hasAttribute('data-header-scroll') === true) {
                            body.removeAttribute('data-header-scroll');
                        }

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('scrollOff', the);
                            eventTriggerState = true;
                        }
                    }

                    lastScrollTop = st;
                } else {
                    if (st > offset) { // down scroll mode
                        if (body.hasAttribute('data-header-scroll') === false) {
                            body.setAttribute('data-header-scroll', 'on');
                        }

                        if (eventTriggerState) {
                            Plugin.eventTrigger('scrollOn', the);
                            eventTriggerState = false;
                        }
                    } else { // back scroll mode
                        if (body.hasAttribute('data-header-scroll') === true) {
                            body.removeAttribute('data-header-scroll');
                        }

                        if (eventTriggerState == false) {
                            Plugin.eventTrigger('scrollOff', the);
                            eventTriggerState = true;
                        }
                    }
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                        return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTHeader;
}

"use strict";

// Component Definition 
var KTImageInput = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        editMode: false
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('imageinput')) {
                the = KTUtil.data(element).get('imageinput');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('imageinput', the);
            }

            return the;
        },

        /**
         * Init avatar
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            the.input = KTUtil.find(element, 'input[type="file"]');
            the.wrapper = KTUtil.find(element, '.image-input-wrapper');
            the.cancel = KTUtil.find(element, '[data-action="cancel"]');
            the.remove = KTUtil.find(element, '[data-action="remove"]');
            the.src = KTUtil.css(the.wrapper, 'backgroundImage');
            the.hidden = KTUtil.find(element, 'input[type="hidden"]');

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        /**
         * Build
         */
        build: function() {
            // Handle change
            KTUtil.addEvent(the.input, 'change', function(e) {
                e.preventDefault();

	            if (the.input && the.input.files && the.input.files[0]) {
	                var reader = new FileReader();
	                reader.onload = function(e) {
	                    KTUtil.css(the.wrapper, 'background-image', 'url('+e.target.result +')');
	                }
	                reader.readAsDataURL(the.input.files[0]);

	                KTUtil.addClass(the.element, 'image-input-changed');
                    KTUtil.removeClass(the.element, 'image-input-empty');

                    // Fire change event
                    Plugin.eventTrigger('change');
	            }
            });

            // Handle cancel
            KTUtil.addEvent(the.cancel, 'click', function(e) {
                e.preventDefault();

                // Fire cancel event
                Plugin.eventTrigger('cancel');

	            KTUtil.removeClass(the.element, 'image-input-changed');
                KTUtil.removeClass(the.element, 'image-input-empty');
	            KTUtil.css(the.wrapper, 'background-image', the.src);
	            the.input.value = "";

                if (the.hidden) {
                    the.hidden.value = "0";
                }
            });

            // Handle remove
            KTUtil.addEvent(the.remove, 'click', function(e) {
                e.preventDefault();

                // Fire cancel event
                Plugin.eventTrigger('remove');

	            KTUtil.removeClass(the.element, 'image-input-changed');
                KTUtil.addClass(the.element, 'image-input-empty');
	            KTUtil.css(the.wrapper, 'background-image', "none");
	            the.input.value = "";

                if (the.hidden) {
                    the.hidden.value = "1";
                }
            });
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            //KTUtil.triggerCustomEvent(name);
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Attach event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTImageInput;
}

"use strict";

// Component Definition
var KTMenu = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        // scrollable area with Perfect Scroll
        scroll: {
            rememberPosition: false
        },

        // accordion submenu mode
        accordion: {
            slideSpeed: 200, // accordion toggle slide speed in milliseconds
            autoScroll: false, // enable auto scrolling(focus) to the clicked menu item
            autoScrollSpeed: 1200,
            expandAll: true // allow having multiple expanded accordions in the menu
        },

        // dropdown submenu mode
        dropdown: {
            timeout: 500 // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {KTMenu}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('menu')) {
                the = KTUtil.data(element).get('menu');
            } else {
                // reset menu
                Plugin.init(options);

                // reset menu
                Plugin.reset();

                // build menu
                Plugin.build();

                KTUtil.data(element).set('menu', the);
            }

            return the;
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        init: function(options) {
            the.events = [];

            the.eventHandlers = {};

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

            the.uid = KTUtil.getUniqueID();
        },

        update: function(options) {
            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            // pause menu
            the.pauseDropdownHoverTime = 0;

             // reset menu
            Plugin.reset();

            the.eventHandlers = {};

            // build menu
            Plugin.build();

            KTUtil.data(element).set('menu', the);
        },

        reload: function() {
             // reset menu
            Plugin.reset();

            // build menu
            Plugin.build();

            // reset submenu props
            Plugin.resetSubmenuProps();
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        build: function() {
            // General accordion submenu toggle
            the.eventHandlers['event_1'] = KTUtil.on( element, '.menu-toggle', 'click', Plugin.handleSubmenuAccordion);

            // Dropdown mode(hoverable)
            if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {
                // dropdown submenu - hover toggle
                the.eventHandlers['event_2'] = KTUtil.on( element, '[data-menu-toggle="hover"]', 'mouseover', Plugin.handleSubmenuDrodownHoverEnter);
                the.eventHandlers['event_3'] = KTUtil.on( element, '[data-menu-toggle="hover"]', 'mouseout', Plugin.handleSubmenuDrodownHoverExit);

                // dropdown submenu - click toggle
                the.eventHandlers['event_4'] = KTUtil.on( element, '[data-menu-toggle="click"] > .menu-toggle, [data-menu-toggle="click"] > .menu-link .menu-toggle', 'click', Plugin.handleSubmenuDropdownClick);
                the.eventHandlers['event_5'] = KTUtil.on( element, '[data-menu-toggle="tab"] > .menu-toggle, [data-menu-toggle="tab"] > .menu-link .menu-toggle', 'click', Plugin.handleSubmenuDropdownTabClick);
            }

            // Handle general link click
            the.eventHandlers['event_6'] = KTUtil.on(element, '.menu-item > .menu-link:not(.menu-toggle):not(.menu-link-toggle-skip)', 'click', Plugin.handleLinkClick);

            // Init scrollable menu
            if (the.options.scroll && the.options.scroll.height) {
                Plugin.scrollInit();
            }
        },

        /**
         * Reset menu
         * @returns {KTMenu}
         */
        reset: function() {
            KTUtil.off( element, 'click', the.eventHandlers['event_1']);

            // dropdown submenu - hover toggle
            KTUtil.off( element, 'mouseover', the.eventHandlers['event_2']);
            KTUtil.off( element, 'mouseout', the.eventHandlers['event_3']);

            // dropdown submenu - click toggle
            KTUtil.off( element, 'click', the.eventHandlers['event_4']);
            KTUtil.off( element, 'click', the.eventHandlers['event_5']);

            // handle link click
            KTUtil.off(element, 'click', the.eventHandlers['event_6']);
        },

        /**
         * Init scroll menu
         *
        */
        scrollInit: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollDestroy(element, true);
                KTUtil.scrollInit(element, {mobileNativeScroll: true, windowScroll: false, resetHeightOnDestroy: true, handleWindowResize: true, height: the.options.scroll.height, rememberPosition: the.options.scroll.rememberPosition});
            } else {
                KTUtil.scrollDestroy(element, true);
            }
        },

        /**
         * Update scroll menu
        */
        scrollUpdate: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollUpdate(element);
            }
        },

        /**
         * Scroll top
        */
        scrollTop: function() {
            if ( the.options.scroll && the.options.scroll.height ) {
                KTUtil.scrollTop(element);
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        getSubmenuMode: function(el) {
            if ( KTUtil.isBreakpointUp('lg') ) {
                if (el && KTUtil.hasAttr(el, 'data-menu-toggle') && KTUtil.attr(el, 'data-menu-toggle') == 'hover') {
                    return 'dropdown';
                }

                if ( KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                    if ( KTUtil.hasClasses(body, the.options.submenu.desktop.state.body) ) {
                        return the.options.submenu.desktop.state.mode;
                    } else {
                        return the.options.submenu.desktop.default;
                    }
                } else if ( KTUtil.isset(the.options.submenu, 'desktop') ) {
                    return the.options.submenu.desktop;
                }
            } else if ( KTUtil.isBreakpointUp('md') && KTUtil.isBreakpointDown('lg') && KTUtil.isset(the.options.submenu, 'tablet') ) {
                return the.options.submenu.tablet;
            } else if ( KTUtil.isBreakpointDown('md') && KTUtil.isset(the.options.submenu, 'mobile') ) {
                return the.options.submenu.mobile;
            } else {
                return false;
            }
        },

        /**
         * Get submenu mode for current breakpoint and menu state
         * @returns {KTMenu}
         */
        isConditionalSubmenuDropdown: function() {
            if ( KTUtil.isBreakpointUp('lg') && KTUtil.isset(the.options.submenu, 'desktop.state.body') ) {
                return true;
            } else {
                return false;
            }
        },


        /**
         * Reset submenu attributes
         * @returns {KTMenu}
         */
        resetSubmenuProps: function(e) {
            var submenus = KTUtil.findAll(element, '.menu-submenu');
            if ( submenus ) {
                for (var i = 0, len = submenus.length; i < len; i++) {
                    KTUtil.css(submenus[0], 'display', '');
                    KTUtil.css(submenus[0], 'overflow', '');
                }
            }
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverEnter: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            var item = this;

            if ( item.getAttribute('data-hover') == '1' ) {
                item.removeAttribute('data-hover');
                clearTimeout( item.getAttribute('data-timeout') );
                item.removeAttribute('data-timeout');
            }

            Plugin.showSubmenuDropdown(item);
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        handleSubmenuDrodownHoverExit: function(e) {
            if ( the.resumeDropdownHover() === false ) {
                return;
            }

            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this;
            var time = the.options.dropdown.timeout;

            var timeout = setTimeout(function() {
                if ( item.getAttribute('data-hover') == '1' ) {
                    Plugin.hideSubmenuDropdown(item, true);
                }
            }, time);

            item.setAttribute('data-hover', '1');
            item.setAttribute('data-timeout', timeout);
        },

        /**
         * Handles submenu click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClick: function(e) {
            if ( Plugin.getSubmenuMode(this) === 'accordion' ) {
                return;
            }

            var item = this.closest('.menu-item');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if ( item.getAttribute('data-menu-submenu-mode') == 'accordion' ) {
                return;
            }

            if ( KTUtil.hasClass(item, 'menu-item-hover') === false ) {
                KTUtil.addClass(item, 'menu-item-open-dropdown');
                Plugin.showSubmenuDropdown(item);
            } else {
                KTUtil.removeClass(item, 'menu-item-open-dropdown' );
                Plugin.hideSubmenuDropdown(item, true);
            }

            e.preventDefault();
        },

        /**
         * Handles tab click toggle
         * @returns {KTMenu}
         */
        handleSubmenuDropdownTabClick: function(e) {
            if (Plugin.getSubmenuMode(this) === 'accordion') {
                return;
            }
            var item = this.closest('.menu-item');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if (item.getAttribute('data-menu-submenu-mode') == 'accordion') {
                return;
            }

            if (KTUtil.hasClass(item, 'menu-item-hover') == false) {
                KTUtil.addClass(item, 'menu-item-open-dropdown');
                Plugin.showSubmenuDropdown(item);
            }

            e.preventDefault();
        },

        /**
         * Handles link click
         * @returns {KTMenu}
         */
        handleLinkClick: function(e) {
            var submenu = this.closest('.menu-item.menu-item-submenu');

            // Trigger click event handlers
            var result = Plugin.eventTrigger('linkClick', this, e);
            if (result === false) {
                return;
            }

            if ( submenu && Plugin.getSubmenuMode(submenu) === 'dropdown' ) {
                Plugin.hideSubmenuDropdowns();
            }
        },

        /**
         * Handles submenu dropdown close on link click
         * @returns {KTMenu}
         */
        handleSubmenuDropdownClose: function(e, el) {
            // exit if its not submenu dropdown mode
            if (Plugin.getSubmenuMode(el) === 'accordion') {
                return;
            }

            var shown = element.querySelectorAll('.menu-item.menu-item-submenu.menu-item-hover:not(.menu-item-tabs)');

            // check if currently clicked link's parent item ha
            if (shown.length > 0 && KTUtil.hasClass(el, 'menu-toggle') === false && el.querySelectorAll('.menu-toggle').length === 0) {
                // close opened dropdown menus
                for (var i = 0, len = shown.length; i < len; i++) {
                    Plugin.hideSubmenuDropdown(shown[0], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        handleSubmenuAccordion: function(e, el) {
            var query;
            var item = el ? el : this;

            // Trigger click event handlers
            var result = Plugin.eventTrigger('submenuToggle', this, e);
            if (result === false) {
                return;
            }

            if ( Plugin.getSubmenuMode(el) === 'dropdown' && (query = item.closest('.menu-item') ) ) {
                if (query.getAttribute('data-menu-submenu-mode') != 'accordion' ) {
                    e.preventDefault();
                    return;
                }
            }

            var li = item.closest('.menu-item');
            var submenu = KTUtil.child(li, '.menu-submenu, .menu-inner');

            if (KTUtil.hasClass(item.closest('.menu-item'), 'menu-item-open-always')) {
                return;
            }

            if ( li && submenu ) {
                e.preventDefault();
                var speed = the.options.accordion.slideSpeed;
                var hasClosables = false;

                if ( KTUtil.hasClass(li, 'menu-item-open') === false ) {
                    // hide other accordions
                    if ( the.options.accordion.expandAll === false ) {
                        var subnav = item.closest('.menu-nav, .menu-subnav');
                        var closables = KTUtil.children(subnav, '.menu-item.menu-item-open.menu-item-submenu:not(.menu-item-here):not(.menu-item-open-always)');

                        if ( subnav && closables ) {
                            for (var i = 0, len = closables.length; i < len; i++) {
                                var el_ = closables[0];
                                var submenu_ = KTUtil.child(el_, '.menu-submenu');
                                if ( submenu_ ) {
                                    KTUtil.slideUp(submenu_, speed, function() {
                                        Plugin.scrollUpdate();
                                        KTUtil.removeClass(el_, 'menu-item-open');
                                    });
                                }
                            }
                        }
                    }

                    KTUtil.slideDown(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.scrollUpdate();

                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.addClass(li, 'menu-item-open');

                } else {
                    KTUtil.slideUp(submenu, speed, function() {
                        Plugin.scrollToItem(item);
                        Plugin.eventTrigger('submenuToggle', submenu, e);
                    });

                    KTUtil.removeClass(li, 'menu-item-open');
                }
            }
        },

        /**
         * scroll to item function
         * @returns {KTMenu}
         */
        scrollToItem: function(item) {
            // handle auto scroll for accordion submenus
            if ( KTUtil.isBreakpointUp('lg')  && the.options.accordion.autoScroll && element.getAttribute('data-menu-scroll') !== '1' ) {
                KTUtil.scrollTo(item, the.options.accordion.autoScrollSpeed);
            }
        },

        /**
         * Hide submenu dropdown
         * @returns {KTMenu}
         */
        hideSubmenuDropdown: function(item, classAlso) {
            // remove submenu activation class
            if ( classAlso ) {
                KTUtil.removeClass(item, 'menu-item-hover');
                KTUtil.removeClass(item, 'menu-item-active-tab');
            }

            // clear timeout
            item.removeAttribute('data-hover');

            if ( item.getAttribute('data-menu-toggle-class') ) {
                KTUtil.removeClass(body, item.getAttribute('data-menu-toggle-class'));
            }

            var timeout = item.getAttribute('data-timeout');
            item.removeAttribute('data-timeout');
            clearTimeout(timeout);
        },

        /**
         * Hide submenu dropdowns
         * @returns {KTMenu}
         */
        hideSubmenuDropdowns: function() {
            var items;
            if ( items = element.querySelectorAll('.menu-item-submenu.menu-item-hover:not(.menu-item-tabs):not([data-menu-toggle="tab"])') ) {
                for (var j = 0, cnt = items.length; j < cnt; j++) {
                    Plugin.hideSubmenuDropdown(items[j], true);
                }
            }
        },

        /**
         * helper functions
         * @returns {KTMenu}
         */
        showSubmenuDropdown: function(item) {
            // close active submenus
            var list = element.querySelectorAll('.menu-item-submenu.menu-item-hover, .menu-item-submenu.menu-item-active-tab');

            if ( list ) {
                for (var i = 0, len = list.length; i < len; i++) {
                    var el = list[i];
                    if ( item !== el && el.contains(item) === false && item.contains(el) === false ) {
                        Plugin.hideSubmenuDropdown(el, true);
                    }
                }
            }

            // add submenu activation class
            KTUtil.addClass(item, 'menu-item-hover');

            if ( item.getAttribute('data-menu-toggle-class') ) {
                KTUtil.addClass(body, item.getAttribute('data-menu-toggle-class'));
            }
        },

        /**
         * Handles submenu slide toggle
         * @returns {KTMenu}
         */
        createSubmenuDropdownClickDropoff: function(el) {
            var query;
            var zIndex = (query = KTUtil.child(el, '.menu-submenu') ? KTUtil.css(query, 'z-index') : 0) - 1;

            var dropoff = document.createElement('<div class="menu-dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');

            body.appendChild(dropoff);

            KTUtil.addEvent(dropoff, 'click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                KTUtil.remove(this);
                Plugin.hideSubmenuDropdown(el, true);
            });
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        pauseDropdownHover: function(time) {
            var date = new Date();

            the.pauseDropdownHoverTime = date.getTime() + time;
        },

        /**
         * Handles submenu hover toggle
         * @returns {KTMenu}
         */
        resumeDropdownHover: function() {
            var date = new Date();

            return (date.getTime() > the.pauseDropdownHoverTime ? true : false);
        },

        /**
         * Reset menu's current active item
         * @returns {KTMenu}
         */
        resetActiveItem: function(item) {
            var list;
            var parents;

            list = element.querySelectorAll('.menu-item-active');

            for (var i = 0, len = list.length; i < len; i++) {
                var el = list[0];
                KTUtil.removeClass(el, 'menu-item-active');
                KTUtil.hide( KTUtil.child(el, '.menu-submenu') );
                parents = KTUtil.parents(el, '.menu-item-submenu') || [];

                for (var i_ = 0, len_ = parents.length; i_ < len_; i_++) {
                    var el_ = parents[i];
                    KTUtil.removeClass(el_, 'menu-item-open');
                    KTUtil.hide( KTUtil.child(el_, '.menu-submenu') );
                }
            }

            // close open submenus
            if ( the.options.accordion.expandAll === false ) {
                if ( list = element.querySelectorAll('.menu-item-open') ) {
                    for (var i = 0, len = list.length; i < len; i++) {
                        KTUtil.removeClass(parents[0], 'menu-item-open');
                    }
                }
            }
        },

        /**
         * Sets menu's active item
         * @returns {KTMenu}
         */
        setActiveItem: function(item) {
            // reset current active item
            Plugin.resetActiveItem();

            var parents = KTUtil.parents(item, '.menu-item-submenu') || [];
            for (var i = 0, len = parents.length; i < len; i++) {
                KTUtil.addClass(parents[i], 'menu-item-open');
            }

            KTUtil.addClass(item, 'menu-item-active');
        },

        /**
         * Returns page breadcrumbs for the menu's active item
         * @returns {KTMenu}
         */
        getBreadcrumbs: function(item) {
            var query;
            var breadcrumbs = [];
            var link = KTUtil.child(item, '.menu-link');

            breadcrumbs.push({
                text: (query = KTUtil.child(link, '.menu-text') ? query.innerHTML : ''),
                title: link.getAttribute('title'),
                href: link.getAttribute('href')
            });

            var parents = KTUtil.parents(item, '.menu-item-submenu');
            for (var i = 0, len = parents.length; i < len; i++) {
                var submenuLink = KTUtil.child(parents[i], '.menu-link');

                breadcrumbs.push({
                    text: (query = KTUtil.child(submenuLink, '.menu-text') ? query.innerHTML : ''),
                    title: submenuLink.getAttribute('title'),
                    href: submenuLink.getAttribute('href')
                });
            }

            return  breadcrumbs.reverse();
        },

        /**
         * Returns page title for the menu's active item
         * @returns {KTMenu}
         */
        getPageTitle: function(item) {
            var query;

            return (query = KTUtil.child(item, '.menu-text') ? query.innerHTML : '');
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name, target, e) {
            for (var i = 0; i < the.events.length; i++ ) {
                var event = the.events[i];
                if ( event.name == name ) {
                    if ( event.one == true ) {
                        if ( event.fired == false ) {
                            the.events[i].fired = true;
                            return event.handler.call(this, target, e);
                        }
                    } else {
                        return event.handler.call(this, target, e);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        },

        removeEvent: function(name) {
            if (the.events[name]) {
                delete the.events[name];
            }
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Update scroll
     */
    the.scrollUpdate = function() {
        return Plugin.scrollUpdate();
    };

    /**
     * Re-init scroll
     */
    the.scrollReInit = function() {
        return Plugin.scrollInit();
    };

    /**
     * Scroll top
     */
    the.scrollTop = function() {
        return Plugin.scrollTop();
    };

    /**
     * Set active menu item
     */
    the.setActiveItem = function(item) {
        return Plugin.setActiveItem(item);
    };

    the.reload = function() {
        return Plugin.reload();
    };

    the.update = function(options) {
        return Plugin.update(options);
    };

    /**
     * Set breadcrumb for menu item
     */
    the.getBreadcrumbs = function(item) {
        return Plugin.getBreadcrumbs(item);
    };

    /**
     * Set page title for menu item
     */
    the.getPageTitle = function(item) {
        return Plugin.getPageTitle(item);
    };

    /**
     * Get submenu mode
     */
    the.getSubmenuMode = function(el) {
        return Plugin.getSubmenuMode(el);
    };

    /**
     * Hide dropdown
     * @returns {Object}
     */
    the.hideDropdown = function(item) {
        Plugin.hideSubmenuDropdown(item, true);
    };

    /**
     * Hide dropdowns
     * @returns {Object}
     */
    the.hideDropdowns = function() {
        Plugin.hideSubmenuDropdowns();
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.pauseDropdownHover = function(time) {
        Plugin.pauseDropdownHover(time);
    };

    /**
     * Disable menu for given time
     * @returns {Object}
     */
    the.resumeDropdownHover = function() {
        return Plugin.resumeDropdownHover();
    };

    /**
     * Register event
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    the.off = function(name) {
        return Plugin.removeEvent(name);
    };

    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Handle plugin on window resize
    KTUtil.addResizeHandler(function() {
        if (init) {
            the.reload();
        }
    });

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTMenu;
}

// Plugin global lazy initialization
document.addEventListener("click", function (e) {
    var body = KTUtil.getByTagName('body')[0];
    var query;
    if ( query = body.querySelectorAll('.menu-nav .menu-item.menu-item-submenu.menu-item-hover:not(.menu-item-tabs)[data-menu-toggle="click"]') ) {
        for (var i = 0, len = query.length; i < len; i++) {
            var element = query[i].closest('.menu-nav').parentNode;

            if ( element ) {
                var the = KTUtil.data(element).get('menu');

                if ( !the ) {
                    break;
                }

                if ( !the || the.getSubmenuMode() !== 'dropdown' ) {
                    break;
                }

                if ( e.target !== element && element.contains(e.target) === false ) {
                    the.hideDropdowns();
                }
            }
        }
    }
});

"use strict";

// Component Definition
var KTOffcanvas = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        customClass: ''
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        construct: function(options) {
            if (KTUtil.data(element).has('offcanvas')) {
                the = KTUtil.data(element).get('offcanvas');
            } else {
                // Reset offcanvas
                Plugin.init(options);

                // Build offcanvas
                Plugin.build();

                KTUtil.data(element).set('offcanvas', the);
            }

            return the;
        },

        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);

            the.classBase = the.options.baseClass;
            the.classCustom = the.options.customClass;
            the.classShown = the.classBase + '-on';
            the.classOverlay = the.classBase + '-overlay';
            the.target;

            the.state = KTUtil.hasClass(element, the.classShown) ? 'shown' : 'hidden';
        },

        build: function() {
            // offcanvas toggle
            if (the.options.toggleBy) {
                if (typeof the.options.toggleBy === 'string') {
                    KTUtil.addEvent(KTUtil.getById(the.options.toggleBy), 'click', function(e) {
                        e.preventDefault();
                        the.target = this;
                        Plugin.toggle();
                    });
                } else if (the.options.toggleBy && the.options.toggleBy[0]) {
                    if (the.options.toggleBy[0].target) {
                        for (var i in the.options.toggleBy) {
                            KTUtil.addEvent(KTUtil.getById(the.options.toggleBy[i].target), 'click', function(e) {
                                e.preventDefault();
                                the.target = this;
                                Plugin.toggle();
                            });
                        }
                    } else {
                        for (var i in the.options.toggleBy) {
                            KTUtil.addEvent(KTUtil.getById(the.options.toggleBy[i]), 'click', function(e) {
                                e.preventDefault();
                                the.target = this;
                                Plugin.toggle();
                            });
                        }
                    }

                } else if (the.options.toggleBy && the.options.toggleBy.target) {
                    KTUtil.addEvent( KTUtil.getById(the.options.toggleBy.target), 'click', function(e) {
                        e.preventDefault();
                        the.target = this;
                        Plugin.toggle();
                    });
                }
            }

            // offcanvas close
            var closeBy = KTUtil.getById(the.options.closeBy);
            if (closeBy) {
                KTUtil.addEvent(closeBy, 'click', function(e) {
                    e.preventDefault();
                    the.target = this;
                    Plugin.hide();
                });
            }
        },

        isShown: function() {
            return (the.state == 'shown' ? true : false);
        },

        toggle: function() {;
            Plugin.eventTrigger('toggle');

            if (the.state == 'shown') {
                Plugin.hide();
            } else {
                Plugin.show();
            }
        },

        show: function() {
            if (the.state == 'shown') {
                return;
            }

            Plugin.eventTrigger('beforeShow');

            Plugin.toggleClass('show');

            // Offcanvas panel
            KTUtil.addClass(body, the.classShown);
            KTUtil.addClass(element, the.classShown);

            if (the.classCustom.length > 0) {
                KTUtil.addClass(body, the.classCustom);
            }

            the.state = 'shown';

            if (the.options.overlay) {
                the.overlay = KTUtil.insertAfter(document.createElement('DIV') , element );
                KTUtil.addClass(the.overlay, the.classOverlay);

                KTUtil.addEvent(the.overlay, 'click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    Plugin.hide(the.target);
                });
            }

            Plugin.eventTrigger('afterShow');
        },

        hide: function() {
            if (the.state == 'hidden') {
                return;
            }

            Plugin.eventTrigger('beforeHide');

            Plugin.toggleClass('hide');

            KTUtil.removeClass(body, the.classShown);
            KTUtil.addClass(body, the.classPush);
            KTUtil.removeClass(element, the.classShown);

            if (the.classCustom.length > 0) {
                KTUtil.removeClass(body, the.classCustom);
            }

            the.state = 'hidden';

            if (the.options.overlay && the.overlay) {
                KTUtil.remove(the.overlay);
            }

            Plugin.eventTrigger('afterHide');
        },

        toggleClass: function(mode) {
            var id = KTUtil.attr(the.target, 'id');
            var toggleBy;

            if (the.options.toggleBy && the.options.toggleBy[0] && the.options.toggleBy[0].target) {
                for (var i in the.options.toggleBy) {
                    if (the.options.toggleBy[i].target === id) {
                        toggleBy = the.options.toggleBy[i];
                    }
                }
            } else if (the.options.toggleBy && the.options.toggleBy.target) {
                toggleBy = the.options.toggleBy;
            }

            if (toggleBy) {
                var el = KTUtil.getById(toggleBy.target);

                if (mode === 'show') {
                    KTUtil.addClass(el, toggleBy.state);
                }

                if (mode === 'hide') {
                    KTUtil.removeClass(el, toggleBy.state);
                }
            }
        },

        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                        return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     * @param options
     */
    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Check if canvas is shown
     * @returns {boolean}
     */
    the.isShown = function() {
        return Plugin.isShown();
    };

    /**
     * Set to hide the canvas
     */
    the.hide = function() {
        return Plugin.hide();
    };

    /**
     * Set to show the canvas
     */
    the.show = function() {
        return Plugin.show();
    };

    /**
     * Attach event
     * @param name
     * @param handler
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @param name
     * @param handler
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTOffcanvas;
}

"use strict";

// Component Definition
var KTScrolltop = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);
    var body = KTUtil.getBody();

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 6000
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Run plugin
         * @returns {mscrolltop}
         */
        construct: function(options) {
            if (KTUtil.data(element).has('scrolltop')) {
                the = KTUtil.data(element).get('scrolltop');
            } else {
                // reset scrolltop
                Plugin.init(options);

                // build scrolltop
                Plugin.build();

                KTUtil.data(element).set('scrolltop', the);
            }

            return the;
        },

        /**
         * Handles subscrolltop click toggle
         * @returns {mscrolltop}
         */
        init: function(options) {
            the.events = [];

            // merge default and user defined options
            the.options = KTUtil.deepExtend({}, defaultOptions, options);
        },

        build: function() {
            var timer;

            window.addEventListener('scroll', function() {
                KTUtil.throttle(timer, function() {
                    Plugin.handle();
                }, 200);
            });

            // handle button click
            KTUtil.addEvent(element, 'click', Plugin.scroll);
        },

        /**
         * Handles scrolltop click scrollTop
         */
        handle: function() {
            var pos = KTUtil.getScrollTop(); // current vertical position

            if (pos > the.options.offset) {
                if (body.hasAttribute('data-scrolltop') === false) {
                    body.setAttribute('data-scrolltop', 'on');
                }
            } else {
                if (body.hasAttribute('data-scrolltop') === true) {
                    body.removeAttribute('data-scrolltop');
                }
            }
        },

        /**
         * Handles scrolltop click scrollTop
         */
        scroll: function(e) {
            e.preventDefault();

            KTUtil.scrollTop(0, the.options.speed);
        },


        /**
         * Trigger events
         */
        eventTrigger: function(name, args) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];
                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the, args);
                        }
                    } else {
                       return event.handler.call(this, the, args);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get subscrolltop mode
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Set scrolltop content
     * @returns {mscrolltop}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    ///////////////////////////////
    // ** Plugin Construction ** //
    ///////////////////////////////

    // Run plugin
    Plugin.construct.apply(the, [options]);

    // Init done
    init = true;

    // Return plugin instance
    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTScrolltop;
}

"use strict";

// Component Definition 
var KTToggle = function(elementId, options) {
    // Main object
    var the = this;
    var init = false;

    // Get element object
    var element = KTUtil.getById(elementId);

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var Plugin = {
        /**
         * Construct
         */

        construct: function(options) {
            if (KTUtil.data(element).has('toggle')) {
                the = KTUtil.data(element).get('toggle');
            } else {
                // reset menu
                Plugin.init(options);

                // build menu
                Plugin.build();

                KTUtil.data(element).set('toggle', the);
            }

            return the;
        },

        /**
         * Handles subtoggle click toggle
         */
        init: function(options) {
            the.element = element;
            the.events = [];

            // options
            the.options = options;

            //alert(the.options.target.tagName);
            the.target = KTUtil.getById(the.options.target);

            the.targetState = the.options.targetState;
            the.toggleState = the.options.toggleState;

            the.state = KTUtil.hasClasses(the.target, the.targetState) ? 'on' : 'off';
        },

        /**
         * Setup toggle
         */
        build: function() {
            KTUtil.addEvent(element, 'mouseup', Plugin.toggle);
        },

        /**
         * Handles offcanvas click toggle
         */
        toggle: function(e) {
            Plugin.eventTrigger('beforeToggle');

            if (the.state == 'off') {
                Plugin.toggleOn();
            } else {
                Plugin.toggleOff();
            }

            Plugin.eventTrigger('afterToggle');

            e.preventDefault();

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOn: function() {
            Plugin.eventTrigger('beforeOn');

            KTUtil.addClass(the.target, the.targetState);

            if (the.toggleState) {
                KTUtil.addClass(element, the.toggleState);
            }

            the.state = 'on';

            Plugin.eventTrigger('afterOn');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Handles toggle click toggle
         */
        toggleOff: function() {
            Plugin.eventTrigger('beforeOff');

            KTUtil.removeClass(the.target, the.targetState);

            if (the.toggleState) {
                KTUtil.removeClass(element, the.toggleState);
            }

            the.state = 'off';

            Plugin.eventTrigger('afterOff');

            Plugin.eventTrigger('toggle');

            return the;
        },

        /**
         * Trigger events
         */
        eventTrigger: function(name) {
            for (var i = 0; i < the.events.length; i++) {
                var event = the.events[i];

                if (event.name == name) {
                    if (event.one == true) {
                        if (event.fired == false) {
                            the.events[i].fired = true;
                            return event.handler.call(this, the);
                        }
                    } else {
                        return event.handler.call(this, the);
                    }
                }
            }
        },

        addEvent: function(name, handler, one) {
            the.events.push({
                name: name,
                handler: handler,
                one: one,
                fired: false
            });

            return the;
        }
    };

    //////////////////////////
    // ** Public Methods ** //
    //////////////////////////

    /**
     * Set default options
     */

    the.setDefaults = function(options) {
        defaultOptions = options;
    };

    /**
     * Get toggle state
     */
    the.getState = function() {
        return the.state;
    };

    /**
     * Toggle
     */
    the.toggle = function() {
        return Plugin.toggle();
    };

    /**
     * Toggle on
     */
    the.toggleOn = function() {
        return Plugin.toggleOn();
    };

    /**
     * Toggle off
     */
    the.toggleOff = function() {
        return Plugin.toggleOff();
    };

    /**
     * Attach event
     * @returns {KTToggle}
     */
    the.on = function(name, handler) {
        return Plugin.addEvent(name, handler);
    };

    /**
     * Attach event that will be fired once
     * @returns {KTToggle}
     */
    the.one = function(name, handler) {
        return Plugin.addEvent(name, handler, true);
    };

    // Construct plugin
    Plugin.construct.apply(the, [options]);

    return the;
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTToggle;
}

"use strict";

/**
 * @class KTUtil  base utilize class that privides helper functions
 */

// Polyfills
/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	Element.prototype.closest = function (s) {
		var el = this;
		var ancestor = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (ancestor.matches(s)) return ancestor;
			ancestor = ancestor.parentElement;
		} while (ancestor !== null);
		return null;
	};
}

/**
 * ChildNode.remove() polyfill
 * https://gomakethings.com/removing-an-element-from-the-dom-the-es6-way/
 * @author Chris Ferdinandi
 * @license MIT
 */
(function (elem) {
	for (var i = 0; i < elem.length; i++) {
		if (!window[elem[i]] || 'remove' in window[elem[i]].prototype) continue;
		window[elem[i]].prototype.remove = function () {
			this.parentNode.removeChild(this);
		};
	}
})(['Element', 'CharacterData', 'DocumentType']);

//
// requestAnimationFrame polyfill by Erik Möller.
//  With fixes from Paul Irish and Tino Zijdel
//
//  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//
//  MIT license
//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// Global variables
window.KTUtilElementDataStore = {};
window.KTUtilElementDataStoreID = 0;
window.KTUtilDelegatedEventHandlers = {};

var KTUtil = function() {
    var resizeHandlers = [];

    /** @type {object} breakpoints The device width breakpoints **/
    var breakpoints = {
        sm: 544, // Small screen / phone
        md: 768, // Medium screen / tablet
        lg: 992, // Large screen / desktop
        xl: 1200 // Extra large screen / wide desktop
    };

    /**
     * Handle window resize event with some
     * delay to attach event handlers upon resize complete
     */
    var _windowResizeHandler = function() {
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timer;

        window.addEventListener('resize', function() {
            KTUtil.throttle(timer, function() {
                _runResizeHandlers();
            }, 200);
        });
    };

    return {
        /**
         * Class main initializer.
         * @param {object} settings.
         * @returns null
         */
        //main function to initiate the theme
        init: function(settings) {
            if (settings && settings.breakpoints) {
                breakpoints = settings.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * Adds window resize event handler.
         * @param {function} callback function.
         */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
         * Removes window resize event handler.
         * @param {function} callback function.
         */
        removeResizeHandler: function(callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * Trigger window resize handlers.
         */
        runResizeHandlers: function() {
            this._runResizeHandlers();
        },

        resize: function() {
            if (typeof(Event) === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
            } else {
                // for IE and other old browsers
                // causes deprecation warning on modern browsers
                var evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        },

        /**
         * Get GET parameter value from URL.
         * @param {string} paramName Parameter name.
         * @returns {string}
         */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * Checks whether current device is mobile touch.
         * @returns {boolean}
         */
        isMobileDevice: function() {
            return (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);
        },

        /**
         * Checks whether current device is desktop.
         * @returns {boolean}
         */
        isDesktopDevice: function() {
            return KTUtil.isMobileDevice() ? false : true;
        },

        /**
         * Gets browser window viewport size. Ref:
         * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
         * @returns {object}
         */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode == 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            }

            return false;
        },

		/**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isBreakpointUp: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width >= breakpoint);
        },

		isBreakpointDown: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width < breakpoint);
        },


        /**
         * Generates unique ID for give prefix.
         * @param {string} prefix Prefix for generated ID
         * @returns {boolean}
         */
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * Gets window width for give breakpoint mode.
         * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
         * @returns {number}
         */
        getBreakpoint: function(mode) {
            return breakpoints[mode];
        },

        /**
         * Checks whether object has property matchs given key path.
         * @param {object} obj Object contains values paired with given key path
         * @param {string} keys Keys path seperated with dots
         * @returns {object}
         */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * Gets highest z-index of the given element parents
         * @param {object} el jQuery element object
         * @returns {number}
         */
        getHighestZindex: function(el) {
            var position, value;

            while (el && el !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = KTUtil.css(el, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(KTUtil.css(el, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                el = el.parentNode;
            }

            return null;
        },

        /**
         * Checks whether the element has any parent with fixed positionfreg
         * @param {object} el jQuery element object
         * @returns {boolean}
         */
        hasFixedPositionedParent: function(el) {
            var position;

            while (el && el !== document) {
                position = KTUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * Simulates delay
         */
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * Gets randomly generated integer value within given min and max range
         * @param {number} min Range start value
         * @param {number} max Range end value
         * @returns {number}
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Checks whether Angular library is included
         * @returns {boolean}
         */
        isAngularVersion: function() {
            return window.Zone !== undefined ? true : false;
        },

        // jQuery Workarounds

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB);
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        getById: function(el) {
            if (typeof el === 'string') {
                return document.getElementById(el);
            } else {
                return el;
            }
        },

        getByTag: function(query) {
            return document.getElementsByTagName(query);
        },

        getByTagName: function(query) {
            return document.getElementsByTagName(query);
        },

        getByClass: function(query) {
            return document.getElementsByClassName(query);
        },

        getBody: function() {
            return document.getElementsByTagName('body')[0];
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}
         */
        hasClasses: function(el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function(el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function(el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className += ' ' + KTUtil.trim(classNames[x]);
                }
            }
        },

        removeClass: function(el, className) {
          if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[x]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function(el, eventName, data) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function( el ){
            var c = el.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == el ) return i;
        },

        trim: function(string) {
            return string.trim();
        },

        eventTriggered: function(e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function(parent, query) {
            parent = KTUtil.getById(parent);
            if (parent) {
                return parent.querySelector(query);
            }
        },

        findAll: function(parent, query) {
            parent = KTUtil.getById(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            }
        },

        insertAfter: function(el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function(elem, selector) {
            // Element.matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                    Element.prototype.matchesSelector ||
                    Element.prototype.mozMatchesSelector ||
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.oMatchesSelector ||
                    Element.prototype.webkitMatchesSelector ||
                    function(s) {
                        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                            i = matches.length;
                        while (--i >= 0 && matches.item(i) !== this) {}
                        return i > -1;
                    };
            }

            // Set up a parent array
            var parents = [];

            // Push each parent element to the array
            for ( ; elem && elem !== document; elem = elem.parentNode ) {
                if (selector) {
                    if (elem.matches(selector)) {
                        parents.push(elem);
                    }
                    continue;
                }
                parents.push(elem);
            }

            // Return our parent array
            return parents;
        },

        children: function(el, selector, log) {
            if (!el || !el.childNodes) {
                return;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && KTUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function(el, selector, log) {
            var children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function(el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function(el) {
            return {
                set: function(name, data) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        window.KTUtilElementDataStoreID++;
                        el.customDataTag = window.KTUtilElementDataStoreID;
                    }

                    if (window.KTUtilElementDataStore[el.customDataTag] === undefined) {
                        window.KTUtilElementDataStore[el.customDataTag] = {};
                    }

                    window.KTUtilElementDataStore[el.customDataTag][name] = data;
                },

                get: function(name) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        return null;
                    }

                    return this.has(name) ? window.KTUtilElementDataStore[el.customDataTag][name] : null;
                },

                has: function(name) {
                    if (!el) {
                        return false;
                    }

                    if (el.customDataTag === undefined) {
                        return false;
                    }

                    return (window.KTUtilElementDataStore[el.customDataTag] && window.KTUtilElementDataStore[el.customDataTag][name]) ? true : false;
                },

                remove: function(name) {
                    if (el && this.has(name)) {
                        delete window.KTUtilElementDataStore[el.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function(el, margin) {
            var width;

            if (margin === true) {
                width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function(el) {
            var rect, win;

            if ( !el ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if ( !el.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = el.getBoundingClientRect();
            win = el.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function(el) {
            return KTUtil.css(el, 'height');
        },

        visible: function(el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function(el, name, value) {
            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function(el, prop, cache) {
            var css = '';

            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function(el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function(el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function(element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                window.self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function(el, styleProp, value) {
            if (!el) {
                return;
            }

            if (value !== undefined) {
                el.style[styleProp] = value;
            } else {
                var defaultView = (el.ownerDocument || document).defaultView;
                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function(value) {
                            var oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value;
                        })(value);
                    }
                    return value;
                }
            }
        },

        slide: function(el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = KTUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = 'none';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {//
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = value + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        },

        slideUp: function(el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function(el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function(el, display) {
            if (typeof el !== 'undefined') {
                el.style.display = (display ? display : 'block');
            }
        },

        hide: function(el) {
            if (typeof el !== 'undefined') {
                el.style.display = 'none';
            }
        },

        addEvent: function(el, type, handler, one) {
            if (typeof el !== 'undefined' && el !== null) {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function(el, type, handler) {
            if (el !== null) {
                el.removeEventListener(type, handler);
            }
        },

        on: function(element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = KTUtil.getUniqueID('event');

            window.KTUtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while (target && target !== element) {
                    for (var i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !window.KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            delete window.KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);
                }

                // need to verify from https://themeforest.net/author_dashboard#comment_23615588
                if (el && el.removeEventListener) {
				    e.currentTarget.removeEventListener(e.type, callee);
			    }

                // call handler
                return callback(e);
            });
        },

        hash: function(str) {
            var hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function(el, animationName, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.addClass(el, 'animated ' + animationName);

            KTUtil.one(el, animation, function() {
                KTUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function(el, callback) {
            var transition;
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function(el, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (offset) {
                scrollPos += offset;
            }

            from = scrollPos;
            to = targetPos;

            KTUtil.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function(offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function(obj) {
            return obj && Array.isArray(obj);
        },

        ready: function(callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // Edge 12 (Spartan)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge 13
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        isRTL: function() {
            var html = KTUtil.getByTagName('html')[0];

            if (html) {
                return (KTUtil.attr(html, 'direction') == 'rtl');
            }
        },

        // Scroller
        scrollInit: function(element, options) {
            if(!element) return;
            // Define init function
            function init() {
                var ps;
                var height;

                if (options.height instanceof Function) {
                    height = options.height.call();
                } else {
                    height = options.height;
                }

                if (height === false) {
                    KTUtil.scrollDestroy(element, true);

                    return;
                }

                height = parseInt(height);

                // Destroy scroll on table and mobile modes
                if ((options.mobileNativeScroll || options.disableForMobile) && KTUtil.isBreakpointDown('lg')) {
                    ps = KTUtil.data(element).get('ps');
                    if (ps) {
                        if (options.resetHeightOnDestroy) {
                            KTUtil.css(element, 'height', 'auto');
                        } else {
                            KTUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                KTUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = KTUtil.data(element).remove('ps');
                    } else if (height > 0){
                        KTUtil.css(element, 'overflow', 'auto');
                        KTUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    KTUtil.css(element, 'height', height + 'px');
                }

                if (options.desktopNativeScroll) {
                    KTUtil.css(element, 'overflow', 'auto');
                    return;
                }

                // Pass options via HTML Attributes
                if (KTUtil.attr(element, 'data-window-scroll') == 'true') {
                     options.windowScroll = true;
                }

                // Init scroll
                ps = KTUtil.data(element).get('ps');

                if (ps) {
                    ps.update();
                } else {
                    KTUtil.css(element, 'overflow', 'hidden');
                    KTUtil.addClass(element, 'scroll');

                    ps = new PerfectScrollbar(element, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        wheelPropagation: (options.windowScroll === false ? false : true),
                        minScrollbarLength: 40,
                        maxScrollbarLength: 300,
                        suppressScrollX: KTUtil.attr(element, 'data-scroll-x') != 'true' ? true : false
                    });

                    KTUtil.data(element).set('ps', ps);
                }

                // Remember scroll position in cookie
                var uid = KTUtil.attr(element, 'id');
                // Consider using Localstorage
                //if (options.rememberPosition === true && Cookies && uid) {
                //    if (KTCookie.getCookie(uid)) {
                //        var pos = parseInt(KTCookie.getCookie(uid));
                //
                //        if (pos > 0) {
                //            element.scrollTop = pos;
                //        }
                //    }
                //
                //    element.addEventListener('ps-scroll-y', function() {
                //        KTCookie.setCookie(uid, element.scrollTop);
                //    });
                //}
            }

            // Init
            init();

            // Handle window resize
            if (options.handleWindowResize) {
                KTUtil.addResizeHandler(function() {
                    init();
                });
            }
        },

        scrollUpdate: function(element) {
            var ps = KTUtil.data(element).get('ps');
            if (ps) {
                ps.update();
            }
        },

        scrollUpdateAll: function(parent) {
            var scrollers = KTUtil.findAll(parent, '.ps');
            for (var i = 0, len = scrollers.length; i < len; i++) {
                KTUtil.scrollUpdate(scrollers[i]);
            }
        },

        scrollDestroy: function(element, resetAll) {
            var ps = KTUtil.data(element).get('ps');

            if (ps) {
                ps.destroy();
                ps = KTUtil.data(element).remove('ps');
            }

            if (element && resetAll) {
                element.style.setProperty('overflow', '');
                element.style.setProperty('height', '');
            }
        },

        setHTML: function(el, html) {
            el.innerHTML = html;
        },

        getHTML: function(el) {
            if (el) {
                return el.innerHTML;
            }
        },

        getDocumentHeight: function() {
            var body = document.body;
            var html = document.documentElement;

            return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        },

        getScrollTop: function() {
            return  (document.scrollingElement || document.documentElement).scrollTop;
        },

        colorDarken: function(color, amount) {
            var subtractLight = function(color, amount){
                var cc = parseInt(color,16) - amount;
                var c = (cc < 0) ? 0 : (cc);
                c = (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;

                return c;
            }

            color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
            amount = parseInt((255*amount)/100);

            return color = `#${subtractLight(color.substring(0,2), amount)}${subtractLight(color.substring(2,4), amount)}${subtractLight(color.substring(4,6), amount)}`;
        },

        colorLighten: function(color, amount) {
            var addLight = function(color, amount){
                var cc = parseInt(color,16) + amount;
                var c = (cc > 255) ? 255 : (cc);
                c = (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;

                return c;
            }

            color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
            amount = parseInt((255*amount)/100);

            return color = `#${addLight(color.substring(0,2), amount)}${addLight(color.substring(2,4), amount)}${addLight(color.substring(4,6), amount)}`;
        },

        // Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
        throttle:  function (timer, func, delay) {
        	// If setTimeout is already scheduled, no need to do anything
        	if (timer) {
        		return;
        	}

        	// Schedule a setTimeout after delay seconds
        	timer  =  setTimeout(function () {
        		func();

        		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
        		// the next scroll event function execution can be scheduled by the setTimeout
        		timer  =  undefined;
        	}, delay);
        },

        // Debounce function: Input as function which needs to be debounced and delay is the debounced time in milliseconds
        debounce: function (timer, func, delay) {
        	// Cancels the setTimeout method execution
        	clearTimeout(timer)

        	// Executes the func after delay time.
        	timer  =  setTimeout(func, delay);
        }
    }
}();

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTUtil;
}

// Initialize KTUtil class on document ready
KTUtil.ready(function() {
	if (typeof KTAppSettings !== 'undefined') {
		KTUtil.init(KTAppSettings);
	} else {
		KTUtil.init();
	}
});

// CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
window.onload = function() {
    var result = KTUtil.getByTagName('body');
    if (result && result[0]) {
        KTUtil.removeClass(result[0], 'page-loading');
    }
}
