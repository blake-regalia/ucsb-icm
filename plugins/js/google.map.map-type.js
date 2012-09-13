(function() {
	
	var __func__ = 'UCSBCampusImageMapType';
	
	var tileWidth = 256;
	var tileHeight = 256;
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var googleMaps = google.maps;
		
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
		
			name: 'ucsb',
		
			minZoom: 0,
			maxZoom: 19,
		
			tileSize: new googleMaps.Size(tileWidth, tileHeight),
			
			getTileUrl: function(coord, zoom) {
				/*var normalizedCoord = getNormalizedCoord(coord, zoom);
				if(!normalizedCoord) {
					return null;
				}*/
				return "/server/arcgis/rest/services/icm/basemap/MapServer/tile/"+zoom+"/"+coord.y+"/"+coord.x+"";
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