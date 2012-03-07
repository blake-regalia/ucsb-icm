Benchmark.start('esri.map.js');

window.UCSB_Campus = {
	basemap: {
		url: 'http://earth.geog.ucsb.edu/ArcGIS/rest/services/icmBasemap10/MapServer',
	},
	extent: {
		xmin: -119.86100,
		ymin: 34.40856,
		xmax: -119.83553,
		ymax: 34.41913,
		spatialReference: {
			wkid: 4326,
		},
	},
};

window.DefaultPackage = UCSB_Campus;

/** static ESRI_Map
*
*/
(function() {
	var map = false;
	var listeners = [];
	var self = {
		
	};
	var global = window.ESRI_Map = function(package) {
		Benchmark.start(global);
		
		map = new esri.Map('map', {
			extent: new esri.geometry.Extent(package.extent),
		});
		
		// Add Basemap
		map.addLayer(
			new esri.layers.ArcGISTiledMapServiceLayer(package.basemap.url)
		);
		
		var i = listeners.length;
		while(i--) {
			listeners.pop().apply(window, [map]);
		}
		
		// map onload event
		dojo.connect(map, 'onLoad', function() {
			Benchmark.mark('map load', global);
			Benchmark.mark('map load', 'script');
			Benchmark.save('load');
			
			//Init Selectable Layers
			initLayers();
			
			// resize map on window resize event
			dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
		});
	};
	$.extend(global, {
		toString: function() {
			return 'ESRI_Map()';
		},
		
		// for developers to test scripts
		getMap: function() {
			return map;
		},
		ready: function(callback) {
			listeners.push(callback);
		},
	});
})();

Benchmark.stop('esri.map.js','load');