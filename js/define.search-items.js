/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */



(function() {
	
	var __func__ = 'SearchItems';
	var instance = false;
	
	var subjects = {
		
		'Undergrad': {
			url: "data/ucsb/directory.people@(`type`='undergrad student')#<[`firstName` `lastName`].json",
			select: Contact.newCard('`firstName` `lastName`', "@(`type`='undergrad student')"),
		},
		
		'Department': {
			url: 'data/ucsb/directory.departments#<[`departmentName`].json',
			select: Department.newCard('`departmentName`'),
		},
		
		'Staff': {
			url: "data/ucsb/directory.people@(`type`='staff')#<[`firstName` `lastName`].json",
			select: Contact.newCard('`firstName` `lastName`',"@(`type`='staff')"),
		},
		
		'Graduate Lecture': {
			url: 'data/ucsb/registrar.lectures.graduate#<[`courseTitle` - `fullTitle`]$.json',
			select: function() {}, //Lectures.lookup('lecture.graduate'),
		},
		
		'Graduate': {
			url: "data/ucsb/directory.people@(`type`='graduate student')#<[`firstName` `lastName`].json",
			select: Contact.newCard('`firstName` `lastName`',"@(`type`='graduate student')"),
		},
		
		'Building': {
			url: 'data/ucsb/facility.buildings#<[`buildingName`].json',
			select: Building.newCard('`buildingName`'),
		},
		
		'Undergrad Lecture': {
			url: 'data/ucsb/registrar.lectures.undergrad#<[`courseTitle` - `fullTitle`]$.json',
			select: Lecture.newCard('`courseTitle` - `fullTitle`'),
		},
		
		'Professor': {
			url: "data/ucsb/directory.people@(`type`='faculty')#<[`firstName` `lastName`].json",
			select: Contact.newCard('`firstName` `lastName`',"@(`type`='faculty')"),
		},
		
	};
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		
		var itemClass = [];
		var listSize = 0;
		var matrix_width = 0;
		var ready = false;
		
		var powerOfKey = {};
		
		/**
		* protected:
		**/
		var self = {
			
			/**
			* NOT IN USE: intended for constant-sized maps
			**
			reduce: function(key) {
				var major = 0;
				while(key > matrix_width) {
					major += 1;
					key -= matrix_width;
				}
				return {
					major: major,
					minor: key,
				};
			},
			/***/
			
			expand: function(key) {
				var count = 0, pcount = 0;
				var len = itemClass.length;
				for(i=0; i<len; i++) {
					count += itemClass[i].data.length;
					if(key < count) {
						return {
							major: i,
							minor: key - pcount,
						};
					}
					pcount = count;
				}
				return console.error('SearchItems(): index out of bounds, '+key);
			},
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
			
			items: function(index) {
				return itemClass[index].data;
			},
			
			size: function() {
				return itemClass.length;
			},
			
			power: function(key) {
				var c = 0;
				var len = itemClass.length;
				for(i=0; i<len; i++) {
					var target = itemClass[i];
					if(!key--) break;
					c += target.data.length;
				}
				return c;
			},
			
			get: function(key) {
				var count = 0, pcount = 0;
				var len = itemClass.length;
				for(i=0; i<len; i++) {
					var target = itemClass[i];
					count += target.data.length;
					if(key < count) {
						return {
							string: target.data[key-pcount],
							classTitle: target.title,
						}
					}
					pcount = count;
				}
				return console.error('SearchItems(): index out of bounds, '+key);
			},
			
			lookup: function(key) {
				var crd = self.expand(key);
				var set = itemClass[crd.major];
				var str = set.data[crd.minor];
				set.select.apply(set.select, [str.replace("'","\\'")]);
				return str;
			},
			
			expose: function() {
				return itemClass;
			},
			
			expand: function(key) {
				return self.expand(key);
			},
		});
		

		/**
		*
		**/
		var xpi = 0;
		var subjectUrls = {};
		for(var e in subjects) {
			subjectUrls[e] = subjects[e].url;
			powerOfKey[e] = xpi++;
		}
		
		Download.json({
			
			urls: subjectUrls,
			
			each: function(key, json) {
				
				var pi = powerOfKey[key];
				
				itemClass[pi] = {
					data: json,
					title: key,
					select: subjects[key].select,
				};
			},
			
			ready: function() {
				ready = true;
				console.info('Search Items finished downloading');
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