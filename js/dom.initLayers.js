var _basePath = "http://map.geog.ucsb.edu:8080";
var layers = [];

// Initialize Dynamic layers to "Layers" pane
function initLayer(url, type, id, opac, visibility) {
	if (type == 'dynamic') { var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, opacity:opac, visible:visibility}); }
	if (type == 'cached') { var layer = new esri.layers.ArcGISTiledMapServiceLayer(url, {id:id, opacity:opac, visible:visibility}); }
	
	legendLayers.push({layer:layer});
	return layer;
}

function initLayers() {
		layers['recycling'] = initLayer(_basePath+"/arcgis/rest/services/icm/icmRecycling/MapServer", 'cached', "recycling", 1, true);
		layers['emergencyPhones'] = initLayer(_basePath+"/arcgis/rest/services/icm/icmEmergencyPhones/MapServer", 'cached', "emergencyPhones", 1, true);
}
function addLayer(layer) {
	EsriMap.getMap().addLayers([layers[layer]]);
}
