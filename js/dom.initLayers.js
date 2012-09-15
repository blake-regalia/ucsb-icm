var _basePath = "http://map.geog.ucsb.edu:8080";
var layers = [];
var layersActive = [];

// Initialize Dynamic layers to "Layers" pane
function initLayer(url, type, id, opac, visibility) {
	if (type == 'dynamic') { var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, opacity:opac, visible:visibility}); }
	if (type == 'cached') { var layer = new esri.layers.ArcGISTiledMapServiceLayer(url, {id:id, opacity:opac, visible:visibility}); }
	
	legendLayers.push({layer:layer});
	return layer;
}

function initLayers() {
		layers['basemap'] = initLayer(_basePath+"/arcgis/rest/services/icm/basemap/MapServer", 'cached', "basemap", 1, false);
		layers['recycling'] = initLayer(_basePath+"/arcgis/rest/services/icm/icmRecycling/MapServer", 'cached', "recycling", 1, false);
		layers['emergencyPhones'] = initLayer(_basePath+"/arcgis/rest/services/icm/icmEmergencyPhones/MapServer", 'cached', "emergencyPhones", 1, false);
}
function addLayer(layer) {
	if (layersActive.indexOf(layer) == -1) { // check if layer is already active.
			EsriMap.getMap().addLayers([layers[layer]]);
			layers[layer].setVisibility(true);	
			//Adds the newly active layer id to the top of the activeLayers array
			layersActive.unshift(layers[layer].id);
	}
	else {
		console.log('Layer "'+layer+'" already active.');
	}

}
function clearLayers() {
	if (layersActive.length > 0) {  //if there are active layers, start the loop
		layersActive.forEach(function(layer) {
			console.log('Active Layer: '+layer);
			layers[layer].setVisibility(false);
		});
		layersActive = [];
	}
	else {
		return true;
	}

}
function changeLayer(layer) {
	clearLayers();
	addLayer(layer);
	layers[layer].setVisibility(true);
}
