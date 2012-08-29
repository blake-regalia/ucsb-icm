(function() {
	
	var __func__ = 'Location';
	
	var wordRegex = /^\s*([a-z][^\s]*)[\s\-\.\:]*$/i;
	var numberRegex = /^\s*([0-9][^\s]*)[\s\-\.\:]*$/i;
	var bldgRegex = /^([a-z].*)[\s\-\.\:]+(\d\w+)$/i;
	var bidRegex  = /^([0-9].*)[\s\-\.\:]+(\d\w+)$/i;
	var roomRegex = /^(\d\w+)[\s\-\.\:]+([a-z].*)$/i;
	
	var construct = function(str) {
		
		/**
		* private:
		**/
		var resolved = true;
		
		var buildingName;
		var buildingId;
		var roomNumber;
		
		(function() {
			var x;
			
			// eg: ELLSN
			if((x=wordRegex.exec(str)) !== null) {
				buildingName = x[1];
			}
			
			// eg: 563
			else if((x=numberRegex.exec(str)) !== null) {
				buildingId = x[1];
			}
			
			// eg: Ellison Hall 1710A
			else if((x=bldgRegex.exec(str)) !== null) {
				buildingName = x[1];
				roomNumber = x[2];
			}
			
			// eg: 1710A Ellison
			else if((x=roomRegex.exec(str)) !== null) {
				roomNumber = x[1];
				buildingName = x[2];
			}
			
			// eg: 563 1710A
			else if((x=bidRegex.exec(str)) !== null) {
				buildingId = x[1];
				roomNumber = x[2];
			}
			
			
			// resolve targets
			if(buildingName) {
				buildingId = Building.abrvToId(buildingName.toUpperCase());
				if(!!buildingId) {
					buildingName = Building.idToName(buildingId);
					if(!buildingName) {
						global.warn('could not resolved building id: ',buildingId);
						resolved = false;
					}
				}
				else {
					buildingId = Building.nameToId(buildingName);
					if(!buildingId) {
						buildingId = Building.nameToId(buildingName+' Hall');
						if(!buildingId) {
							global.warn('could not resolve building "',buildingName,'"');
							resolved = false;
						}
					}
				}
			}
			else {
				buildingName = Building.idToName(buildingId);
				if(!buildingName) {
					global.warn('could not resolved building id: ',buildingId);
					resolved = false;
				}
			}
			
		})();
		
		
		/**
		* protected:
		**/
		var self = {
			
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
			
			isLocation: true,
			
			resolved: resolved,
			
			isRoom: roomNumber && !!roomNumber.length,
			
			getRoom: function() {
				return Room(buildingId, roomNumber);
			},
			
			execute: function() {
				if(operator.isRoom) {
					var room = Room(buildingId, roomNumber);
					return new RoomCard(room);
				}
				else if(resolved) {
					var building = Building(buildingId, buildingName);;
					return new BuildingCard(building);
				}
			},
			
			toString: function() {
				if(roomNumber.length) {
					return buildingName+' '+roomNumber;
				}
				else if(resolved) {
					return buildingName;
				}
				return str;
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