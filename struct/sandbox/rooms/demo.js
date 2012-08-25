

Benchmark.setFormat('ms');
var downloadRooms = 'download rooms and parse JSON';
var downloadBuildings = 'download buildings and parse JSON';

var roomLookup = 'searching for room and generating extent';

var remoteLookup = 'querying api for room';


var total = 0;
var number = 0;

$(document).ready(function() {
	
	
	// downloading data first so everything is client-side
	if(cache) {
		
		
		var BLD;
		var ROOMS;
		
		// when the enter key is pressed
		$('#roomLookup').keydown(
			function(e) {
				if(e.which === 13) {
					var bld = $('#bldLookup').val();
					var value = this.value;
					
					// lookup the building and roon number
					Benchmark.start(roomLookup);
					var room = ROOMS[BLD[bld]][value];
					console.log(room);
					var extent = {
						xmin: room[0],
						ymin: room[1],
						xmax: room[2],
						ymax: room[3],
					};
					total += Benchmark.stop(roomLookup);
					number += 1;
					console.log(extent);
				}
			});
	
		// download the rooms json file [410kb]
		Benchmark.start(downloadRooms);
		$.ajax({
			url: 'rooms-ideal.json',
			dataType: 'json',
			beforeSend: function() {
			},
			success: function(json) {
				ROOMS = json;
				Benchmark.stop(downloadRooms);
			},
		});
		
		// download the file that maps building names to building ids [2kb]
		Benchmark.start(downloadBuildings);
		$.ajax({
			url: 'buildings.json',
			dataType: 'json',
			beforeSend: function() {
			},
			success: function(json) {
				BLD = json;
				Benchmark.stop(downloadBuildings);
			},
		});
	}
	
	
	// using a remote system to retrieve informatino
	else {
		
		// when the enter key is pressed
		$('#roomLookup').keydown(
			function(e) {
				if(e.which === 13) {
					var bld = $('#bldLookup').val();
					var value = this.value;
					
					// query the api for the room
					Benchmark.start(remoteLookup);
					$.ajax({
						url: 'get.room.php?b='+bld+'&r='+value,
						dataType: 'json',
						success: function(json) {
							total += Benchmark.stop(remoteLookup);
							number += 1;
							console.log(json);
						},
					});
				}
			});
	}
	
});


var average = function() {
	return total / number;
};