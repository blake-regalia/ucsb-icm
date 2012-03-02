Benchmark.start('dojo.init.js');

dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('esri.map');

dojo.addOnLoad(function() {
	Benchmark.mark('document load','script');
	new ESRI_Map(DefaultPackage);
});

Benchmark.stop('dojo.init.js','load');