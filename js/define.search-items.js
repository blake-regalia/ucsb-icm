

(function() {
	
	var __func__ = 'SearchItems';
	var instance = false;
	
	var subjects = {
		'Building': {
			url: 'data/ucsb/facility.buildings#<[`buildingName`].json',
			select: Building.newCard('`buildingName`'),
		},
		'Department': {
			url: 'data/ucsb/directory.departments#<[`departmentName`].json',
			select: Department.newCard,//('`department`'),
		},
		'Undergrad Lecture': {
			url: 'data/ucsb/registrar.lectures.undergrad#<[`courseTitle` - `fullTitle`]$.json',
			select: Lecture.newCard('`courseTitle` - `fullTitle`'),
		},
		'Graduate Lecture': {
			url: 'data/ucsb/registrar.lectures.graduate#<[`courseTitle` - `fullTitle`]$.json',
			select: function() {}, //Lectures.lookup('lecture.graduate'),
		},
		'Contact': {
			url: 'data/ucsb/directory.people#<[`firstName` `lastName`].json',
			select: Contact.newCard('`firstName` `lastName`'),
		},
	};
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		
		var itemClass = {};
		var listSize = 0;
		var matrix_width = 0;
		var ready = false;
		
		
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
				for(var e in itemClass) {
					count += itemClass[e].data.length;
					if(key < count) {
						return {
							major: parseInt(e),
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
				return listSize;
			},
			
			power: function(key) {
				var c = 0;
				for(var e in itemClass) {
					if(!key--) break;
					c += itemClass[e].data.length;
				}
				return c;
			},
			
			get: function(key) {
				var count = 0, pcount = 0;
				for(var e in itemClass) {
					count += itemClass[e].data.length;
					if(key < count) {
						return {
							string: itemClass[e].data[key-pcount],
							classTitle: itemClass[e].title,
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
		var subjectUrls = {};
		for(var e in subjects) {
			subjectUrls[e] = subjects[e].url;
		}
		
		Download.json({
			
			urls: subjectUrls,
			
			each: function(key, json) {
				
				var pi = listSize++;
				
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