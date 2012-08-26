(function() {
	
	var __func__ = 'Contact';
	
	
	
	var construct = function(contact) {
		
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
			return contact;
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
			// standard identifier
			id: contact.firstName+' '+contact.lastName,
			
			// convenience field for this user's full name
			fullName: contact.firstName+' '+contact.lastName,
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
		
		
		//
		newCard: function(format) {
			return function(str) {
				Download.json("data/ucsb/directory.people@(["+format+"]='"+str+"').json", 
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var contact = new Contact(json[0]);
						new ContactCard(contact);
					}
				);
			};
		},
		
	});
})();