(function() {
	
	var __func__ = 'Geometry';
	
	var googleMaps;
	
	
	var construct = function(obj) {
		
		if(obj.isGeometry) {
			return obj;
		}
		
		/**
		* private:
		**/
		var geometry;
		var type = obj.geometryType;
			type = type[0].toUpperCase()+type.substr(1).toLowerCase();
		
		switch(type) {
			
		case 'Polygon':
			geometry = obj.getPolygon();
			
			console.warn(geometry);
			var i = geometry.length;
			while(i--) {
				var latlng = geometry[i];
				//geometry[i] = googleMaps.LatLng.apply({}, latlng);
				geometry[i] = new googleMaps.LatLng(latlng[1], latlng[0]);
			}
			
			break;
		}
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			return geometry;
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			isGeometry: true,
			
			type: type,
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
		googleMaps = google.maps;
		
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