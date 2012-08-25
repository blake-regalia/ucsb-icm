
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
			extents: 'data/ucsb.facilities.room#{`buildingId`:`roomNumber`:[`ymin`,`xmin`,`ymax`,`xmax`]}.json',
		},
		each: function(id, json) {
			db[id] = json;
		},
		complete: function() {
			ready = true;
		},
	});
})();

