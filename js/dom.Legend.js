dojo.require("esri.dijit.Legend");

var legendLayers = [];
var legend = [];

function initLegend() {
	dojo.connect(EsriMap.getMap(),'onLayersAddResult',function(results){
	  var legend = new esri.dijit.Legend({
	    map:EsriMap.getMap(),
	    layerInfos:legendLayers,
	    respectCurrentMapScale:true
	  },"legendDiv");
	  legend.startup();
	});
}

console.log('Legend script has no errors.');
