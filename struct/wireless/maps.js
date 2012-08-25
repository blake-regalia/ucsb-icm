
/** Download **/
(function() {
	var queue = {
		pending: 0,
		index: 0,
	};
	var self = {
		listeners: [],
		ready: function() {
			while(self.listeners.length) {
				self.listeners.shift()();
			}
		},
	};
	var global = window.Download = function() {
		for(var i=0; i!==arguments.length; i++) {
			var ajax_options = arguments[i];
			
			var index = queue.index++;
			ajax_options.source_success = ajax_options.success;
			
			ajax_options.success = (function() {
				var own = this;
				return function() {
					own.success.apply(window,arguments);
					Download.complete(index);
				};
			}).apply({success:ajax_options.source_success,w:ajax_options.url});
			
			queue.pending += 1;
			$.ajax(ajax_options);
		}
	};
	$.extend(global, {
		ready: function(callback) {
			self.listeners.push(callback);
		},
		complete: function(index) {
			queue.pending -= 1;
			if(!queue.pending) {
				self.ready();
			}
		},
	});
})();


$(document).ready(function() {
	
	
	Controls.init(Simulation.variables);
	Information.init(Simulation.information);
	
	Download.ready(function() {
		Simulation.ready();
		$('input.emulate').attr('disabled',false);
	});
	
	
	GoogleMaps();
	
});


/** GoogleMaps **/
(function() {
	var map = false;
	var overlays = [];

	var self = {
		randomColor: function() {
			/*
			return ['rgb(',
				Math.round(Math.random()*256),',',
				Math.round(Math.random()*256),',',
				Math.round(Math.random()*256),
			')'].str();
			*/
			
			return ['hsl(',
				Math.round(Math.random()*360),',',
				Math.round(Math.random()*70+30),'%,',
				Math.round(Math.random()*65),'%',
			')'].str()
		},
	};
		
	var global = window.GoogleMaps = function() {
		var latlng = new google.maps.LatLng(
			34.414699,-119.846195
		);
			
		var options = {
			zoom: 17,
			mapTypeId: 'roadmap',
			center: latlng,
			streetViewControl: false,
		};
		
		map = new google.maps.Map(
			$('#map_canvas')[0],
			options
		);
		
	};
	$.extend(global, {
		test: function() {
			
		},
		clean: function() {
			while(overlays.length) {
				overlays.shift().setMap(null);
			}
			return map;
		},
		trace: function(wlog) {
			var count = 0;
			
			for(var hash in wlog) {
				var user = wlog[hash];
				
				var paths = [];
				var points = new google.maps.MVCArray();
				
				var last = {lat:0,lng:0,ts:0};
				
				for(var i=0; i!==user.length; i++) {
					
					var entry = user[i];
					var latlng = Campus.lookup(entry.ap);
					if(!latlng) continue;
					if(points.length && (entry.ts - last.ts) > Simulation.variables.traveled_in_minutes*60) {
						if(points.length > 1) {
							Simulation.information.segments_drawn += points.length - 1;
							paths.push(points);
						}
						points = new google.maps.MVCArray();
					}
					if(latlng.lat != last.lat || latlng.lng != last.lng) {
						var offset = Campus.random_offset(latlng);
						points.push(new google.maps.LatLng(offset.lat, offset.lng));
					}
					last = latlng;
					last.ts = entry.ts;
				}
				
				
				if(points.length > 1) {
					paths.push(points);
					Simulation.information.segments_drawn += points.length - 1;
				}
				
				
				if(paths.length) {
					for(var i=0; i!==paths.length; i++) {
						var path = paths[i];
						var polyline = new google.maps.Polyline({
							map: map,
							path: path,
							strokeColor: self.randomColor(),
							strokeOpacity: Simulation.variables.general_opacity,
						});
						overlays.push(polyline);
					}
				}
				
				if(++count > Simulation.variables.sample_size) break;
			}
		},
		
		traceUsers: function(wlog, users) {
			var count = 0;
			
			for(var hash in wlog) {
				if(users.indexOf(hash) === -1) {
					continue;
				}
				var user = wlog[hash];
				
				var paths = [];
				var points = new google.maps.MVCArray();
				
				var last = {lat:0,lng:0,ts:0};
				
				for(var i=0; i!==user.length; i++) {
					
					var entry = user[i];
					var latlng = Campus.lookup(entry.ap);
					if(!latlng) continue;
					if(points.length && (entry.ts - last.ts) > Simulation.variables.traveled_in_minutes*60) {
						if(points.length > 1) {
							Simulation.information.segments_drawn += points.length - 1;
							paths.push(points);
						}
						points = new google.maps.MVCArray();
					}
					if(latlng.lat != last.lat || latlng.lng != last.lng) {
						var offset = Campus.random_offset(latlng);
						var pt = new google.maps.LatLng(offset.lat, offset.lng);
						points.push(pt);
						new google.maps.Marker({
							map: map,
							position: pt,
							title: (new Date(entry.ts*1000)).toString()
						});
					}
					last = latlng;
					last.ts = entry.ts;
				}
				
				
				if(points.length > 1) {
					paths.push(points);
					Simulation.information.segments_drawn += points.length - 1;
				}
				
				
				if(paths.length) {
					for(var i=0; i!==paths.length; i++) {
						var path = paths[i];
						var polyline = new google.maps.Polyline({
							map: map,
							path: path,
							strokeColor: self.randomColor(),
							strokeOpacity: Simulation.variables.general_opacity,
						});
						overlays.push(polyline);
					}
				}
				
				if(++count > Simulation.variables.sample_size) break;
			}
		},
	});
})();


