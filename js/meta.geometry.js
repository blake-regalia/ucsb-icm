(function() {
	
	var __func__ = 'Geometry';
	
	var esri_geometry = esri.geometry;
	var esri_extent = esri_geometry.Extent;
	var esri_polygon = esri_geometry.Polygon;
	
	var spatialReference = {wkid:4326};
	var esri_spatialReference = new esri.SpatialReference(spatialReference);
	
	var serverSpatialReference = {wkid:102113};
	var esri_serverSpatialReference = new esri.SpatialReference(serverSpatialReference);
	
	var construct = function(obj) {
		
		
		/**
		* private:
		**/
		var geometry;
		
		(function() {
			var extent = obj.extent;
			var polygon= obj.polygon;
			
			if(extent) {
				if(extent instanceof Array) {
					if(extent.length === 4) extent.push(esri_spatialReference);
					geometry = esri_extent.apply({}, extent);
				}
				else {
					if(!extent.spatialReference) extent.spatialReference = spatialReference;
					geometry = esri_extent.apply({}, [extent]);
				}
			}
			
			if(polygon) {
				polygon.spatialReference = serverSpatialReference;
				geometry = new esri_polygon(polygon);
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
		var public = function() {
			return geometry;
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
			//
			isMetaGeometry: true,
			
			//
			declaredClass: true,
		});
		
		
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
	});
})();