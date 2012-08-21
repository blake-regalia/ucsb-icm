Benchmark.start('esri.map.js');

window.UCSB_Campus_earth = {
	basemap: {
		url: 'http://earth.geog.ucsb.edu/ArcGIS/rest/services/icmBaseMap/MapServer',
	},
	extent: {
		xmin: -119.86100,
		ymin: 34.40856,
		xmax: -119.83553,
		ymax: 34.41913,
		spatialReference: {
			wkid: 42306,
		},
	},
};

window.UCSB_Campus_ags_dev = {
	basemap: {
		url: 'http://ags2.geog.ucsb.edu/ArcGIS/rest/services/icmBaseMap20120411/MapServer',
	},
	extent: {
		xmin: -13342700,
		ymin: 4084100,
		xmax: -13339988,
		ymax: 4084700,
		spatialReference: {
			wkid: 102100,
		},
	},
};

window.DefaultPackage = UCSB_Campus_ags_dev;

/** static class EsriMap
*
*/
(function() {
	var __func__ = 'EsriMap';
	var dom = false;
	var map = false;
	var listeners = [];
	var coordinateSystem = new esri.SpatialReference({wkid: 4326});
	
	
	var highlightLayer = new esri.layers.GraphicsLayer(); 
	
	var self = {
		
	};
	var global = window[__func__] = function(package) {
		Benchmark.start(global);
		
		dom = dojo.byId('map');
		
		map = new esri.Map('map', {
			extent: new esri.geometry.Extent(package.extent),
		});
		
		// Add Basemap
		map.addLayer(
			new esri.layers.ArcGISTiledMapServiceLayer(package.basemap.url)
		);
		
		// Add highlight layer
		map.addLayer( highlightLayer );
		
		var i = listeners.length;
		while(i--) {
			listeners.pop().apply(map, [dom]);
		}
		
		// map onload event
		dojo.connect(map, 'onLoad', function() {
			Benchmark.mark('map load', global);
			Benchmark.mark('map load', 'script');
			Benchmark.save('load');
			
			// resize map on window resize event
			dojo.connect(dom, 'resize', map, map.resize);
		});
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		// for developers to test scripts
		getMap: function() {
			return map;
		},
		getDOM: function() {
			return dom;
		},
		ready: function(callback) {
			listeners.push(callback);
		},
		
		
		
		setCenter: function(webMercatorCoordinatePair) {
			console.log(webMercatorCoordinatePair);
			var point = new esri.geometry.Point(webMercatorCoordinatePair.x, webMercatorCoordinatePair.y, coordinateSystem);
			map.centerAt(point);
		},
		
		focus: function(wmcp) {
			global.setCenter(wmcp.getPoint());
			var ext = wmcp.getExtent();
			var extent = new esri.geometry.Extent(ext[0], ext[1], ext[2], ext[3], coordinateSystem);
			
			var outline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 215, 0, 1]), 3);
			var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, outline, new dojo.Color([255, 215, 0, 0.5]));
			var extGraphic = new esri.Graphic(ext, symbol);
			
			highlightLayer.add(extGraphic);
			
			map.addLayer(highlightLayer);
			
			/*
			var featureSet = new esri.tasks.FeatureSet();
			featureSet.features = [extGraphic];
			*/
		},
	});
})();

Benchmark.stop('esri.map.js','load');