/** Campus **/
(function() {
	var global = window.Campus = function() {
	};
	$.extend(global, {
		network: false,
		buildings: false,
		missing_bid: {},
		wireless_log: {
			time: false,
			user: false,
		},
		quick_lookup: function(bid) {
			var bld = Campus.buildings[bid]
			
			if(!bld) {
				if(!Campus.missing_bid[bid]) {
					Campus.missing_bid[bid] = bid;
					console.error('no bld: ',bid);
				}
				return false;
			}
			return bld.center;
		},
		lookup: function(bldStr) {
			var bid = bldStr.split('-')[0];
			var bld = Campus.buildings[bid];
			if(!bld) {
				if(!Campus.missing_bid[bid]) {
					Campus.missing_bid[bid] = bid;
					console.error('no bld: ',bid);
				}
				return false;
			}
			return {
				lng: (bld.clips.xmin+bld.clips.xmax)/2,
				lat: (bld.clips.ymin+bld.clips.ymax)/2,
			};
		},
		random_offset: function(latlng) {
			var r = Simulation.variables.access_point_radius;
			var theta = Math.random()*2*Math.PI;
			return {
				lat: latlng.lat + r*Math.cos(theta),
				lng: latlng.lng + r*Math.sin(theta),
			};
		},
	});
	
})();



/** Controls **/
(function() {
	var container = '#dash';
	var global = window.Controls = function() {};
	$.extend(global, {
		init: function(namespace) {
			var b = [];
			for(var each in namespace) {
				b.str('<div class="control">',
						'<span>',each,':&nbsp;</span>',
						'<input type="text" class="value" name="',each,'" value="',namespace[each],'" />',
					'</div>');
			}
			b.str('<div class="button">',
					'<input class="update" type="button" value="update" />',
				'</div>',
				'<div class="button">',
					'<input class="emulate" type="button" value="run emulation" disabled="true" />',
				'</div>');
			$(b.str()).appendTo($(container));
			
			$(container).find('input.update').click(function() {
				$(container).find('input.value').each(function() {
					var value = $(this).val();
					if(parseFloat(value) == value) value = parseFloat(value);
					namespace[$(this).attr('name')] = value;
				});
				Simulation.update();
			});
			
			$(container).find('input.emulate').click(function() {
				
				$(container).find('input.value').each(function() {
					var value = $(this).val();
					if(parseFloat(value) == value) value = parseFloat(value);
					namespace[$(this).attr('name')] = value;
				});
				
				if($(this).data('mode') != 'stop') {
					$(this).data('mode', 'stop');
					$(this).val('stop emulation');
					Simulation.run();
				}
				else {
					$(this).data('mode', 'run');
					$(this).val('run emulation');
					Simulation.stop();
				}
			});
		},
	});
})();


/** Information **/
(function() {
	var container = '#info';
	var namespace;
	var global = window.Information = function() {
		
	};
	$.extend(global, {
		init: function(ns) {
			namespace = ns;
			var b = [];
			for(var each in namespace) {
				b.str('<div class="control">',
						'<span>',each,':&nbsp;</span>',
						'<input type="text" class="value" disabled="true" name="',each,'" value="" />',
					'</div>');
			}
			$(b.str()).appendTo($(container));
		},
		load: function() {
			$(container).find('input.value').each(function() {
				$(this).val(namespace[$(this).attr('name')]);
			});
		},
	});
})();





