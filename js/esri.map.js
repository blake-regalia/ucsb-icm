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

/** static ESRI_Map
*
*/
(function() {
	var dom = false;
	var map = false;
	var listeners = [];
	var self = {
		
	};
	var global = window.ESRI_Map = function(package) {
		Benchmark.start(global);
		
		dom = dojo.byId('map');
		
		map = new esri.Map('map', {
			extent: new esri.geometry.Extent(package.extent),
		});
		
		// Add Basemap
		map.addLayer(
			new esri.layers.ArcGISTiledMapServiceLayer(package.basemap.url)
		);
		
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
			return 'ESRI_Map()';
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
	});
})();

Benchmark.stop('esri.map.js','load');