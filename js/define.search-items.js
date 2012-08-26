(function() {
	
	var mclass = {};
	var powerIndex = 0;
	var matrix_width = 0;
	var ready = false;
	
	var self = {
		
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
	};
	
	window.SearchItems = {
		data: function(index) {
			return mclass[index].data;
		},
		power: function(index) {
			return matrix_width * index;
		},
		size: function() {
			return powerIndex;
		},
		expose: function() {
			return mclass;
		},
	};
	
	var methods = {
		'Building': Building.newCard,
		'Department': Department.newCard,
		'Undergrad Lecture': Lectures.lookup('lecture.undergrad'),
		'Graduate Lecture': Lectures.lookup('lecture.graduate'),
		'Contact': Contacts.lookup,
	};
	
	Download.json({
		
		
		urls: {
			'Building':   'data/ucsb/facilities.building#<[`buildingName`].json',
			'Department': 'data/ucsb/directory.department.academic#<[`departmentName`].json',
			'Undergrad Lecture':  'data/ucsb/registrar.lecture.undergrad#<[`courseTitle` - `fullTitle`]$.json',
			'Graduate Lecture':   'data/ucsb/registrar.lecture.graduate#<[`courseTitle` - `fullTitle`]$.json',
			'Contact':   'data/ucsb/directory.people#<[`firstName` `lastName`].json',
		},
		
		
		each: function(key, json) {
			
			var pi = powerIndex++;
			
			if(json.data.length > matrix_width) {
				// round up to the nearest power of 2
				matrix_width = Math.pow(2,Math.ceil(Math.log(json.data.length)/Math.LN2));
			}
			
			mclass[pi] = {
				data: json.data,
				title: key,
				select: methods[key],
			};
		},
		
		ready: function() {
			ready = true;
			console.info('Search Items finished downloading');
		},
		
	});
	
})();