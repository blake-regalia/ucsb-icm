/**
*
* public class Building
*
**/
(function() {
	
	var __func__ = 'Building';
	
	var database = {
		abrvToBid: {},
		nameToBid: {},
		polygon: {},
	};
	var downloadsReady = false;
	
	var highlightBuilding = new Symbol({
		fill: 'rgba(255,0,0,0.3)',
		stroke: {
			color: 'rgba(255,0,0,0.75)',
			style: 'solid',
			width: 3,
		},
	});
	
	var construct = function(building) {
		
		/**
		* private:
		**/
		var buildingId = building.buildingId;
		var buildingName = building.buildingName;
		
		var callbackPolygon = false;
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var public = function() {
			return building;
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
			// standard identifier
			id: building.buildingId,
			
			
			// returns the extent of this building
			getExtent: function() {
				return database.extents[buildingId];
			},
			
			
			// returns the name of this building
			getName: function() {
				return database.bidToName[buildingId];
			},
			
			// calls a function when the geometry is ready
			getPolygon: function(callback) {
				if(database.polygon[buildingId]) {
					callback.apply(callback, [database.polygon[buildingId]]);
				}
				else {
					callbackPolygon = callback;
				}
			},
			
			
			// over-ride toString method
			toString: function() {
				return __func__+' '+buildingid;
			},
		});
		
		
		if(!database.polygon[buildingId]) {
			Download.json('server/9/query?outFields=features&f=pjson&text='+buildingName, function(json) {
				database.polygon[buildingId] = json.features[0].geometry;
				if(callbackPolygon) {
					callbackPolygon.apply({}, [json.features[0].geometry]);
				}
			});
		}
		
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
				Download.json("data/ucsb/facilities.building@(["+format+"]='"+str+"').json",
					function(json) {
						if(!json.length) return global.error('Query for "',str,'" returned empty result');
						var building = new Building(json[0]);
						new BuildingCard(building);
					}
				);
			};
		},
		
		
		// attempt to translate a building abbreviation to a building id
		abrvToId: function(buildingAbrv) {
				
			// perform a hash-table lookup on the input string
			var buildingId = database.abrvToBid[buildingAbrv];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building abrv not found: "',buildingAbrv,'"');
				return false;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		
		// attempt to translate an building name to a building id
		nameToId: function(buildingName) {
			
			// perform a hash-table lookup on the input string
			var buildingId = database.nameToBid[buildingName];
			
			// check if an entry exists for the given building name
			if(typeof buildingId === 'undefined') {
				global.error('building name not found: "',buildingName,'"');
				return false;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
		// attempt to translate an building name to a building id
		idToName: function(buildingId) {
			
			// perform a hash-table lookup on the input string
			var buildingName = database.bidToName[buildingId];
			
			// check if an entry exists for the given building name
			if(typeof buildingName === 'undefined') {
				global.error('building id not found: ',buildingId,'');
				return false;
			}
			
			// return the id number if it was found
			return buildingId;
		},
		
	});
	
	
	/**
	* 1-time invocation 
	**/
	Download.json({
		urls: {
			nameToBid: 'data/ucsb/facilities.building#{`buildingName`:`buildingId`}.json',
			abrvToBid: 'data/ucsb/facilities.building#{`buildingAbrv`:`buildingId`}.json',
			bidToName: 'data/ucsb/facilities.building#{`buildingId`:`buildingName`}.json',
			extents: 'data/ucsb/facilities.building#{`buildingId`:[~`ymin`,~`xmin`,~`ymax`,~`xmax`]}.json',
		},
		each: function(id, json) {
			database[id] = json;
		},
		ready: function() {
			downloadsReady = true;

			/**
			var bidToName = database.bidToName;
			for(var buildingId in bidToName) {
				var buildingName = bidToName[buildingId];
				Download.json('server/9/query?outFields=features&f=pjson&text='+buildingName, function(json) {
					database.polygon[buildingId] = json.features[0].geometry;
				});
			}
			**/
		},
	});
	
})();