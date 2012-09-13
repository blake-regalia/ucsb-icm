/**


var d = new DynamicArray();

var plus1 = {
    sum: 1,
};

var addToBlake = d('blake').add;

addToBlake(plus1);
addToBlake(plus1);
addToBlake(plus1);

d.array();



**/
(function() {
	
	var __func__ = 'DynamicArray';
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var array = {};
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		var noop = function() {};
		
		
		var chain = function(node) {
			
			var op = function(key) {
				
				// if no argument was given
				if(arguments.length === 0) {
					// user is trying to add items to a list
					var nl = node.length | 0;
					if(!nl) node.length = 0;
					node[node.length++] = {};
					return chain(node[nl]);
				}
				else {
					// if the given index does not exist
					if(!node[key]) {
						// create it
						node[key] = {};
					}
					return chain(node[key]);
				}
			};
			
			$.extend(op, {
				
				add: function(obj) {
					for(var e in obj) {
						// if the given index doesn't exist
						if(!node[e]) {
							// create it & intialize to zero
							node[e] = 0;
						}
						// increment the value by the given number
						node[e] += parseFloat(obj[e]);
					}
				},
				
				each: function(fn) {
					
					// iterate over every item
					for(var e in node) {
						
						// execute callback on each item
						r = fn.apply(node[e], [e, node[e]]);
						
						// if the user wants to break out of the loop
						if(r === false) break;
					}
				},
				gets: function() {},
				
				// just return the actual object array
				array: function() {
					return node;
				},
			});
			
			return op;
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = chain(array);
		
		/**
		* public:
		**/
		$.extend(operator, {
			
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
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