
var fs = require('fs');
var jsxml = require('./string.xml-json.js');
var shpkml = require('./export-kit.json.shp-kml.js');

if(process.argv.length < 3) {
	console.error('must specify a file');
	return 1;
}

var filename = './'+process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {

	var json = jsxml.xml2json(data);
	var output = shpkml.exportFields(
		json.$children[0].$children[0].$children[0].$children[0]
	);
	
	var basename = /^(.*)\.[a-z0-9]+/i.exec(filename)[1];
	
	fs.writeFile(basename+'.rings.json', JSON.stringify(output.placemarks));
	
	fs.writeFile(basename+'.id-names.json', JSON.stringify(output.attrs));
	
	var attrs = output.attrs;
	var csv = '"buildingId","buildingName","buildingUse","baseArea","departments"';
	for(var bid in attrs) {
		var bldg = attrs[bid];
		var line = [];
		for(var e in bldg) {
			var val = bldg[e];
			if(typeof val !== 'number') {
				val = (val+'').replace(/\\/,'').replace(/"/,'\\"');
			}
			line.push('"'+val+'"');
		}
		csv += line.join(',')+"\n";
	}
	
	fs.writeFile(basename+'.attrs.csv', csv);
});
