/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	var __func__ = 'WidgetMenu';
	var lastInstance;
	var instanceMap = {};
	var construct = function(obj) {
		
		
		var my = {
			dom: false,
		};
		
		
		var self = {
			
			// set up the initial dom
			create: function() {
				/**
				'<div class="">'
				+'</div>';
				**/
			},
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
		});
		
		
		// obtain the dom element given by the query selector
		if(obj.$) {
			var query = dojo.query(obj.$);
			if(query.length) {
				if(query.length !== 1) {
					global.warn('selector "',obj.$,'" returned more than one element');
				}
				my.dom = query[0];
			}
			else {
				global.error('selector "',obj.$,'" returned empty result');
			}
		}
		
		
		// if this instance was created with a reference name
		if(obj.reference) {
			// assign it to the associative array
			instanceMap[obj.reference] = public;
		}
		
		
		// if the dom was never initialized
		if(!my.dom) {
			return global.error('element needed to initialize');
		}
		
		self.create();
		
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			lastInstance = instance;
			return instance;
		}
		else {
			if(key) {
				if(typeof instanceMap[key] !== 'undefined') {
					return instanceMap[key];
				}
			}
			else {
				return lastInstance;
			}
		}
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		error: function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		warn: function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
	});
})();

EsriMap.ready(function() {
	new WidgetMenu({
		$: '#widget_menu',
		reference: 'default',
	});
});






