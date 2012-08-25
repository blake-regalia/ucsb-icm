


(function() {
	var __func__ = 'RoomLocator';
	
	var queryRegex = /^(.*)\s+(\w+)$/i;
	
	var bldgRegex = /^([a-z].*)[\s\-\.\:]+(\d\w+)$/i;
	var roomRegex = /^(\d\w+)[\s\-\.\:]+([a-z].*)$/i;
	
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		
		
		search: function(query) {
			
			// perform a regex execution on the input query to differentiate between building name and room number
			var bldgMatch = bldgRegex.exec(query);
			
			if(bldgMatch !== null) {
				// reference the matches
				var buildingName = bldgMatch[1];
				var roomNumber   = bldgMatch[2];
				
				// try to interpret it is abrv
				var buildingId = Building.abrvToId(buildingName);
				
				// if the building was found
				if(buildingId !== -1) {
					// let the lookup function handle the rest
					return global.lookup(buildingId, roomNumber);
				}
				
				// try to interpret it as name
				buildingId = Building.nameToId(buildingName);
				
				// if the building was found
				if(buildingId !== -1) {
					// let the lookup function handle the rest
					return global.lookup(buildingId, roomNumber);
				}
				
			}
			else {
				var roomMatch = roomRegex.exec(query);
				
			}
			
			
			/*
			
			var match = queryRegex.exec(query);
			
			// if the input string matches the pattern
			if(match !== null) {
				// reference the matches
				var buildingName = match[1];
				var roomNumber   = match[2];
			
				// translate the building name to an id number
				var buildingId = Building.nameToId(buildingName);
				
				// if the building was found
				if(buildingId !== -1) {
					// let the lookup function handle the rest
					return global.lookup(buildingId, roomNumber);
				}
				else {
					//error
				}
			}
			*/
			
		},
		
		
		lookup: function(buildingId, roomNumber) {
			return new Room(buildingId, roomNumber);
		},
	});
})();