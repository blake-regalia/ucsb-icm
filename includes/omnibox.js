


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