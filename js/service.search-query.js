(function() {
	
	var __func__ = 'SearchQuery';
	
	var xhr = false;
	
	var queries = {};
	
	
	var construct = function(str, callback) {
		
		/**
		* private:
		**/
		var value = false;
		
		var testLocation = new Location(str);
		if(testLocation.resolved) {
			value = testLocation;
		}
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			callback: function() {
				if(value) {
					callback.apply(callback, [value]);
				}
			},
		});
		
		if(value) {
			operator.callback();
		}
		else {
			if(xhr) {
				xhr.cancel();
			}
			xhr = Download.json('/service/search/'+str,
				function(json) {
					xhr = false;
					callback.apply(callback, [json]);
				}
			);
		}
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(str) {
		
		// if this search was made already, or is cached
		if(queries[str]) {
			instance = queries[str];
			instance.callback();
		}
		else {
			instance = construct.apply(this, arguments);
			queries[str] = instance;
		}
		return instance;
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