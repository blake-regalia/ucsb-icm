
exports.exportFields = function(json) {

	if(json.$ !== 'Folder') {
		return {error: 'JSON not in proper format'};
	}
	
	var tableName = '';
	var schema = {};
	var data = {};
	var attrs = {};

	var nodes = json.$children;
	var i = nodes.$length;
	while(i--) {
		var node = nodes[i];
		switch(node.$.toLowerCase()) {
		
		case 'name':
			tableName = node.$text;
			break;
			
		case 'schema':
			var fields = node.$children;
			var len = fields.$length, j = -1;
			while(++j != len) {
				var field = fields[j];
				schema[field.name] = field.type;
			}
			break;
			
		case 'placemark':
			var row = {};
			var dataTypes = node.$children;
			var dtlen = dataTypes.$length, j = -1;
			while(++j != dtlen) {
				var dataType = dataTypes[j];
				switch(dataType.$.toLowerCase()) {
				
				case 'extendeddata':
					var fields = dataType.$children[0].$children;
					var flen = fields.$length, k = -1;
					while(++k != flen) {
						var field = fields[k];
						row[field.name] = field.$text;
					}
					attrs[row['B_Number']] = {
						'buildingId': parseInt(row['B_Number']),
						'buildingName': row['B_Name'],
						'buildingUse': row['B_Use']? row['B_Use']: '',
						'baseArea': parseFloat(row['Shape_Area']),
						'departments': row['Department']? row['Department'].split(',').join(';'): '',
					}
					break;
					
				case 'polygon':
					if(row['B_Number']) {
						var coords = dataType.$children[0].$children[0].$children[0].$text.split(' ');
						var finalc = [];
						var ci = coords.length;
						while(ci--) {
							var cxy = coords[ci].split(',');
							finalc.push([
								parseFloat(cxy[0]),
								parseFloat(cxy[1])
							]);
						}
						data[row['B_Number']] = finalc;
					}
					break;
				}
			}
			break;
		
		}
	}
	
	return {
		'name': tableName,
		'schema': schema,
		'placemarks': data,
		'attrs': attrs,
	};
};