
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

/** ESRI_Map
*
*/
(function() {
	var map = false;
	var self = {
		
	};
	var global = window.ESRI_Map = function(package) {
		map = new esri.Map('map', {
			extent: package.extent,
		});
		
		console.log(package.basemap.url);
		
		// Add Basemap
		map.addLayer(
			new esri.layers.ArcGISTiledMapServiceLayer(package.basemap.url)
		);
		
		// map onload event
		dojo.connect(map, 'onLoad', function() {
			// resize map on window resize event
			dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
		});
	};
	$.extend(global, {
		
	});
})();