(function() {
	var __func__ = 'WidgetMenu';
	var lastInstance;
	var instanceMap = {};
	var construct = function(obj) {
		var self = {
			
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
				self.dom = query[0];
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




(function() {
	
	
	var __func__ = 'CustomLayer';
	
	
	
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
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		//
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
	});
})();