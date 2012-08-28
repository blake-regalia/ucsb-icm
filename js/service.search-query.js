(function() {
	
	var __func__ = 'SearchQuery';
	
	var xhr = false;
	
	var queries = {};
	
	
	var construct = function(str, callback) {
		
		/**
		* private:
		**/
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var public = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
		});
		
		if(xhr) {
			xhr.cancel();
		}
		xhr = Download.json('/service/search/'+query,
			function(json) {
				xhr = false;
				callback.apply(callback, [json]);
			}
		);
		
		return public;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(str) {
		// if this search was made already, or is cached
		if(queries[str]) {
			return queries[str];
		}
		instance = construct.apply(this, arguments);
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