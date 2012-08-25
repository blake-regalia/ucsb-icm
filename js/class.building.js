// Building
(function() {
	var __func__ = 'Building';
	var database = {};
	
	var downloadsReady = false;
	
	
	
	var construct = function(buildingId) {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
			// returns the extent of this building
			getExtent: function() {
				return database.extents[buildingId];
			},
			
			// returns the name of this building
			getName: function() {
				return database.bidToName[buildingId];
			},
			
			getId: function() {
				return buildingId;
			},
			
			toString: function() {
				return __func__+' '+buildingid;
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
		},
		
		lookup: function(id) {
			new BuildingCard(id);
		},
		
		search: function() {
			
		},
		
		abrvToId: function(buildingAbrv) {
				
			// perform a hash-table lookup on the input string
			var buildingId = database.abrvToBid[buildingAbrv];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building abrv not found: "',buildingAbrv,'"');
				return -1;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		nameToId: function(buildingName) {
			
			// perform a hash-table lookup on the input string
			var buildingId = database.nameToBid[buildingName];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building name not found: "',buildingName,'"');
				return -1;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		newCard: function(buildingName) {
			new BuildingCard(global.nameToId(buildingName));
		},
	});
	
	Download.json({
		urls: {
			nameToBid: 'data/ucsb/facilities.building#{`buildingName`:`buildingId`}.json',
			abrvToBid: 'data/ucsb/facilities.building#{`buildingAbrv`:`buildingId`}.json',
			bidToName: 'data/ucsb/facilities.building#{`buildingId`:`buildingName`}.json',
			extents: 'data/ucsb/facilities.building#{`buildingId`:[`ymin`,`xmin`,`ymax`,`xmax`]}.json',
		},
		each: function(id, json) {
			if(!json.error) {
				database[id] = json.data;
			}
		},
		ready: function() {
			downloadsReady = true;
		},
	})
})();
