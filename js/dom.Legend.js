dojo.require("esri.dijit.Legend");

var legendLayers = [];

dojo.connect(EsriMap.getMap(),'onLayersAddResult',function(results){
  var legend = new esri.dijit.Legend({
    map:EsriMap.getMap(),
    layerInfos:legendLayers,
    respectCurrentMapScale:true
  },"legendDiv");
  legend.startup();
});