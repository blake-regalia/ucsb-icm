/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

/**
*
* public class Department
*
**/
(function() {
	
	var __func__ = 'Department';
	
	
	var construct = function(department) {
		
		/**
		* private:
		**/
		var departmentName = department.departmentName;
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return department;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: departmentName,
			
			
			// over-ride toString method
			toString: function() {
				return __func__+' '+departmentName;
			},
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function(a, b) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return global.warn('No-args constructor not implemented');
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
				Download.json("data/ucsb/directory.departments@(["+format+"]='"+str+"').json",
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var department = new global(json[0]);
						new DepartmentCard(department);
					}
				);
			};
		},
		
		
	});
})();