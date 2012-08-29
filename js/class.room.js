/**
*
* public class Room
*
**/
(function() {
	
	var __func__ = 'Room';
	
	var database = {
		abrvToBid: {},
		nameToBid: {},
		polygon: {},
	};
	var downloadsReady = false;
	
	var construct = function(room) {
		
		if(!downloadsReady) {
			global.warn('data has finished downloading yet');
		}
		
		/**
		* private:
		**/
		var buildingId = room.buildingId;
		var roomNumber = room.roomNumber;
		var buildingName = Building.idToName(buildingId);
		
		// this class does not perform any asynchronous lookups, everything is local
		if(!database.extents[buildingId]) {
			return global.error('could not find building-id: ',buildingId);
		}
		if(!database.extents[buildingId][roomNumber]) {
			return global.error('could not find room "',roomNumber,'" in building: ',buildingId);
		}
		
		var callbackPolygon = false;
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return room;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// standard identifier
			id: room.buildingId+';'+roomNumber,
			
			// text to display as title
			title: buildingName,
			
			// text to display as subtitle
			subtitle: 'room '+roomNumber,
			
			// returns the extent of this building
			getExtent: function(ready) {
				if(!ready)	return global.error('must hand getExtent() a callback function');
				ready.apply(ready, [database.extents[buildingId][roomNumber]]);
			},
			
			
			// over-ride toString method
			toString: function() {
				return __func__+':'+buildingId+'-'+roomNumber;
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
			return new global({
				buildingId: a,
				roomNumber: b,
			});
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
		newCard: function(buildingId, roomNumber) {
			var room = global(buildingId, roomNumber);
			if(room && room.exists) {
				new RoomCard(room);
			}
		},
	
		
		//
		highlight: new Symbol({
			fill: 'rgba(255,255,0,0.3)',
			stroke: {
				color: 'rgba(255,0,0,0.75)',
				style: 'solid',
				width: 2,
			},
		}),
		
	});
	
	
	/**
	* 1-time invocation 
	**/
	Download.json({
		urls: {
			extents: 'data/ucsb/facilities.room#{`buildingId`:{`roomNumber`:[~`ymin`,~`xmin`,~`ymax`,~`xmax`]}}.json',
		},
		each: function(id, json) {
			database[id] = json;
		},
		ready: function() {
			downloadsReady = true;
		},
	});
	
})();