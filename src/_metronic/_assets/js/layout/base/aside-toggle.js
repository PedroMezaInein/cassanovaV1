/* eslint-disable */
"use strict";

import KTToggle from "./../../components/toggle.js";
import { KTUtil } from "./../../components/util.js";
import KTLayoutStickyCard from "./sticky-card.js";
import KTLayoutHeaderMenu from "./header-menu.js";
import KTLayoutAsideMenu from "./aside-menu.js";
import { KTCookie } from "./../../components/cookie.js";

var KTLayoutAsideToggle = function() {
    // Private properties
    var _body;
    var _element;
    var _toggleObject;

	// Initialize
	var _init = function() {
		_toggleObject = new KTToggle(_element, {
			target: _body,
			targetState: 'aside-minimize',
			toggleState: 'active'
		});

		_toggleObject.on('toggle', function(toggle) {
			KTUtil.addClass(_body, 'aside-minimizing');
            KTUtil.transitionEnd(_body, function() {
                KTUtil.removeClass(_body, 'aside-minimizing');
			});

            // Update sticky card
            KTLayoutStickyCard.update();

            // Pause header menu dropdowns
            KTLayoutHeaderMenu.pauseDropdownHover(800);

            // Pause aside menu dropdowns
			KTLayoutAsideMenu.pauseDropdownHover(800);

            // Remember state in cookie
			KTCookie.setCookie('kt_aside_toggle_state', toggle.getState());
			// to set default minimized left aside use this cookie value in your
			// server side code and add "kt-primary--minimize aside-minimize" classes to
			// the body tag in order to initialize the minimized left aside mode during page loading.
		});

		_toggleObject.on('beforeToggle', function(toggle) {
			if (KTUtil.hasClass(_body, 'aside-minimize') === false && KTUtil.hasClass(_body, 'aside-minimize-hover')) {
				KTUtil.removeClass(_body, 'aside-minimize-hover');
			}
		});
	}

    // Public methods
	return {
		init: function(id) {
            _element = KTUtil.getById(id);
            _body = KTUtil.getBody();

            if (!_element) {
                return;
            }

            // Initialize
            _init();
		},

        getElement: function() {
            return _element;
        },

        getToggle: function() {
			return _toggleObject;
		},

		onToggle: function(handler) {
			if (typeof _toggleObject.element !== 'undefined') {
				_toggleObject.on('toggle', handler);
			}
		}
	};
}();

// Webpack support
if (typeof module !== 'undefined') {
	// module.exports = KTLayoutAsideToggle;
}

export default KTLayoutAsideToggle;