(function() {
	
	var __func__ = 'Map';
	
	
	/**
	* protected static:
	**/
	var map;
	
	var esri_graphic = esri.Graphic;
	var esri_layers = esri.layers;
	var esri_graphicsLayer = esri_layers.GraphicsLayer;
	
	var coordinateSystem = new esri.SpatialReference({wkid: 4326});
	
	var layers = {
		' ': new esri_graphicsLayer(),
	};
	
	
	var construct = function() {
		
		map = EsriMap.getMap();
		map.addLayer(layers[' ']);
		
		/**
		* private:
		**/
		
		
		/**
		* protected:
		**/
		var self = {
			
		};
		
		
		/**
		* public operator() ();
		**/
		var public = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(public, {
			
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
		
		
		//
		clear: function(layerName) {
			if(!arguments.length) {
				for(var e in layers) {
					layers[e].clear();
				}
			}
			else {
				layers[layerName].clear();
			}
		},
		
		
		//
		getLayer: function(layerName) {
			return layers[layerName];
		},
		
		
		//
		add: function(geometry, symbol, layerName, maxLayerObjects) {
			
			if(!geometry.declaredClass)		geometry = new Geometry(geometry);
			if(geometry.isMetaGeometry)		geometry = geometry();
			
			if(!symbol.declaredClass)		symbol = new Symbol(symbol);
			if(symbol.isMetaSymbol)			symbol = symbol();
			
			var layer;
			if(layerName) {
				if(layers[layerName]) {
					layer = layers[layerName];
				}
				else {
					layer = new esri_graphicsLayer();
					layers[layerName] = layer;
					map.addLayer(layer);
				}
			}
			else {
				layer = layers[' '];
			}
			
			layer.add(
				new esri_graphic(geometry, symbol)
			);
			
			
			if(typeof maxLayerObjects == 'number') {
				var layer_graphics = layer.graphics;
				while(layer_graphics.length > maxLayerObjects) {
					layer.remove(layer_graphics[0]);
				}
			}
			
			var chain = {
				layer: layer,
			};
			
			$.extend(chain, {
				
				// call this chained function to center the map at the last graphics object added
				center: function(extra) {
					var ext = layer.graphics[layer.graphics.length-1]._extent;
					var center = ext.getCenter();
					if(extra) {
						pxw = map.extent.getWidth() / map.width;
						
						var x = extra.x;
						var y = extra.y;
						if(x) {
							center.x -= pxw * x;
						}
						if(y) {
							if(typeof y === 'string') {
								if(y[y.length-1] == '%') {
									center.y += map.height * parseFloat(y)*0.01;
								}
							}
						}
					}
					map.centerAt(center);
					return chain;
				},
			
				fadeOut: function() {
					var alpha = 1;
					var d = function() {
						layer.setOpacity(alpha);
						alpha = alpha * 0.95*alpha;
						if(alpha > 0.1) {
							setTimeout(d, 30);
						}
					}; d();
				},
			});
			
			return chain;
		},
	});
})();