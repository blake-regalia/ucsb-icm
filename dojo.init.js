dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('esri.map');

dojo.addOnLoad(function() {
	new ESRI_Map(DefaultPackage);
});