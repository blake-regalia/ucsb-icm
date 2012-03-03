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
