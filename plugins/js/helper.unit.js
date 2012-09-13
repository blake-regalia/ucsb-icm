(function() {
	
	var __func__ = 'Unit';
	
	
	var UnitArray = {
		currency: {
			dollars: function(qty) {
				var d  = (qty+'').split('.')[0].split('');
				var b = '';
				for(var i=d.length-4; i>=0; i-=3) {
					d[i] += ',';
				}
				return '$'+d.join('');
			},
		},
	};
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(target, unit) {
		var names = unit.split('.');
		var len = names.length, i = -1;
		
		var node = UnitArray;
		while(++i !== len) {
			node = node[names[i]];
		}
		
		return node(target);
	};
	
	
	
	/**
	* public static:
	**/
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