(function() {
	var index_log;
	var google_map;
	var simulation;
	
	var path_simulation = function(wlog) {
		return {
			play: function() {
				global.information.segments_drawn = 0;
				GoogleMaps.trace(wlog);
				Information.load();
			},
			stop: function() {
				GoogleMaps.clean();
			},
		};
	};
	
	var event_simulation = function(wlog) {
		var sim = {
			time: 0,
			step: 2,
			laps: 0,
			start: Infinity,
			finish: 0,
			stop: false,
		};
		
		for(var time in wlog) {
			sim.start = Math.min(time, sim.start);
			sim.finish = Math.max(time, sim.finish);
		}
		
		global.information.earliest_data = (new Date(sim.start*1000)).toUTCString();
		global.information.latest_data = (new Date(sim.finish*1000)).toUTCString();
		Information.load();
		
		
		var circleObj = {};
		
		var self = this;
		var queue = [];
		var decremental_rate = 0.5;
		var update_steps = 5;
		
		$.extend(self, {
			reset: function() {
				sim.time = sim.start;
				while(queue.length) {
					queue.shift().setMap(null);
				}
			},
			step: function() {
				for(var time=sim.time; time<sim.time+sim.step; time++) {
					var events = wlog[time];
					if(events) {
						for(var i in events) {
							var latlng = Campus.quick_lookup(events[i].bid);
							latlng = Campus.random_offset(latlng);
							circleObj.center = new google.maps.LatLng(latlng.lat,latlng.lng);
							var c = new google.maps.Circle(circleObj);
							queue.push(c);
						}
					}
				}
				
				for(var g=0; g<queue.length; g++) {
					var r = queue[g].getRadius() - decremental_rate;
					if(r <= 0) {
						queue.shift().setMap(null);
						continue;
					}
					var q = r / circleObj.radius;
					queue[g].setOptions({
						fillOpacity: q,
						radius: r,
					});
				}
				sim.time += sim.step;
				sim.laps += 1;
				if(sim.laps % update_steps === 0) {
					global.information.simulation_time = (new Date(sim.time*1000)).toUTCString();
					Information.load();
				}
				if(!sim.stop) setTimeout(self.step, 0);
			},
			play: function(percent_through) {
				sim.stop = false;
				circleObj = {
					clickable: false,
					fillOpacity: 1,
					map: google_map,
					strokeOpacity: 0,
					fillColor: global.variables.general_color,
					radius: 10,
				};
				self.reset();
				sim.time = Math.round(sim.start + (sim.finish-sim.start)*percent_through);
				console.log(percent_through);
				console.log((sim.finish-sim.start)*percent_through);
				self.step();
			},
			stop: function() {
				sim.stop = true;
			},
		});
	};
	var self = {
		step: function() {
			
		},
		updateInformation: function() {
		},
	};
	var global = window.Simulation = {
		variables: {},
		information: {},
		json: false,
		mode: false,
		update: function() {
			Information.load();
		},
		run: function() {
			google_map = GoogleMaps.clean();
			self.updateInformation();
			Information.load();
			simulation.play(global.variables.start_at_percentage);
		},
		stop: function() {
			simulation.stop();
		},
		ready: function() {
			
			console.log(global.mode);
			switch(global.mode) {
				case 'event':
					simulation = new event_simulation(Campus.wireless_log.time);
					break;
				case 'graph':
					simulation = new path_simulation(Campus.wireless_log.user);
					global.information.total_samples = 0;
					for(var e in Campus.wireless_log.user) global.information.total_samples +=1;
					break;
				case 'sim':
				
					break;
			}
			
			Information.load();
			
			if(global.auto_start) $('.emulate').click();
		},
	};
})();

(function() {
	var sim_mode;
	var mode = window.location.hash || window.location.search;
	var uri_params = mode.split('&');
	var arg = {};
	for(var i=1; i!== uri_params.length; i++) {
		var param = uri_params[i].split('=');
		arg[param[0]] = param[1];
		Simulation.auto_start = true;
	}
	Simulation.mode = uri_params[0].substr(1);
	switch(Simulation.mode) {
		case 'event':
			Simulation.json = 'time';
			Simulation.variables = {
				start_at_percentage: arg.s? parseFloat(arg.s): 0.63,
				access_point_radius: 0.0003,
				general_color: 'red',
			};
			Simulation.information = {
				earliest_data: '',
				latest_data: '',
				simulation_time: 0,
			};
			break;
		case 'graph':
			Simulation.json = 'user';
			Simulation.variables = {
				traveled_in_minutes: arg.t? parseFloat(arg.t): 300,
				access_point_radius: arg.a? parseFloat(arg.a): 0.0001,
				sample_size: arg.s? parseFloat(arg.s): 100,
				general_opacity: arg.o? parseFloat(arg.o): 0.3,
			};
			Simulation.information = {
				total_samples: false,
				segments_drawn: 0,
			};
			break;
		case 'sim':
			Simulation.json = 'user';
			Simulation.variables = {
				traveled_in_minutes: arg.t? parseFloat(arg.t): 300,
				access_point_radius: arg.a? parseFloat(arg.a): 0.0001,
				sample_size: arg.s? parseFloat(arg.s): 100,
				general_opacity: arg.o? parseFloat(arg.o): 0.3,
			};
			Simulation.information = {
				total_samples: false,
				segments_drawn: 0,
			};
			break;
	}
	
	
	Download(
		{
			url: 'campus_buildings.json',
			dataType: 'json',
			success: function(json) {
				Campus.buildings = json;
			},
		},
		
		{
			url: 'campus_network.json',
			dataType: 'json',
			success: function(json) {
				Campus.network = json;
			},
		},
		
		/**
		{
			url: 'wireless_log.user.json',
			dataType: 'json',
			success: function(json) {
				Campus.wireless_log.user = json;
			},
		},
		/**/
		
		{
			url: ['wireless_log.',Simulation.json,'.json'].str(),
			dataType: 'json',
			success: function(json) {
				Campus.wireless_log[Simulation.json] = json;
			},
		}
	);
})();