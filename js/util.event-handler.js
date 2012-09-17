/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	
	var __func__ = 'EventHandler';
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var eventType = {};
		
		/**
		* public operator() ();
		**/
		var operator = function(eventName, fn) {
			
			// reference the event handler and assume it is defined
			var handlerList = eventType[eventName];
			
			// if it is not defined, assign it an empty array
			if(!handlerList) handlerList = eventType[eventName] = [];
			
			// if only the eventName was given
			if(arguments.length === 1) {
				// return a callback function handler
				return function() {
					var len = handlerList.length-1, i = -1;
					while(i++ != len) {
						handlerList[i].apply(this, arguments);
					}
					handlerList.length = 0;
				};
			}
			
			// else a callback function was given, prepend it to the handler lsit
			handlerList.push(fn);
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			unbind: function(eventName, fn) {
				var handlerList = eventType[eventName];
				if(!handlerList) return;
				
				var i = handlerList.length;
				if(fn) {
					var i = handlerList.indexOf(fn);
					handlerList.splice(i, 1);
				}
				else {
					handlerList.length = 0;
				}
				return;
			},
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
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