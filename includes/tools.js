//This function is used to display/hide the sideInfoWindow
//To use, make sure the object has an id set (ex: <div id="foo">)
function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
	  e.style.display = 'none';
   else
	  e.style.display = 'block';
}

// put any scripts you are testing in here
ESRI_Map.ready(function(map) {
	
	// Initialize vector layers to "Layers" pane
	window.initLayer = function(url, id) {
		var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, visible:false});
		map.addLayer(layer);
		return layer;
	}
	function initOpacLayer(url, id) {
		var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, opacity:0.8,visible:false});
		map.addLayer(layer);
		return layer;
	}

	
	window.initLayers = function(){
		recycling = initLayer("http://ags2.geog.ucsb.edu//arcgis/rest/services/icmRecyclingPoints/MapServer", "recycling");
		BikeRepairStations = initLayer("http://ags2.geog.ucsb.edu//ArcGIS/rest/services/icmBicycleRepairStations2/MapServer", "BikeRepairStations");
		eateries = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmEateries/MapServer", "eateries");
		ivEateries = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/ICMIslaVistaEstablishmentSymbols/MapServer", "ivEateries");
		recreation = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmRecreation/MapServer", "recreation");
		emergencyPhones = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmEmergencyPhones/MapServer", "emergencyPhones");
		Bike_Racks = initLayer("https://ags2.geog.ucsb.edu/arcgis/rest/services/Bike_Racks/MapServer", "Bike_Racks");
		wireless = initOpacLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmWireless/MapServer", "wireless");
		TalkingSigns = initOpacLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/TalkingSigns/MapServer", "TalkingSigns");
		resources = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmResources/MapServer", "resources");
		staff = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingStaff/MapServer", "Staff");
		faculty = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingFaculty/MapServer", "Faculty");
		visitorStudent = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingVisitor/MapServer", "Visitor or Student");
		resident = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingResident/MapServer", "Resident");
		metered = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingMetered/MapServer", "Metered parking");
		motorcycles = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingMotorcycles/MapServer", "Motorcycles");
		bus = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmBuslines/MapServer", "bus route");
		busloop = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmBusloop/MapServer", "bus loop");
		ada = initLayer("http://ags2.geog.ucsb.edu/arcgis/rest/services/icmParkingADA/MapServer", "ada");
	}
	
	//Functions to add/remove/swap layers.
	window.hideDynamicLayers = function(layers) {
		for (var j=1, jl=map.layerIds.length; j<jl; j++) {
			var layers = map.getLayer(map.layerIds[j]);
			if (dojo.indexOf(layers) == -1) {
				layers.hide();
			}
		}
	}
	window.changeMap = function(layers) {
		window.hideDynamicLayers(layers);
		for (var i=0; i<layers.length; i++) {
			layers[i].show();
			map.setExtent(layers[i].fullExtent); //use staff.fullExtent to set all layer views to parking's largest extent. For extent of each layer, use layers[i].fullExtent 
		}
	}
	
});