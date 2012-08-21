

(function() {
	var __func__ = 'Room';
	
	var ready = false;
	var db = {};
	
	var construct = function(buildingId, roomNumber) {
		if(!db.extents[buildingId]) {
			return global.error('building id not found: ',buildingId);
		}
		if(!db.extents[buildingId][roomNumber]) {
			return global.error('room number not found in building '+buildingId+': "',roomNumber,'"');
		}
		
		var self = {
			
		};
		var public = function() {
		};
		$.extend(public, {
			
			exists: true,
			
			getExtent: function() {
				var ext = db.extents[buildingId][roomNumber];
				var min = projectToWM(ext[1], ext[0]);
				var max = projectToWM(ext[3], ext[2]);
				return [ min.x, min.y, max.x, max.y ];
			},
			
			getPoint: function() {
				var extent = db.extents[buildingId][roomNumber];
				console.log(extent);
				return projectToWM(
					(extent[1]+extent[3]) * 0.5,
					(extent[0]+extent[2]) * 0.5
				);
			},
			
			toString: function() {
				return __func__+':'+buildingId+'-'+roomNumber;
			},
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
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
			return false;
		},
	});
	
	Download.json({
		urls: {
			extents: 'data/get.json.php?u=ucsb.facilities.room#{`buildingId`:`roomNumber`:[`ymin`,`xmin`,`ymax`,`xmax`]}.json',
		},
		each: function(id, json) {
			db[id] = json;
		},
		complete: function() {
			ready = true;
		},
	});
})();



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