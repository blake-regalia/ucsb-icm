
var BuildingsWithIDs = {};
var BuildingExtentsByID = {};
var BuildingNamesToID = {};

var BuildingNamesSearchItems = [];

var DepartmentalBuildings = [];

$(document).ready(function() {
	var DEPTBLD = /([\w ]+)\s\(([A-Z0-9 ]+)\)/;
	var PARENBLD = /([\w\. ]+)\s\(([^\)]+)\)/;
	var OTHER = /([\w\. ]+)/;
	var BA = [];
	
	$.ajax({
		url: 'buildings-origin.json',
		dataType: 'json',
		success: function(json) {
			console.log(json);
			var items = json.items
			var i = items.length;
			while(i--) {
				var ref = {};
				var bld = items[i];
				var name = DEPTBLD.exec(bld.name);
				if(name != null) {
					ref.name = name[1];
					ref.abbr = name[2];
				}
				else {
					name = PARENBLD.exec(bld.name);
					if(name != null) {
						ref.name = name[1];
						ref.paren = name[2];
					}
					else {
						name = OTHER.exec(bld.name);
						if(name != null) {
							ref.name = name[1];
						}
						else {
							console.log(bld.name, ' did not match any pattern');
						}
					}
				}
				
				if(/na/.test(bld.abbr)) {
					ref.notBLD = true;
				}
				else if(bld.abbr) {
					ref.bid = bld.abbr;
				}
				if(/^[0-9]/.test(ref.name)) {
					console.warn('ignoring '+ref.name+', double referenced');
					continue;
				}
				var ext = bld.extent._value;
				ref.ext = [ext.ymin, ext.xmin, ext.ymax, ext.xmax];
				
				
				if(ref.bid) {
					BuildingExtentsByID[ref.bid] = ref.ext;
					
					if(ref.abbr) {
						DepartmentalBuildings.push(ref);
						BuildingNamesToID[ref.abbr] = parseInt(ref.bid);
						
						BuildingNamesSearchItems.push(ref.name+' ('+ref.abbr+')');
					}
					else {
						BuildingNamesSearchItems.push(ref.name);
					}
					
					BuildingNamesToID[ref.name] = parseInt(ref.bid);
					
				}
			}
			
			writeToFile('building.extents.json', JSON.stringify(BuildingExtentsByID));
			writeToFile('building.names.id.json', JSON.stringify(BuildingNamesToID));
			writeToFile('building.names.json', JSON.stringify(BuildingNamesSearchItems));
		},
	});
});

var writeToFile = function(filename, data) {
	console.log('saving to file...');
	console.log($.ajax({
		url: 'save.php',
		type: 'POST',
		data: {
			'name': filename,
			'data': data,
		},
	}));
}