/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

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
		var operator = function() {
			return contact;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: contact.fullName+', '+contact.middleName,
			
			// convenience field for this user's first and last name concat'd
			fullName: contact.firstName+' '+contact.lastName,
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
		
		
		//
		newCard: function(format, addtl) {
			return function(str) {
				Download.json("data/ucsb/directory.people@(["+format+"]='"+str+"')"+(addtl?addtl:'')+".json", 
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