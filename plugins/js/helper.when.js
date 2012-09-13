/**

When(obj).isReady(fn);

obj.bind('ready', fn);


eventHandler = new EventHandler();

operator.bind = function(trigger, fn) {
	eventHandler(trigger, fn);
}

eventHandler('ready');




**/
(function() {
	
	var __func__ = 'When';
	
	
	var isOkay = function(obj) {
		return (!!obj.bind);
	};
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(obj) {
		return {
			
			isReady: function(fn) {
				return isOkay(obj) && obj.bind('ready', fn);
			},
			
			
			isDone: function(fn) {
				return isOkay(obj) && obj.bind('done', fn);
			},
		};
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