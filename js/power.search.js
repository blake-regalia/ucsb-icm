/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	var __func__ = 'PowerSearch';
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		}
	});
})();


EsriMap.ready(function() {
	setTimeout(function() {
		var a = dojo.query('.widget-menu-icon');
		var i=a.length;
		while(i--) {
			dojo.connect(a[i], 'mouseover', function() {
				dojo.query('.widget-menu-icon-hover',this).style({ display:"block" }); 
			});
			dojo.connect(a[i], 'mouseout', function() {
				dojo.query('.widget-menu-icon-hover',this).style({ display:"none" });
			});
		}
		
		setTimeout(function() {
			dojo.query('#map_zoom_slider').style({left: '200px'});
		}, 1200);
	}, 1000);
});