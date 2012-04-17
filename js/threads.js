

(function() {
	var __func__ = 'ThreadedLoop';
	var construct = function(program) {
		var cycle_time = 10;
		var is_running;
		var timer;
		var inter_cycle = 0;
		
		var initial_loop_data = {};
		var exec_on_start = function(){};
		
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
			exec_on_start.apply(self);
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
			
			setSleepTime: function(ms) {
				sleep_time = ms;
			},
			
			setLoopData: function(data) {
				initial_loop_data = data;
			},
			
			onStart: function(exec) {
				exec_on_start = exec;
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
