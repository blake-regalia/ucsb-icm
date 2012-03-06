//This function is used to display/hide the sideInfoWindow
//To use, make sure the object has an id set (ex: <div id="foo">)
function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
	  e.style.display = 'none';
   else
	  e.style.display = 'block';
}

// Initialize vector layers to "Layers" pane
function initLayer(url, id) {
	var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, visible:false});
	map.addLayer(layer);
	return layer;
}
function initLayers(){
	recycling = initLayer("http://ags2.geog.ucsb.edu//arcgis/rest/services/icmRecyclingPoints/MapServer", "recycling");
	BikeRepairStations = initLayer("http://ags2.geog.ucsb.edu//ArcGIS/rest/services/icmBicycleRepairStations2/MapServer", "BikeRepairStations");
}

//Functions to add/remove/swap layers.
function hideDynamicLayers(layers) {
	for (var j=2, jl=map.layerIds.length; j<jl; j++) {
		var layers = map.getLayer(map.layerIds[j]);
		if (dojo.indexOf(layers) == -1) {
			layers.hide();
		}
	}
	map.removeLayer(hoverGraphicsLayerBus);
	construction.show();
}
function changeMap(layers) {
	hideDynamicLayers(layers);
	for (var i=0; i<layers.length; i++) {
		layers[i].show();
		map.setExtent(layers[i].fullExtent); //use staff.fullExtent to set all layer views to parking's largest extent. For extent of each layer, use layers[i].fullExtent 
	}
}