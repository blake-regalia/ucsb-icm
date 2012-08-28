(function() {
	
	var __func__ = 'Geometry';
	
	var esri_geometry = esri.geometry;
	var esri_point = esri_geometry.Point;
	var esri_extent = esri_geometry.Extent;
	var esri_polygon = esri_geometry.Polygon;
	
	var spatialReference = {wkid:4326};
	var esri_spatialReference = new esri.SpatialReference(spatialReference);
	
	var serverSpatialReference = {wkid:102113};
	var esri_serverSpatialReference = new esri.SpatialReference(serverSpatialReference);
	
	var projectToWM = function(lat,lng) {
		var source = new Proj4js.Proj('EPSG:4326');
		var dest = new Proj4js.Proj('EPSG:900913');
		var tran = new Proj4js.Point(lng, lat);   //any object will do as long as it has 'x' and 'y' properties
		Proj4js.transform(source, dest, tran);
		
		return tran;
	}
	
	var construct = function(obj) {
		
		
		/**
		* private:
		**/
		var geometry;
		
		(function() {
			var point = obj.point;
			var extent = obj.extent;
			var polygon= obj.polygon;
			
			if(point) {
				geometry = new esri_point(point.x, point.y, esri_spatialReference);
			}
			
			if(extent) {
				
				if(extent instanceof Array) {
					if(extent.length === 4) {
						if(obj.system === 'lat-lng') {
							var sp = projectToWM(extent[0],extent[1]);
							extent[0] = sp.x; extent[1] = sp.y;
							sp = projectToWM(extent[2],extent[3]);
							extent[2] = sp.x; extent[3] = sp.y;
						}
						extent.push(esri_spatialReference);
					}
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
		
		point: function(x, y) {
			return new Geometry({
				point: {
					x: x,
					y: y,
				},
			});
		},
	});
})();