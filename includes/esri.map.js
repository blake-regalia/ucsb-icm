Benchmark.start('esri.map.js');

window.UCSB_Campus = {
	basemap: {
		url: 'http://earth.geog.ucsb.edu/ArcGIS/rest/services/icmBasemap10/MapServer',
	},
	extent: new esri.geometry.Extent({
		xmin: -119.89065,
		ymin: 34.39492,
		xmax: -119.83027,
		ymax: 34.43037,
		spatialReference: {
			wkid: 4326,
		},
	}),
};

window.DefaultPackage = UCSB_Campus;

/** static ESRI_Map
*
*/
(function() {
	var map = false;
	var self = {
		
	};
	var global = window.ESRI_Map = function(package) {
		Benchmark.start(global);
		
		//Settings for the position and size of the Zoom slider.
		//esriConfig.defaults.map.slider = { left:"10px", top:"10px", width:null, height:"200px" };
		
		//openingExtent is the extent to zoom to UCSB Campus.
		openingExtent = new esri.geometry.Extent({"xmin":-119.86100,"ymin":34.40856,"xmax":-119.83553,"ymax":34.41913,"spatialReference":{"wkid":4326}});
		
		map = new esri.Map('map', {
			//package.extent will use the extent from the layer loaded (The basemap)
			//extent: package.extent,
			//Instead, we want to set the extent to UCSB campus.
			extent: openingExtent,
		});
		
		// Add Basemap
		map.addLayer(
			new esri.layers.ArcGISTiledMapServiceLayer(package.basemap.url)
		);
		
		// map onload event
		dojo.connect(map, 'onLoad', function() {
			Benchmark.mark('map load', global);
			Benchmark.mark('map load', 'script');
			
			// resize map on window resize event
			dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
		});
	};
	$.extend(global, {
		toString: function() {
			return 'ESRI_Map()';
		},
	});
})();

Benchmark.stop('esri.map.js','load');