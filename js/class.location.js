(function() {
	
	var __func__ = 'Location';
	
	
	
	var construct = function(str) {
		
		/**
		* private:
		**/
		var resolved = true;
		
		var bid;
		var bnm;
		var rmn;
		
		(function() {
			var x;
			
			// eg: 563 1710A
			if((x=/^(\d+)\s+(\d\w+)$/.exec(str)) !== null) {
				bid = x[1];
				rmn = x[2];
			}
			// eg: Ellison 1710A
			else if((x=/^(\w+)\s+(\d\w+)$/.exec(str)) !== null) {
				bnm = x[1];
				rmn = x[2];
			}
			// eg: 1710A Ellison
			else if((x=/^(\d\w+)\s+(\w+)$/.exec(str)) !== null) {
				rmn = x[1];
				bnm = x[2];
			}
			
			// resolve targets
			if(bnm) {
				var bid = Building.nameToId(bnm);
				if(!bid) {
					global.warn('could not resolve building "',bnm,'"');
					resolved = false;
				}
			}
			else {
				bnm = Building.idToName(bid);
				if(!bnm) {
					global.warn('could not resolved building id: ',bid);
					resolved = false;
				}
			}
			
		})();
		
		
		if(rmn) {
			// lookup room
		}
		else if(bid) {
			// lookup building
		}
		
		
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
			
			resolved: resolved,
			
			toString: function() {
				return 
			},
		});
		
		
		return public;
		
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