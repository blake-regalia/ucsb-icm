
var ICM = {
	building_data: {},
};

var NOC = {
	wireless_log: {},
	dateStr_to_time: function(dateStr) {
		var a = dateStr.split('-');
		if(!a[2]) console.log(dateStr,'!');
		var b = a[2].split(' ');
		var c = b[1].split(':');
		return new Date(a[0],parseInt(a[1])-1,b[0],c[0],c[1],c[2]);
	},
};



/**/
window.ip_ranges = function() {
	$.ajax({
		url: 'campus_network.csv',
		success: function(text) {
			var MAP = {};
			
			var line = text.split('\n');
			for(var i=0; i!==line.length; i++) {
				var field = line[i].split(',');
				if(parseInt(field[2]) == field[2]) {
					
					/**/
					var ip = field[1].split('.');
					var end = ip[ip.length-1].split('/');
					var slash = end[1];
					ip[ip.length-1] = end[0];
					
					var node = MAP;
					for(var n=0; n<ip.length; n++) {
						var s = ip[n];
						if(!node[s]) node[s] = {};
						node = node[s];
					}
					node.slash = slash;
					node.bid = field[2];
					node.name = field[3];
					/**/
					
					/**
					MAP[field[1]] = {
						bid: field[2],
						name: field[3],
					};
					**/
				}
			}
			
			document.write(JSON.stringify(MAP));
		},
	});
};


/**/
window.parse_buildings = function() {
	$.ajax({
		url: 'icm_buildings.json',
		dataType: 'json',
		success: function(json) {
			
			var BLD = {};
			
			$.each(json, function(i, record) {
				$.each(record, function(j, building) {
					$.each(building.geometry.rings, function(k, ring) {
						
						var xy_ring = [];
						for(var z=0; z<ring.length; z++) {
							xy_ring.push({x:ring[z][0], y:ring[z][1]});
						}
						
						var xmin = Infinity; var xmax = -Infinity;
						var ymin = Infinity; var ymax = -Infinity;
						var edge = [];
						for(var k=0; k<xy_ring.length; k++) {
							xmin = Math.min(xy_ring[k].x, xmin);
							xmax = Math.max(xy_ring[k].x, xmax);
							ymin = Math.min(xy_ring[k].y, ymin);
							ymax = Math.max(xy_ring[k].y, ymax);
						}
						xy_ring.length = 0;
						
						BLD[building.id] = {
							name: building.attributes.B_Name.replace(/[\r\n]/g,''),
							bid: building.id,
							center: {
								lat: (ymin + ymax) / 2,
								lng: (xmin + xmax) / 2,
							},
							
							clips: {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, /*nodes: struct, arcs: edge, bid: struct.bid, name:struct.name*/},
						};
					});
				});
			});
			
			document.write(JSON.stringify(BLD));
		},
	});
};
/**/

/**/
window.useritize = function() {
	$.ajax({
		url: 'wireless.csv',
		success: function(data) {
			var record = data.split('\n');
			var wireless_log = {};
			
			for(var i=0; i<record.length; i++) {
				var entry = record[i];
				entry = entry.substr(1,-1).split('","');
				if(entry.length < 3) break;
				
				var user_hash = entry[2];
				var date_time = NOC.dateStr_to_time(entry[0]);
				var time_stamp = date_time.getTime()/1000;
				if(!wireless_log[user_hash]) wireless_log[user_hash] = {length:0};
				var log = wireless_log[user_hash];
				
				wireless_log[user_hash][log.length++] = {
					ts: time_stamp,
					ap: entry[1],
				};
			}
			delete record;
			
			document.write(JSON.stringify(wireless_log));
		},
	});
};
/**/


/****/
window.chronologize = function() {
	$.ajax({
		url: 'wireless.csv',
		success: function(data) {
			var record = data.split('\n');
			var wireless_log = {};
			
			for(var i=0; i<record.length; i++) {
				var entry = record[i];
				entry = entry.substr(1,-1).split('","');
				if(entry.length < 3) break;
				
				var user_hash = entry[2];
				var date_time = NOC.dateStr_to_time(entry[0]);
				var time_stamp = date_time.getTime()/1000;
				
				var key = time_stamp;
				
				if(!wireless_log[key]) wireless_log[key] = {};
				var log = wireless_log[key];
				
				var ix = 0;
				while(wireless_log[key][ix]){ix++};
				wireless_log[key][ix] = {
					uid: user_hash,
					bid: entry[1].split('-')[0],
				};
			}
			delete record;
			
			document.write(JSON.stringify(wireless_log));
		},
	});
};