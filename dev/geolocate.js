var google_map;

var launch = function(position) {
	var location = new google.maps.LatLng(
			position.coords.latitude,
			position.coords.longitude
		);
		
	var options = {
		zoom: 19,
		mapTypeId: 'roadmap',
		center: location,
		streetViewControl: false,
	};
	
	window.google_map = new google.maps.Map(
		$('#map_canvas')[0],
		options
	);
	
	new google.maps.Marker({
		map: google_map,
		position: location,
	});
};

var fetch = function() {
	navigator.geolocation.getCurrentPosition(
	
		function(position) {
			console.log(position);
			launch(position);
			reverse_lookup(position.coords);
		},
		
		function(error) {
			switch(error.code) {
				case error.TIMEOUT:
					alert('Timeout');
					break;
				case error.POSITION_UNAVAILABLE:
					alert('Position unavailable');
					break;
				case error.PERMISSION_DENIED:
					alert('Permission denied');
					break;
				case error.UNKNOWN_ERROR:
					alert('Unknown error');
					break;
			}
		}
		
	);
};

var reverse_lookup = function(crd) {
	console.log('started with: ',[crd.latitude, crd.longitude]);
	var my = World.latlng2xy([crd.longitude, crd.latitude]);
	console.log('translated to: ',[my.y, my.x]);
	console.log('and back to: ',World.xyToLatLng(my.x,my.y));
	var nearest = {dd:Infinity, bld:Infinity};
	var closest = false;
	for(var bid in BLD) {
		if(!BLD[bid].clips) continue;
		var clip = BLD[bid].clips;
		var center = {
			x: (clip.xmin+clip.xmax)/2,
			y: (clip.ymin+clip.ymax)/2,
		};
		var dx = (my.x-center.x);
		var dy = (my.y-center.y);
		var dist = Math.sqrt(dx*dx+dy*dy);
		if(dist < nearest.dd) {
			nearest.dd = dist;
			nearest.bld = bid;
		}
		
		if(clip.xmin < my.x && clip.xmax > my.x && clip.ymin < my.y && clip.ymax > my.y) {
			console.log("FOUND YOU ",bid);
			break;
		}
	}
	maybe(nearest.bld);
};

$.extend(window, {
	Buildings: [],
	clips: [],
});

(function() {
	var self = window.World = function() {
		
	};
	var my = {
		north: 0,
		west: 0,
		latSpan: 0,
		lngSpan: 0,
	};
	var rwts = 1,
		strw = 1;
	$.extend(self, {
		defineExtent: function(northWest, southEast) {
			my.north = northWest.lat;
			my.west = northWest.lng;
			my.latSpan = Math.abs(southEast.lat - northWest.lat);
			my.lngSpan = Math.abs(southEast.lng - northWest.lng);
		},
		setScale: function(pixelWidth) {
			rwts = pixelWidth / my.lngSpan;
			strw = 1 / rwts;
			return Math.abs(rwts * my.latSpan);
		},
		latlng2xy: function(latlng) {
			return {x: rwts * (latlng[0] - my.west), y: Math.abs(rwts * (latlng[1] - my.north))};
		},
		xyToLatLng: function(x, y) {
			return {lat: (x * strw) + my.west, lng: (y * strw) + my.north};
		},
	});
})();
    
window.ParseStructs = function(json) {
	$.each(json, function(i, record) {
		$.each(record, function(j, building) {
			$.each(building.geometry.rings, function(k, ring) {
				var struct = [];
				for(var z=0; z<ring.length; z++) {
					struct.push(World.latlng2xy(ring[z]));
				}
				struct.name = building.attributes.B_Name;
				struct.bid = building.id;
				BLD[building.id] = struct;
				
				var xmin = Infinity; var xmax = -Infinity;
				var ymin = Infinity; var ymax = -Infinity;
				var edge = [];
				for(var k=0; k<struct.length; k++) {
					xmin = Math.min(struct[k].x, xmin);
					xmax = Math.max(struct[k].x, xmax);
					ymin = Math.min(struct[k].y, ymin);
					ymax = Math.max(struct[k].y, ymax);
					var next = struct[(k+1)%struct.length];
					edge.push({x1: struct[k].x, y1: struct[k].y,
						x2: next.x, y2: next.y});
				}
				struct.length = 0;
				
				BLD[building.id].clips = {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax, /*nodes: struct, arcs: edge, bid: struct.bid, name:struct.name*/};
			});
		});
	});
};


$(document).ready(function() {
	
	World.defineExtent({lat: 34.419767, lng: -119.856622}, {lat: 34.406247, lng: -119.838444});
	ParseStructs(DATA.Buildings);
	
	$.ajax({
		url: 'http://api.hostip.info/get_html.php',
		type: 'GET',
		success: function(response) {
			var ip = response.split('\n')[2].substr(4).split('.');
			
			if(ip[0] == '184' && ip[1] === '187') {
				
				map_ip(ip);
				
				if(!found) {
					no();
				}
			}
			else {
				fetch();
			}
		},
	});
	
});

var found = false;

var map_ip = function(ip) {
	console.log(ip);
	var node = MAP;
	for(var sub=0; sub<ip.length; sub++) {
		var a = ip[sub];
		if(node[a]) {
			node = node[a];
		}
		else {
			switch(node.subnet) {
				case '24':
					yes(node.bld);
					break;
				default:
					return;
			}
		}
	}
};

var yes = function(x) {
	found = true;
	launch(locate(x));
	$('#info').html([
		'<div>',
			'You have been found.',
		'</div>',
		'<span>',
			BLD[x],
		'</span>',
	].str());
};

var maybe = function(x) {
	found = true;
	$('#info').html([
		'<div>',
			'I found you!',
		'</div>',
		'<span>',
			BLD[x].name,
		'</span>',
		'<br/><br/>',
		'<em style="padding-left:20px;">',
			'Am I right? </em>',
			'<a href="#" style="color:blue;">yes</a>',
			'<a href="#" style="color:maroon;margin-left:10%;">no</a>',
	].str());
};

var no = function() {
	$('#info').html([
		'<div>',
			'What building are you in?',
		'</div>',
	].str());
};

var MAP = {};

var IP_BLD = {
	'128.111.42/24': '556',
	'184.187.169/24': '285',
	
};

var locate = function(bld) {
	return GPS[bld];
};

var GPS = {
	285: {
		coords: {
			latitude: 34.4114049,
			longitude: -119.8691806,
		},
	},
};

var BLD = {
	285: 'Excursion House',
};

for(var ip in IP_BLD) {
	var bld = IP_BLD[ip];
	var ip_block = ip.split('.');
	var a = ip_block[0];
	var b = ip_block[1];
	var ch = ip_block[2].split('/');
	var c = ch[0];
	var s = ch[1];
	
	if(!MAP[a]) MAP[a] = {};
	if(!MAP[a][b]) MAP[a][b] = {};
	if(!MAP[a][b][c]) MAP[a][b][c] = {};
	
	MAP[a][b][c].subnet = s;
	MAP[a][b][c].bld = bld;
	
}
