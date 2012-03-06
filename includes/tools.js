//This function is used to display/hide the sideInfoWindow
//To use, make sure the object has an id set (ex: <div id="foo">)
function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
	  e.style.display = 'none';
   else
	  e.style.display = 'block';
}

// Initialize vector layers to "Layers" pane
function initLayer(url, id) {
	var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url, {id:id, visible:false});
	map.addLayer(layer);
	return layer;
}
function initLayers(){
	recycling = initLayer("http://ags2.geog.ucsb.edu//arcgis/rest/services/icmRecyclingPoints/MapServer", "recycling");
	BikeRepairStations = initLayer("http://ags2.geog.ucsb.edu//ArcGIS/rest/services/icmBicycleRepairStations2/MapServer", "BikeRepairStations");
}

//Functions to add/remove/swap layers.
function hideDynamicLayers(layers) {
	for (var j=2, jl=map.layerIds.length; j<jl; j++) {
		var layers = map.getLayer(map.layerIds[j]);
		if (dojo.indexOf(layers) == -1) {
			layers.hide();
		}
	}
	map.removeLayer(hoverGraphicsLayerBus);
	construction.show();
}
function changeMap(layers) {
	hideDynamicLayers(layers);
	for (var i=0; i<layers.length; i++) {
		layers[i].show();
		map.setExtent(layers[i].fullExtent); //use staff.fullExtent to set all layer views to parking's largest extent. For extent of each layer, use layers[i].fullExtent 
	}
}


//Threaded Loop
(function() {
	var __func__ = 'ThreadedLoop';
	var construct = function(program) {
		var cycle_time = 10;
		var is_running;
		var timer;
		var inter_cycle = 0;
		
		var initial_loop_data = {};
		
		// begin a cycle of the loop
		var start = function() {
			inter_cycle = 0;
			timer = new Timer(cycle_time);
			program.apply(self, arguments);
		};
		
		var self = {
			loop: {},
			
			// returns true while the loop should continue
			runs: function() {
				// if the loop was cancelled, return false
				if(!is_running) {
					return false;
				}
				
				// while the loop is running...
				else {
					// update the timer
					timer();
					
					// and return the status of this cycle
					return !timer.expired;
				}
			},
			
			
			// continue the loop in a new thread
			cycle: function() {
				
				// if this loop is still alive
				if(is_running) {
					
					// start the next thread
					inter_cycle = setTimeout(start, 0);
				}
			},
			
			// terminate the loop
			die: function() {
				is_running = false;
			},
		};
		
		var public = function() {
			// set the flag that this loop is in progress
			is_running = true;
			
			// initialize the loop data
			delete self.loop;
			self.loop = $.extend(true, {}, initial_loop_data);
			self.loop.start_time = (new Date()).getTime();
			
			// start the loop in a thread
			setTimeout(start, 0);
		};
		$.extend(public, {
			
			// sets the cycle duration
			// longer cycles execute faster, shorter cycles allow for better chance of interuption
			setCycleTime: function(ms) {
				cycle_time = ms;
			},
			
			setLoopData: function(data) {
				initial_loop_data = data;
			},
			
			// interupt the loop
			interupt: function() {
				clearTimeout(inter_cycle);
				is_running = false;
			},
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		
	});
})();

//Omnibox Search
(function() {
	var __func__ = 'Omnibox';
	var construct = function(dom_node) {
		
		var threaded_search = new ThreadedLoop(function() {
			// get reference to the loop data
			var loop = this.loop;
			
			// increment loop cycle counter
			loop.cycles += 1;
			
			// fetch the value of the current index and length
			var i = loop.index;
			var length = loop.length;
			
			// while the thread runs
			while(this.runs()) {
				
				i += 1;
				if(i === length) {
					console.info(global,': search took ',loop.cycles,' cycles in ',Benchmark.highlight(((new Date()).getTime()-loop.start_time)+'ms'));
					return this.die();
				}
			}
			
			// store the value of the index back to the loop data
			loop.index = i;
			
			// continue executing this loop
			this.cycle();
		});
		
		threaded_search.setLoopData({
			index: 0,
			cycles: 0,
			length: 20000,
		});
		threaded_search.setCycleTime(10);
		
		
		var self = {
			keyup: function() {
				
			},
			keydown: function(e) {
				threaded_search.interupt();
				
				threaded_search();
			},
		};
		
		/** dojo **/
		dojo.connect(dom_node, 'onkeyup', self.keyup);
		dojo.connect(dom_node, 'onkeydown', self.keydown);
		/** -/end/- **/
		
		var public = function() {
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
	});
})();